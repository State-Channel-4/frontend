"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useEncryptedStore } from "@/store/encrypted"
import { usePasswordStore } from "@/store/password"
import { MatchDocument } from "@/types"
import RequireAuth from "@/components/helper/RequireAuth"

const MatchDetails = ({ matchData }: {matchData: MatchDocument}) => {
  const user1Urls = matchData.user1.urls.map((url, index) => (
    <li key={index}>
      <strong>Title:</strong> {url.title} | <strong>URL:</strong> {url.url}
    </li>
  ));

  const user2Urls = matchData.user2.urls.map((url, index) => (
    <li key={index}>
      <strong>Title:</strong> {url.title} | <strong>URL:</strong> {url.url}
    </li>
  ));

  return (
    <div>
      <h2>Match Details</h2>
      <ul>
        <li>
          <strong>Status:</strong> {matchData.status}
        </li>
        <li>
          <strong>Threshold:</strong> {matchData.threshold}
        </li>
        <li>
          <strong>Created At:</strong>{" "}
          {new Date(matchData.createdAt.$date).toLocaleString()}
        </li>
        <li>
          <strong>Updated At:</strong>{" "}
          {new Date(matchData.updatedAt.$date).toLocaleString()}
        </li>
        <li>
          <strong>User 1 URLs:</strong>
          <ul>{user1Urls}</ul>
        </li>
        <li>
          <strong>User 2 URLs:</strong>
          <ul>{user2Urls}</ul>
        </li>
      </ul>
    </div>
  );
};


const Match = () => {
  const router = useRouter()
  const [match, setMatch] = useState(null)
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
        setMatch(match)
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
            {match && <MatchDetails matchData={match} />}
          </Row>
          <Row>
            <p className="font-semibold">your task</p>
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
