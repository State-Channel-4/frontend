import Image from "next/image"
import landingPageBGMobile from "@/assets/landing-background-mobile.png"
import landingPageBG from "@/assets/landing-background.png"

export default function Landing() {
  return (
    <>
      <Image
        alt="Preview"
        className="hidden h-full max-w-full object-cover xs:block"
        src={landingPageBG}
      />
      <Image
        alt="Preview"
        className="block h-full object-fill xs:hidden"
        src={landingPageBGMobile}
      />
    </>
  )
}
