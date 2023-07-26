"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Textarea } from "./ui/textarea"

const Feedback = () => {
  const [error, setError] = useState<any>(null)
  const [Message, setMessage] = useState<string>("")
  const [processingFeedback, setProcessingFeedback] = useState<boolean>(false)
  const [btnLabel, setBtnLabel] = useState<string>("Send feedback")
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false)

  const sendFeedback = async () => {
    if (!Message) {
      setError("You forgot to type your feedback!")
      return
    }

    try {
      setProcessingFeedback(true)
      setBtnLabel("Sending...")
      const res = await fetch("/api/feedback/new", {
        method: "POST",
        body: JSON.stringify({ Message }),
      })
      const data = await res.json()
      if (data.newRecord) {
        setMessage("")
        setError(null)
        setBtnLabel("✅ Thanks for your feedback!")
        setProcessingFeedback(false)
        setFeedbackSent(true)
      }
    } catch (err) {
      console.log(err)
      setProcessingFeedback(false)
      setBtnLabel("Send feedback")
      setError(err)
    }
  }
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="absolute bottom-3 right-3 rounded-lg bg-slate-900 font-medium transition-transform transform-gpu hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background text-primary text-md"
        >
          💬 Tell us what you think
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 text-primary border-2 bg-slate-900">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="font-bold leading-none text-lg">
              Tell us what you think
            </h3>
            <div>
              <span className="text-sm">
                Thanks for using our app! We&apos;d love to hear your feedback
                here or on our
              </span>
              <Link href="https://discord.gg/76UrYgVyEx" className="p-0">
                <Button
                  variant={"link"}
                  className="p-0 pl-1 h-full text-purple-300"
                >
                  Discord
                </Button>
              </Link>
            </div>
            {!feedbackSent && (
              <>
                <div className="p-2"></div>
                <Textarea
                  placeholder="Type your feedback here..."
                  className="max-h-60"
                  value={Message}
                  onChange={(e) =>{setMessage(e.target.value); setError(null)}}
                />
                <p
                  className={cn(
                    "text-xs text-muted-foreground",
                    error && "text-red-500"
                  )}
                >
                  {error ? error : "We're humans so please be nice..."}
                </p>
                <div className="p-1"></div>
              </>
            )}
            <Button
              variant={"default"}
              size={"sm"}
              className="bg-c4-gradient-blue hover:bg-purple-600 hover:scale-105 text-white disabled:opacity-60"
              onClick={() => sendFeedback()}
              disabled={processingFeedback || feedbackSent}
            >
              {processingFeedback && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {btnLabel}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Feedback
