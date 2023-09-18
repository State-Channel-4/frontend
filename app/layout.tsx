import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Feedback from "@/components/feedback"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import Toolbar from "@/components/toolbar"

import AnalyticWrapper from "./analytics"

export const metadata: Metadata = {
  metadataBase: new URL("https://app.channel4.wtf"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  openGraph: {
    images: ["/opengraph-image.png"],
  },
  description: siteConfig.description,
  twitter: {
    card: "summary_large_image",
    title: "Channel4",
    description: siteConfig.description,
    creator: "@StateChannel_4",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="relative flex h-screen flex-col p-6">
              <SiteHeader />
              <AnalyticWrapper>
                <div className="border-2xl">{children}</div>
              </AnalyticWrapper>
              <Toolbar />
              {/* <Feedback /> */}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
