import Image from "next/image"
import Link from "next/link"
import browserIcon from "@/assets/browser-icon.svg"
import xIcon from "@/assets/x-icon.svg"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

import { siteConfig } from "@/config/site"

interface MainMenuProps {
  open: boolean
  onClose: () => void
}

export default function MainMenu({ open, onClose }: MainMenuProps) {
  const { initializingW3A, signIn, signedIn, signOut } = useAuth()

  return (
    <div
      className="absolute bottom-[calc(100%+20px)] left-5 z-20 w-[calc(100%-40px)] rounded-2xl border border-shark-700 bg-shark-950 p-6 transition-all duration-300 md:bottom-[calc(100%+12px)] md:left-12 md:w-[351px]"
      style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transform: open ? "translateY(0px)" : "translateY(45px)",
      }}
    >
      {initializingW3A ? (
        <div className="flex flex-col items-center justify-center">
          Initializing Web3Auth
          <Loader2 className="mt-2 animate-spin" size={22} />
        </div>
      ) : (
        <>
          {signedIn ? (
            <div>
              <Link href={siteConfig.mainNav.addSite.href}>
                <div className="flex items-center justify-between border-b border-shark-800 p-3 transition-all hover:border-c4-green md:p-4">
                  <div className="w-full bg-c4-gradient-separator bg-clip-text text-sm text-transparent md:text-base">
                    {siteConfig.mainNav.addSite.title}
                  </div>
                  <Image alt="Browser" src={browserIcon} />
                </div>
              </Link>
              <Link href={siteConfig.mainNav.dashboard.href}>
                <div className="border-b border-shark-800 p-3 text-sm text-shark-300 transition-all hover:border-c4-green hover:text-shark-200 md:p-4 md:text-base">
                  {siteConfig.mainNav.dashboard.title}
                </div>
              </Link>
            </div>
          ) : (
            <div
              className="cursor-pointer border-b border-shark-800 p-3 text-sm text-shark-300 transition-all hover:border-c4-green hover:text-shark-200 md:p-4 md:text-base"
              onClick={() => {
                signIn()
                onClose()
              }}
            >
              Sign in / Sign up
            </div>
          )}
          <Link href={siteConfig.mainNav.browseTopics.href}>
            <div className="border-b border-shark-800 p-3 text-sm text-shark-300 transition-all hover:border-c4-green hover:text-shark-200 md:p-4 md:text-base">
              {siteConfig.mainNav.browseTopics.title}
            </div>
          </Link>
          {signedIn && (
            <div
              className="cursor-pointer p-3 text-sm text-shark-300 transition-all hover:text-shark-200 md:p-4 md:text-base"
              onClick={() => {
                signOut()
                onClose()
              }}
            >
              Log Out
            </div>
          )}
          <div
            className="flex cursor-pointer items-center justify-between p-3 text-sm text-shark-300 transition-colors hover:text-shark-200 md:p-4 md:text-base"
            onClick={() => onClose()}
          >
            <div>Close menu</div>
            <Image alt="X" src={xIcon} />
          </div>
        </>
      )}
    </div>
  )
}
