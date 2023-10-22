import {
  JetBrains_Mono as FontMono,
  Lexend as FontSans,
  DM_Sans as FontDM
} from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
})


export const fontDM = FontDM({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500", "700"],
})