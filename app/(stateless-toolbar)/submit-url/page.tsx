"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import BrowserIcon from "@/assets/browser-icon.svg"
import Background from "@/assets/submit-url-background.svg"
import { useJwtStore } from "@/store/jwt"
import { useReceiptsStore } from "@/store/receipts"
import { Tag } from "@/types"
import { Ban, Info, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import RequireAuth from "@/components/helper/RequireAuth"
import Select from "@/app/(stateless-toolbar)/submit-url/components/TagSelect"

import { SubmitSiteFrame } from "./components/SubmitSiteFrame"
import Slider from "./components/slider"

const PLACEHOLDER_ERROR: WebsiteSubmissionError = {
  duplicateUrl: false,
  missingRequired: false,
  showError: false,
}

const PLACEHOLDER_URL = {
  input: "",
  preview: "",
}

type WebsiteSubmissionError = {
  duplicateUrl: boolean
  missingRequired: boolean
  showError: boolean
}

type WebsiteUrl = {
  input: string
  preview: string
}

const SubmitUrl = () => {
  const { updateList } = useReceiptsStore()
  const { token } = useJwtStore()

  const [creatingTag, setCreatingTag] = useState<boolean>(false)
  const [description, setDescription] = useState<string>("")
  const [duplicateTagError, setDuplicateTagError] = useState<boolean>(false)
  const [newTag, setNewTag] = useState("")
  const [previewPasses, setPreviewPasses] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([])
  const [sendStatus, setSendStatus] = useState<"sending" | "sent" | "">("")
  const [showTagInput, setShowTagInput] = useState(false)
  const [submissionError, setSubmissionError] =
    useState<WebsiteSubmissionError>(PLACEHOLDER_ERROR)
  const [tags, setTags] = useState<Array<Tag>>([])
  const [url, setUrl] = useState<WebsiteUrl>(PLACEHOLDER_URL)

  const addSelected = (option: string) => {
    const tag = tags.find((tag: Tag) => tag.name === option)
    setSelectedTags((prev: Tag[]) => [...prev, tag!])
  }

  const createTag = async () => {
    setCreatingTag(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`, {
      body: JSON.stringify({ name: newTag }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.ok) {
      const { tag } = await res.json()
      setTags((prev: Tag[]) => [...prev, tag])
      hideNewTag()
    } else {
      const { error } = await res.json()
      if (error.includes("duplicate key")) {
        setDuplicateTagError(true)
      } else throw Error
    }
    setCreatingTag(false)
  }

  const hideErrorDisplay = () => {
    setTimeout(() => {
      setSubmissionError((prev: WebsiteSubmissionError) => ({
        ...prev,
        showError: false,
      }))
    }, 3000)
  }

  const handleTagInput = (val: string) => {
    setNewTag(val)
    setDuplicateTagError(false)
  }

  const handleUrlInput = (val: string) => {
    setUrl((prev: WebsiteUrl) => ({ ...prev, input: val }))
    setSubmissionError((prev: WebsiteSubmissionError) => ({
      ...prev,
      duplicateUrl: false,
    }))
  }

  const hasRequired = () => {
    return description && previewPasses && selectedTags.length && url.input
  }

  const hideNewTag = () => {
    setDuplicateTagError(false)
    setNewTag("")
    setShowTagInput(false)
  }

  const getTags = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/tag"
      ).then((res) => res.json())
      if ("tags" in response) {
        setTags(response.tags)
      }
    } catch (error) {
      console.log(error)
      setTags([])
    }
  }

  const onClickShareItHandler = async () => {
    if (!hasRequired()) {
      setSubmissionError((prev: WebsiteSubmissionError) => ({
        ...prev,
        missingRequired: true,
        showError: true,
      }))
      hideErrorDisplay()
      return
    }
    setSendStatus("sending")
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tags: selectedTags.map((tag: Tag) => tag._id),
        title: description,
        url: url.input,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      updateList({
        object: data.newUrl,
        receipt: data.receipt,
        type: "Url",
      })
      setSendStatus("sent")
      setSubmissionError(PLACEHOLDER_ERROR)
      setTimeout(() => {
        setDescription("")
        setPreviewPasses(false)
        setUrl(PLACEHOLDER_URL)
        setSelectedTags([])
        setSendStatus("")
      }, 3000)
    } else {
      const { error } = await res.json()
      let duplicateUrl = false
      if (error.includes("URL already exists")) {
        duplicateUrl = true
      }
      setSubmissionError((prev: WebsiteSubmissionError) => ({
        ...prev,
        duplicateUrl,
        showError: true,
      }))
      hideErrorDisplay()
      setSendStatus("")
    }
    setDuplicateTagError(false)
  }

  const optionNames = useMemo(() => {
    return tags.map((tag: Tag) => tag.name)
  }, [tags])

  const removeSelected = (index: number) => {
    setSelectedTags((prev: Tag[]) => prev.filter((_, i) => i !== index))
  }

  const selectedNames = useMemo(() => {
    return selectedTags.map((tag: Tag) => tag.name)
  }, [selectedTags])

  const urlError = useMemo(() => {
    if (submissionError.duplicateUrl) {
      return "* Url already exists"
    } else if (submissionError.missingRequired && !url.input) {
      return "* Url required"
    }
    return ""
  }, [submissionError, url])

  useEffect(() => {
    getTags()
  }, [])

  return (
    <RequireAuth>
      <div
        className="flex h-full items-start justify-center bg-shark-900 bg-center bg-no-repeat p-2 md:items-center"
        style={{
          backgroundImage: `url(${Background.src})`,
          backgroundSize: "90%",
        }}
      >
        <div className="h-full w-full max-w-[1130px] rounded-[32px] bg-c4-gradient-separator p-px md:h-[501px]">
          <div className="h-full overflow-y-auto rounded-[32px] bg-shark-950 p-4 pb-16 md:overflow-visible md:p-10">
            <div className="flex h-full flex-col items-start justify-between gap-10 md:flex-row">
              <div className="w-full flex-1">
                <div className="flex items-center gap-4 text-4xl">
                  <div className="md:whitespace-nowrap">Add a website</div>
                  <Image alt="Browser" className="h-8 w-8" src={BrowserIcon} />
                </div>
                <div className="mt-10 text-lg text-shark-50">Website URL</div>
                <input
                  className={`mt-3 w-full rounded-lg border-[1.5px] bg-shark-950 ${
                    urlError ? "border-red-500" : "border-shark-800"
                  } p-3 text-lg placeholder:text-shark-400`}
                  onBlur={() =>
                    setUrl((prev: WebsiteUrl) => ({
                      ...prev,
                      preview: prev.input,
                    }))
                  }
                  onChange={(e) => handleUrlInput(e.target.value)}
                  placeholder="Paste URL here"
                  value={url.input}
                />
                {urlError && (
                  <div className="mt-1 text-xs text-red-500">{urlError}</div>
                )}
                <div className="mt-6 flex text-lg text-shark-50">
                  Short description
                </div>
                <input
                  className={`mt-3 w-full ${
                    submissionError.missingRequired && !description
                      ? "border-red-500"
                      : "border-shark-800"
                  } rounded-lg border-[1.5px] bg-shark-950 p-3 text-lg placeholder:text-shark-400`}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="This site is about..."
                  value={description}
                />
                {submissionError.missingRequired && !description && (
                  <div className="mt-1 text-xs text-red-500">
                    * Description required
                  </div>
                )}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-lg text-shark-50">Choose tags</div>
                  {showTagInput ? (
                    <div className="flex items-center gap-2">
                      <div className="flex grow items-center">
                        {!creatingTag && (
                          <Button
                            className="h-fit p-2"
                            onClick={() => hideNewTag()}
                            variant="ghost"
                          >
                            <Ban size={16} />
                          </Button>
                        )}
                        <Button
                          className="h-fit grow p-2"
                          loading={creatingTag}
                          loaderIconSize={14}
                          loadingText="Creating"
                          onClick={() => !creatingTag && createTag()}
                          variant="ghost"
                        >
                          Create
                          {!creatingTag && <Plus size={16} />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="h-fit p-2"
                      onClick={() => setShowTagInput(true)}
                      variant="ghost"
                    >
                      <div>Create tag</div>
                      <Plus size={14} />
                    </Button>
                  )}
                </div>
                {showTagInput ? (
                  <input
                    className={`mt-3 w-full rounded-lg  border-[1.5px] p-3 ${
                      duplicateTagError ? "border-red-500" : "border-shark-800"
                    } bg-shark-950 px-2 placeholder:text-shark-400`}
                    onChange={(e) => handleTagInput(e.target.value)}
                    placeholder="Tag name..."
                    value={newTag}
                  />
                ) : (
                  <Select
                    error={
                      submissionError.missingRequired && !selectedTags.length
                    }
                    errorMsg="* At lest one tag must be selected"
                    onSelect={addSelected}
                    onRemove={removeSelected}
                    options={optionNames}
                    selected={selectedNames}
                  />
                )}
                {duplicateTagError && (
                  <div className="mt-1 text-xs text-red-500">
                    * Tag already exists
                  </div>
                )}
              </div>
              <div className="flex h-full w-full flex-1 flex-col">
                <div className="text-xl text-shark-50">Preview</div>
                <SubmitSiteFrame url={url.preview} />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      className="h-[18px] w-[18px] shrink-0 cursor-pointer rounded border border-shark-500 bg-shark-700"
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
                      Some websites don&apos;t allow other applications to
                      render their website in an iframe. Make sure you the
                      preview renders correctly so others can enjoy this
                      channel.
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="mt-1 h-[14px] text-xs text-red-500">
                  {submissionError.missingRequired && !previewPasses
                    ? "* Preview must pass"
                    : ""}
                </div>
                <div className="my-6 md:mb-0">
                  <Slider
                    disabled={creatingTag}
                    hasError={submissionError.showError}
                    onSubmit={onClickShareItHandler}
                    sending={sendStatus === "sending"}
                    sent={sendStatus === "sent"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

export default SubmitUrl
