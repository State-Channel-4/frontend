import Image from "next/image"
import landingPageBGMobile from "@/assets/landing-background-mobile.png"
import landingPageBG from "@/assets/landing-background.png"

export default function Landing() {
  return (
    <>
      <Image
        alt="Preview"
        className="h-full object-cover xs:block hidden max-w-full"
        src={landingPageBG}
      />
      <Image
        alt="Preview"
        className="h-full object-fill block xs:hidden"
        src={landingPageBGMobile}
      />
    </>
  )
}
