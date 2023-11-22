import { useMemo, useState } from "react"
import { Range, Root, Thumb, Track } from "@radix-ui/react-slider"
import { ArrowRight, Check, Loader2 } from "lucide-react"

interface SliderProps {
  onSubmit: () => void
}

export default function Slider({ onSubmit }: SliderProps): JSX.Element {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [value, setValue] = useState(10)

  const inProgress = useMemo(() => {
    return submitted || submitting
  }, [submitted, submitting])

  const submit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  return (
    <Root
      className={`cursor-pointer relative flex items-center select-none touch-none w-full border ${
        submitted ? "border-c4-green" : "border-shark-600"
      } rounded-full h-[58px]`}
      onValueChange={([val]) => {
        // Seems to be a bug with the radix slider where we can't set the max and min value for the range.
        // We'll have to do it here for now unfortunately :(
        if (val >= 10) {
          setValue(val)
        }
      }}
      disabled={submitting}
      onValueCommit={([val]) => {
        if (val === 100) {
          submit()
        } else {
          setValue(10)
        }
      }}
      step={1}
      value={[value]}
    >
      <Track className="w-full">
        {inProgress && (
          <div className="absolute px-6 w-full z-10 flex items-center justify-between">
            <div className="text-black text-lg">
              {submitted ? "Sent!" : "Sending..."}
            </div>
            {submitted ? (
              <Check color="black" size={24} />
            ) : (
              <div className="animate-spin">
                <Loader2 color="black" size={24} />
              </div>
            )}
          </div>
        )}
        <Range className="absolute bg-c4-gradient-separator rounded-full h-full top-1/2 transform -translate-y-1/2" />
        <div className="text-center text-lg text-shark-300">
          Slide to send to Channel4
        </div>
      </Track>
      <Thumb aria-label="Volume" className="outline-none">
        {!inProgress && <ArrowRight className="mr-12" color="black" />}
      </Thumb>
    </Root>
  )
}
