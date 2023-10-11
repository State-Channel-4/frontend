import Image from "next/image"
import Link from "next/link"
import browserIcon from "@/assets/browser-icon.svg"
import xIcon from "@/assets/x-icon.svg"
import { useAuth } from "@/contexts/AuthContext"

import { siteConfig } from "@/config/site"

interface MainMenuProps {
  open: boolean
  onClose: () => void
}

export default function MainMenu({ open, onClose }: MainMenuProps) {
  const { initializingW3A, signIn, signedIn, signOut } = useAuth()

  return (
    <div
      className="absolute bottom-[calc(100%+20px)] left-5 w-[calc(100%-40px)] rounded-2xl border border-shark-700 bg-shark-950 p-6 transition-all duration-300 sm:bottom-[calc(100%+12px)] sm:left-12 sm:w-[351px]"
      style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transform: open ? "translateY(0px)" : "translateY(45px)",
      }}
    >
      {initializingW3A ? (
        // TODO: Add spinner component
        <div className="flex justify-center">Initializing Web3Auth...</div>
      ) : (
        <>
          {signedIn && (
            <div className="mb-4 xs:mb-6">
              <Link href={siteConfig.mainNav.addSite.href}>
                <div className="flex items-center justify-between border-b border-shark-800 p-3 xs:p-4 transition-all hover:border-c4-green">
                  <div className="text-sm xs:text-base w-full bg-c4-gradient-separator bg-clip-text text-transparent">
                    {siteConfig.mainNav.addSite.title}
                  </div>
                  <Image alt="Browser" src={browserIcon} />
                </div>
              </Link>
              <Link href={siteConfig.mainNav.dashboard.href}>
                <div className="p-3 xs:p-4 text-sm xs:text-base border-b border-shark-800 p-4 text-shark-300 transition-all hover:border-c4-green hover:text-shark-200">
                  {siteConfig.mainNav.dashboard.title}
                </div>
              </Link>
            </div>
          )}
          <div className="mb-4 xs:mb-6">
            {signedIn ? (
              <Link href={siteConfig.mainNav.changeTags.href}>
                <div className="p-3 xs:p-4 text-sm xs:text-base border-b border-shark-800 p-4 text-shark-300 transition-all hover:border-c4-green hover:text-shark-200">
                  {siteConfig.mainNav.changeTags.title}
                </div>
              </Link>
            ) : (
              <div
                className="p-3 xs:p-4 text-sm xs:text-base border-b border-shark-800 cursor-pointer p-4 text-shark-300 transition-all hover:border-c4-green hover:text-shark-200"
                onClick={() => {
                  signIn()
                  onClose()
                }}
              >
                Sign in / Sign up
              </div>
            )}
            <Link href={siteConfig.mainNav.stats.href}>
              <div className="p-3 xs:p-4 text-sm xs:text-base border-b border-shark-800 p-4 text-shark-300 transition-all hover:border-c4-green hover:text-shark-200">
                {siteConfig.mainNav.stats.title}
              </div>
            </Link>
            <Link href={siteConfig.mainNav.about.href}>
              <div className="p-3 xs:p-4 text-sm xs:text-base border-b border-shark-800 p-4 text-shark-300 transition-all hover:border-c4-green hover:text-shark-200">
                {siteConfig.mainNav.about.title}
              </div>
            </Link>
            {signedIn && (
              <Link href={siteConfig.mainNav.feedback.href}>
                <div className="p-3 xs:p-4 text-sm xs:text-base border-b border-shark-800 p-4 text-shark-300 transition-all hover:border-c4-green hover:text-shark-200">
                  {siteConfig.mainNav.feedback.title}
                </div>
              </Link>
            )}
          </div>
          {signedIn && (
            <div
              className="p-3 xs:p-4 text-sm xs:text-base cursor-pointer p-4 text-shark-300 transition-all hover:text-shark-200"
              onClick={() => {
                signOut()
                onClose()
              }}
            >
              Log Out
            </div>
          )}
          <div
            className="p-3 xs:p-4 text-sm xs:text-base flex cursor-pointer items-center justify-between p-4 text-shark-300 transition-colors hover:text-shark-200"
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
