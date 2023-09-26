import { ReactNode } from "react"

import MainContentWrapper from "@/components/main-content-wrapper"
import Toolbar from "@/components/toolbar"

export default function StatelessToolbarLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <MainContentWrapper>{children}</MainContentWrapper>
      <Toolbar />
    </>
  )
}
