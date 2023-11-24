"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import BrowserIcon from "@/assets/browser-icon.svg"
import InfoIcon from "@/assets/info-icon.svg"
import { useEncryptedStore } from "@/store/encrypted"
import { usePasswordStore } from "@/store/password"
import { Tag, TagMap } from "@/types"
import { Wallet } from "ethers"

import { getRawTransactionToSign } from "@/lib/utils"
import Select from "@/components/ui/select"
import RequireAuth from "@/components/helper/RequireAuth"

import { SubmitSiteFrame } from "./components/SubmitSiteFrame"
import Slider from "./components/slider"

const SubmitUrl = () => {
  const { encrypted } = useEncryptedStore()
  const { password, token, userId } = usePasswordStore()
  const [isLoading, setIsLoading] = useState(false)
  const [previewPasses, setPreviewPasses] = useState(false)
  const [selectedTags, setSelectedTags] = useState<TagMap>(new Map())
  const [showTags, setShowTags] = useState<TagMap>(new Map())
  // const [title, setTitle] = useState<string | null>(null)
  const [url, setUrl] = useState<string>("")

  // const onTitleChangeHandler = (e: { target: { value: string } }) => {
  //   setTitle(e.target.value)
  // }

  const onUrlChangeHandler = (e: { target: { value: string } }) => {
    setUrl(e.target.value)
  }

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
    setIsLoading(true)
    const functionName = "submitURL"
    // const params = [title, url, Array.from(selectedTags.keys())]
    const params = [url, Array.from(selectedTags.keys())]
    const metaTx = await getRawTransactionToSign(functionName, params)
    const wallet = Wallet.fromEncryptedJsonSync(encrypted!, password!)
    const signedSubmitURLtx = await wallet?.signTransaction(metaTx)
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        signedMessage: signedSubmitURLtx,
        address: wallet.address,
        functionName: functionName,
        params: params,
        // TODO: temp params for mongodb
        userId: userId,
      }),
    }).then((res) => res.json())
    // setTitle(null)
    setUrl("")
    setSelectedTags(new Map())
    setIsLoading(false)
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
              <Select />
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
          {/* <div className="p-px bg-c4-gradient-separator rounded-[32px] absolute top-[calc(100%-14px)] left-1/2 transform -translate-x-1/2 w-full max-w-[608px]">
            <div className="rounded-[32px] py-6 px-16 bg-shark-950"> */}
          {/* <div className="border border-shark-600 py-4 px-16 rounded-full"></div> */}
          {/* <Slider onSubmit={() => null} />
            </div>
          </div> */}
        </div>
      </div>
    </div>
    // <RequireAuth>
    //   <div className="mx-7 flex flex-col justify-center lg:container">
    //     <div className="my-5 flex h-40 justify-center rounded-br-3xl rounded-tl-3xl bg-c4-gradient-main">
    //       <Image priority src={Channel4IconBlack} alt="Channel 4 icon black" />
    //     </div>
    //     <h2 className="my-5">
    //       Share your favourite websites & <span className="">spark joy</span> in
    //       our community with <span className="">random gems!</span> 🌐✨
    //     </h2>
    //     <div className="space-y-2 pb-4">
    //       <p>Enter title here</p>
    //       <input
    //         type={"text"}
    //         value={title || ""}
    //         onChange={onTitleChangeHandler}
    //         className="h-12 w-full rounded-lg bg-gray px-2 py-1"
    //       />
    //     </div>
    //     <div className="space-y-2 pb-4">
    //       <p>Enter URL here</p>
    //       <input
    //         type={"text"}
    //         value={url || ""}
    //         onChange={onUrlChangeHandler}
    //         className="h-12 w-full rounded-lg bg-gray px-2 py-1"
    //       />
    //     </div>
    //     <div className="space-y-2 pb-4">
    //       <p>Add tags (optional)</p>
    //       <TagRow
    //         selectable
    //         shownTags={showTags}
    //         selectedTags={selectedTags}
    //         setSelectedTags={setSelectedTags}
    //       />
    //     </div>
    //     <Button
    //       variant="outline"
    //       loading={isLoading}
    //       disabled={isLoading}
    //       onClick={onClickShareItHandler}
    //       className="rounded-full border-green-500 py-6 text-green-500"
    //     >
    //       Share it with the world
    //     </Button>
    //   </div>
    // </RequireAuth>
  )
}

export default SubmitUrl
