"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useEncryptedStore } from "@/store/encrypted"
import { usePasswordStore } from "@/store/password"

import RequireAuth from "@/components/helper/RequireAuth"

const Match = () => {
  const router = useRouter()
  const [match, setMatch] = useState(null)
  const [user1, setUser1] = useState(null)
  const [user2, setUser2] = useState(null)
  const [verificationURLs, setVerificationURLs] = useState(0)
  const { address } = useEncryptedStore()
  const { userId, token } = usePasswordStore()

  useEffect(() => {
    ;(async () => {
      try {
        const { match } = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getmatch/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json())
        console.log("match : ", match);
        setUser1(match.user1)
        setUser2(match.user2)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [address, userId, token, router])



  return (
    <RequireAuth>
      <section className="mx-auto flex max-w-xl flex-col gap-6 p-6">
        <h2 className="text-left font-semibold">My matches</h2>
        <div className="h-0.5 bg-c4-gradient-separator"></div>
        <div className="flex h-full flex-col gap-8 rounded-lg bg-slate-900 p-6">
          <Row>
            <p className="font-semibold">your matches</p>
            <p>{match}</p>
          </Row>
          <Row>
            <p className="font-semibold">your task</p>
            <p>{user2 && user2.urls}</p>
          </Row>
        </div>
      </section>
    </RequireAuth>
  )
}

const Row = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-between border-b-2 border-slate-500/50 pb-4">
      {children}
    </div>
  )
}

export default Match
