import Link from "next/link";
import { NavItem } from "@/types"
import { ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"

interface SecondaryNavProps {
  items?: NavItem[]
}

export function SecondaryNav({ items }: SecondaryNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  target={item.title === "FAQs" ? "_blank" : "_self"}
                  className={cn(
                    "text-muted-foreground flex items-center text-lg font-semibold sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                  {item.title === "FAQs" ? (
                    <ExternalLink size={14} className="ml-1" />
                  ) : null}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}