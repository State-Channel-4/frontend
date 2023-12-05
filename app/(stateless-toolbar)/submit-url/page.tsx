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
      className="flex h-full items-center justify-center bg-shark-900 bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: "90%",
      }}
    >
      <div className="w-full max-w-[1130px] rounded-[32px] bg-c4-gradient-separator p-px">
        <div className="relative h-[501px] rounded-[32px] bg-shark-950 p-10 pb-16">
          <div className="flex h-full items-start justify-between gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-6 text-5xl ">
                <div>Add a website</div>
                <Image alt="Browser" className="h-10 w-10" src={BrowserIcon} />
              </div>
              <div className="mt-10 text-xl text-shark-50">Website URL</div>
              <input
                className="mt-4 w-full rounded-lg border-[1.5px] border-shark-800 bg-shark-950 p-3 text-lg placeholder:text-shark-400"
                placeholder="Paste URL here"
                onChange={(e) => setUrl(e.target.value)}
                value={url ?? ""}
              />
              <div className="mt-6 flex items-center gap-2">
                <div className="text-xl text-shark-50">Short description</div>
                <div className="text-sm text-shark-300">(Optional)</div>
              </div>
              <input
                className="mt-4 w-full rounded-lg border-[1.5px] border-shark-800 bg-shark-950 p-3 text-lg placeholder:text-shark-400"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="This site is about..."
                value={description}
              />
              <div className="mt-6 text-xl text-shark-50">Choose tags</div>
              <Select
                onSelect={addSelected}
                onRemove={removeSelected}
                options={optionNames}
                selected={selectedNames}
              />
            </div>
            <div className="flex h-full flex-1 flex-col">
              <div className="text-xl text-shark-50">Preview</div>
              <SubmitSiteFrame url={url} />
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    className="h-[18px] w-[18px] cursor-pointer rounded border border-shark-500 bg-shark-700"
                    checked={previewPasses}
                    onChange={() => setPreviewPasses(!previewPasses)}
                    type="checkbox"
                  />
                  <div className="text-sm text-shark-200">
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
                    Some websites don&apos;t allow other applications to render
                    their website in an iframe. Make sure you the preview
                    renders correctly so others can enjoy this channel.
                  </PopoverContent>
                </Popover>
              </div>
              <div className="mt-8">
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
    </div>
  )
}

export default SubmitUrl
