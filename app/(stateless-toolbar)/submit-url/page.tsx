"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import BrowserIcon from "@/assets/browser-icon.svg"
import InfoIcon from "@/assets/info-icon.svg"
import { useAuth } from "@/contexts/AuthContext"
import { usePasswordStore } from "@/store/password"
import { Tag, TagMap } from "@/types"
import { Wallet } from "ethers"

import { getRawTransactionToSign } from "@/lib/utils"
import Select from "@/components/ui/select"
import RequireAuth from "@/components/helper/RequireAuth"

import { SubmitSiteFrame } from "./components/SubmitSiteFrame"
import Slider from "./components/slider"

const SubmitUrl = () => {
  const { token, userId } = usePasswordStore()
  const [description, setDescription] = useState<string>("")
  const [errorSending, setErrorSending] = useState<Error | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [previewPasses, setPreviewPasses] = useState(false)
  const [selectedTags, setSelectedTags] = useState<TagMap>(new Map())
  const [showTags, setShowTags] = useState<TagMap>(new Map())
  const [sent, setSent] = useState(false)
  const [url, setUrl] = useState<string>("")

  const getTags = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/tag"
      ).then((res) => res.json())
      let tags: TagMap = new Map()
      if ("tags" in response) {
        response.tags.forEach((tag: Tag) => {
          tags.set(tag._id, tag)
        })
      }
      setShowTags(tags)
    } catch (error) {
      console.log(error)
      setShowTags(new Map())
    }
  }

  useEffect(() => {
    getTags()
  }, [])

  const onClickShareItHandler = async () => {
    setIsSending(true)
    const functionName = "submitURL"
    const params = [description, url, Array.from(selectedTags.keys())]

    const metaTx = await getRawTransactionToSign(functionName, params)
    // const signedSubmitURLtx = await wallet
    //   ?.signTransaction(metaTx)
    const signedSubmitURLtx = ""
    await fetch(process.env.NEXT_PUBLIC_API_URL + "/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        signedMessage: signedSubmitURLtx,
        address: "",
        functionName: functionName,
        params: params,
        // TODO: temp params for mongodb
        userId: userId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error
        }
        setSent(true)
        setTimeout(() => {
          setDescription("")
          setUrl("")
          setSelectedTags(new Map())
          setSent(false)
        }, 3000)
      })
      .catch((err) => {
        console.log("Flag error")
        setErrorSending(err)
        setTimeout(() => {
          setErrorSending(null)
        }, 3000)
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  return (
    <div className="flex items-center h-full justify-center bg-cover bg-center bg-shark-900">
      <div className="bg-c4-gradient-separator p-px rounded-[32px] w-full max-w-[1130px]">
        <div className="p-10 pb-16 bg-shark-950 rounded-[32px] relative h-[506px]">
          <div className="flex gap-10 justify-between items-start h-full">
            <div className="flex-1">
              <div className="text-5xl flex items-center gap-6 ">
                <div>Add a website</div>
                <Image alt="Browser" className="w-10 h-10" src={BrowserIcon} />
              </div>
              <div className="mt-10 text-shark-50 text-xl">Website URL</div>
              <input
                className="w-full mt-4 p-3 bg-shark-950 rounded-lg border-[1.5px] border-shark-800 text-lg placeholder:text-shark-400"
                placeholder="Paste URL here"
                onChange={(e) => setUrl(e.target.value)}
                value={url ?? ""}
              />
              <div className="mt-6 flex gap-2 items-center">
                <div className="text-shark-50 text-xl">Short description</div>
                <div className="text-sm text-shark-300">(Optional)</div>
              </div>
              <input
                className="w-full mt-4 p-3 bg-shark-950 rounded-lg border-[1.5px] border-shark-800 text-lg placeholder:text-shark-400"
                placeholder="This site is about..."
              />
              <div className="text-shark-50 mt-6 text-xl">Choose tags</div>
              {/* <Select
                options={Array.from(showTags.values()).map((tag) => tag.name)}
                selected={selectedTags}
                setSelected={setSelectedTags}
              /> */}
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="text-xl text-shark-50">Preview</div>
              <SubmitSiteFrame url={url} />
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2 items-center">
                  <input
                    className="border border-shark-500 bg-shark-700 cursor-pointer h-[18px] rounded w-[18px]"
                    checked={previewPasses}
                    onChange={() => setPreviewPasses(!previewPasses)}
                    type="checkbox"
                  />
                  <div className="text-shark-200 text-sm">
                    Check this box if the website preview looks good
                  </div>
                </div>
                <Image alt="Info" className="cursor-pointer" src={InfoIcon} />
              </div>
            </div>
          </div>
          <div className="p-px bg-c4-gradient-separator rounded-[32px] absolute top-[calc(100%-14px)] left-1/2 transform -translate-x-1/2 w-full max-w-[608px]">
            <div className="rounded-[32px] py-6 px-16 bg-shark-950">
              <Slider
                disabled={!previewPasses || !url}
                error={errorSending}
                onSubmit={onClickShareItHandler}
                sending={isSending}
                sent={sent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmitUrl
