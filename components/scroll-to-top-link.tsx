"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

interface ScrollToTopLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function ScrollToTopLink({ href, children, className }: ScrollToTopLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "instant" })
    router.push(href)
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}

export default ScrollToTopLink
