import { useEffect, useMemo, useState } from "react"
import { Range, Root, Thumb, Track } from "@radix-ui/react-slider"
import { ArrowRight, Check, Loader2, X } from "lucide-react"

interface SliderProps {
  disabled?: boolean
  error: Error | null
  onSubmit: () => void
  sending: boolean
  sent: boolean
}

export default function Slider({
  disabled,
  error,
  onSubmit,
  sending,
  sent,
}: SliderProps): JSX.Element {
  const [value, setValue] = useState(10)

  const borderColor = useMemo(() => {
    if (sent) {
      return "border-c4-green"
    } else if (error) {
      return "border-red-600"
    } else {
      return "border-shark-600"
    }
  }, [error, sent])

  const sliderText = useMemo(() => {
    if (sent) {
      return "Sent!"
    } else if (error) {
      return "Error occured!"
    } else if (sending) {
      return "Sending..."
    } else {
      return ""
    }
  }, [error, sending, sent])

  // Reset progress on error reset
  useEffect(() => {
    if (!error) {
      setValue(10)
    }
  }, [error])

  // Reset progress on sent reset
  useEffect(() => {
    if (!sent) {
      setValue(10)
    }
  }, [sent])

  return (
    <div className={`border ${borderColor} px-1.5 py-1 rounded-full`}>
      <Root
        className="cursor-pointer relative flex items-center select-none touch-none w-full rounded-full h-[48px]"
        disabled={disabled || !!sliderText}
        onLostPointerCapture={() => {
          if (value === 100) {
            onSubmit()
          } else {
            setValue(10)
          }
        }}
        onValueChange={([val]) => {
          // Seems to be a bug with the radix slider where we can't set the max and min value for the range.
          // We'll have to do it here for now unfortunately :(
          if (val >= 10) {
            setValue(val)
          }
        }}
        step={1}
        value={[value]}
      >
        <Track className="w-full">
          {sliderText && (
            <div className="absolute px-6 w-full z-10 flex items-center justify-between">
              <div className="text-black text-lg">{sliderText}</div>
              {error ? (
                <X color="black" size={24} />
              ) : sent ? (
                <Check color="black" size={24} />
              ) : (
                <div className="animate-spin">
                  <Loader2 color="black" size={24} />
                </div>
              )}
            </div>
          )}
          <Range className="absolute bg-c4-gradient-separator border-shark-600 border rounded-full h-full top-1/2 transform -translate-y-1/2" />
          <div className="text-center text-lg text-shark-300">
            Slide to send to Channel4
          </div>
        </Track>
        <Thumb aria-label="Volume" className="outline-none">
          {!sliderText && <ArrowRight className="mr-12" color="black" />}
        </Thumb>
      </Root>
    </div>
  )
}
