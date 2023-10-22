import Image from "next/image"
import CloseBorder from "@/assets/close-border.svg"
import ExternalLinkArrow from "@/assets/external-link-arrow.svg"
import { C4Content } from "@/types"
import moment from "moment"

interface SiteDetailsProps {
  currentSite: C4Content
  open: boolean
  onClose: () => void
}

export default function SiteDetails({
  currentSite,
  open,
  onClose,
}: SiteDetailsProps) {
  return (
    <div
      className="absolute break-words bottom-[calc(100%+20px)] left-5 w-[calc(100%-40px)] md:w-[calc(100%-92px)] max-w-[1112px] transition-all duration-300 p-6 bg-shark-950 border border-shark-500 rounded-2xl md:bottom-[calc(100%+12px)] md:p-10 md:left-12 md:flex md:justify-between md:gap-4"
      style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transform: open ? "translateY(0px)" : "translateY(45px)",
      }}
    >
      <div>
        <div>
          <div className="text-2xl text-shark-50">{currentSite.title}</div>
          <a
            className="hover:underline decoration-shark-400 text-sm flex gap-2 items-center break-all mt-2"
            href={currentSite.url}
            rel="noreferrer"
            target="blank"
          >
            <div className="break-words shrink text-shark-50">
              {currentSite.url}
            </div>
            <Image alt="Arrow" src={ExternalLinkArrow} />
          </a>
        </div>
        <div className="mt-5 flex gap-2 items-center text-sm flex-wrap text-[#ABABAB]">
          <div>Submitted by</div>
          <div className="bg-[#374052] py-1 px-2 rounded-lg">
            <div className="bg-clip-text text-transparent bg-c4-gradient-submitter">
              {currentSite.submittedBy}
            </div>
          </div>
          <div>on {moment(currentSite.createdAt).format("DD MMM YYYY")}</div>
        </div>
      </div>
      <div className="md:flex md:gap-6 items-start">
        <div className="mt-14 text-sm flex flex-wrap gap-2 md:mt-0 text-shark-300">
          {currentSite.tags.map(({ name }) => (
            <div>#{name}</div>
          ))}
        </div>
        <div className="mt-[88px] flex shrink-0 justify-center md:mt-0 md:items-center md:h-full">
          {/* TODO: Replace with single SVG image that can be colored */}
          <button onClick={() => onClose()}>
            <Image alt="Close" src={CloseBorder} />
          </button>
        </div>
      </div>
    </div>
  )
}
