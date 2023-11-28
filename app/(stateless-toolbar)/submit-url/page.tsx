"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import BrowserIcon from "@/assets/browser-icon.svg"
import Background from "@/assets/submit-url-background.svg"
import { useJwtStore } from "@/store/jwt"
import { useReceiptsStore } from "@/store/receipts"
import { Tag } from "@/types"
import { Info } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Select from "@/components/ui/select"
import RequireAuth from "@/components/helper/RequireAuth"

import { SubmitSiteFrame } from "./components/SubmitSiteFrame"
import Slider from "./components/slider"

const SubmitUrl = () => {
  const { updateList } = useReceiptsStore()
  const { token } = useJwtStore()
  const [description, setDescription] = useState<string>("")
  const [errorSending, setErrorSending] = useState<Error | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [previewPasses, setPreviewPasses] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([])
  const [showTags, setShowTags] = useState<Array<Tag>>([])
  const [sent, setSent] = useState(false)
  const [url, setUrl] = useState<string>("")

  const addSelected = (option: string) => {
    const tag = showTags.find((tag) => tag.name === option)
    setSelectedTags((prev) => [...prev, tag!])
  }

  const getTags = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/tag"
      ).then((res) => res.json())
      if ("tags" in response) {
        setShowTags(response.tags)
      }
    } catch (error) {
      console.log(error)
      setShowTags([])
    }
  }

  const onClickShareItHandler = async () => {
    setIsSending(true)
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tags: selectedTags.map((tag) => tag._id),
        title: description,
        url: url,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error
        }
        setSent(true)
        setTimeout(() => {
          setDescription("")
          setPreviewPasses(false)
          setUrl("")
          setSelectedTags([])
          setSent(false)
        }, 3000)
        return res.json()
      })
      .catch((err) => {
        setErrorSending(err)
        setTimeout(() => {
          setErrorSending(null)
        }, 3000)
      })
      .finally(() => {
        setIsSending(false)
      })
    updateList({
      object: response.newUrl,
      receipt: response.receipt,
      type: "Url",
    })
  }

  const optionNames = useMemo(() => {
    return showTags.map((tag) => tag.name)
  }, [showTags])

  const removeSelected = (index: number) => {
    setSelectedTags((prev) => prev.filter((_, i) => i !== index))
  }

  const selectedNames = useMemo(() => {
    return selectedTags.map((tag) => tag.name)
  }, [selectedTags])

  useEffect(() => {
    getTags()
  }, [])

  return (
    <div
      className="flex items-center h-full justify-center bg-no-repeat bg-center bg-shark-900"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: "90%",
      }}
    >
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
                onChange={(e) => setDescription(e.target.value)}
                placeholder="This site is about..."
                value={description}
              />
              <div className="text-shark-50 mt-6 text-xl">Choose tags</div>
              <Select
                onSelect={addSelected}
                onRemove={removeSelected}
                options={optionNames}
                selected={selectedNames}
              />
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
                <Popover>
                  <PopoverTrigger className="relative flex cursor-pointer items-center gap-2 text-sm disabled:cursor-not-allowed">
                    <Info
                      className="cursor-pointer stroke-shark-300"
                      size={16}
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    alignOffset={-15}
                    className="w-64 rounded-lg border border-shark-800 bg-shark-950 p-4 text-left text-sm text-shark-50"
                    side="top"
                    sideOffset={15}
                  >
                    Some websites don't allow other applications to render their
                    website in an iframe. Make sure you the preview renders
                    correctly so others can enjoy this channel.
                  </PopoverContent>
                </Popover>
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
