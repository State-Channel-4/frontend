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
      className="absolute bottom-[calc(100%+20px)] left-5 w-[calc(100%-40px)] max-w-[1112px] break-words rounded-2xl border border-shark-500 bg-shark-950 p-6 transition-all duration-300 md:bottom-[calc(100%+12px)] md:left-12 md:flex md:w-[calc(100%-92px)] md:justify-between md:gap-4 md:p-10"
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
            className="mt-2 flex items-center gap-2 break-all text-sm decoration-shark-400 hover:underline"
            href={currentSite.url}
            rel="noreferrer"
            target="blank"
          >
            <div className="shrink break-words text-shark-50">
              {currentSite.url}
            </div>
            <Image alt="Arrow" src={ExternalLinkArrow} />
          </a>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[#ABABAB]">
          <div>Submitted by</div>
          <div className="rounded-lg bg-[#374052] px-2 py-1">
            <div className="bg-c4-gradient-submitter bg-clip-text text-transparent">
              {currentSite.submittedBy}
            </div>
          </div>
          <div>on {moment(currentSite.createdAt).format("DD MMM YYYY")}</div>
        </div>
      </div>
      <div className="items-start md:flex md:gap-6">
        <div className="mt-14 flex flex-wrap gap-2 text-sm text-shark-300 md:mt-0">
          {currentSite.tags.map(({ name }) => (
            <div key={name}>#{name}</div>
          ))}
        </div>
        <div className="mt-[88px] flex shrink-0 justify-center md:mt-0 md:h-full md:items-center">
          {/* TODO: Replace with single SVG image that can be colored */}
          <button onClick={() => onClose()}>
            <Image alt="Close" src={CloseBorder} />
          </button>
        </div>
      </div>
    </div>
  )
}
