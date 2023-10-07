import Image from "next/image"
import Link from "next/link"
import browserIcon from "@/assets/browser-icon.svg"
import xIcon from "@/assets/x-icon.svg"

import { siteConfig } from "@/config/site"

interface MainMenuProps {
  onClose: () => void
}

export default function MainMenu({ onClose }: MainMenuProps) {
  // Hardcode signedIn variable for now
  const signedIn = true

  return (
    <div className="absolute bottom-[calc(100%)] left-4 w-[351px] rounded-2xl border border-shark-700 bg-shark-950 p-6 sm:bottom-[calc(100%+8px)] sm:left-10">
      {signedIn && (
        <Link href="/submit-url">
          <div className="flex items-center justify-between border-b border-shark-800 p-4 transition-all hover:border-green">
            <div className="w-full bg-c4-gradient-separator bg-clip-text text-transparent">
              Add website
            </div>
            <Image alt="Browser" src={browserIcon} />
          </div>
        </Link>
      )}
      <div className="mb-10">
        <Link href={siteConfig.mainNav.signIn.href}>
          <div className="border-b border-shark-800 p-4 text-shark-300 transition-all hover:border-green hover:text-shark-200">
            {siteConfig.mainNav.signIn.title}
          </div>
        </Link>
        <Link href={siteConfig.mainNav.stats.href}>
          <div className="border-b border-shark-800 p-4 text-shark-300 transition-all hover:border-green hover:text-shark-200">
            {siteConfig.mainNav.stats.title}
          </div>
        </Link>
        <Link href={siteConfig.mainNav.about.href}>
          <div className="border-b border-shark-800 p-4 text-shark-300 transition-all hover:border-green hover:text-shark-200">
            {siteConfig.mainNav.about.title}
          </div>
        </Link>
      </div>
      {signedIn && (
        <div className="cursor-pointer p-4 text-shark-300 transition-all hover:text-shark-200">
          Log Out
        </div>
      )}
      <div
        className="flex cursor-pointer items-center justify-between p-4 text-shark-300 transition-colors hover:text-shark-200"
        onClick={() => onClose()}
      >
        <div>Close menu</div>
        <Image alt="X" src={xIcon} />
      </div>
    </div>
  )
}
