"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useJwtStore } from "@/store/jwt"
import moment from "moment"

import RequireAuth from "@/components/helper/RequireAuth"

type UserStats = {
  likeCount: number
  memberSince: string
  siteCount: number
}

const Dashboard = async () => {
  const { socialLogin } = useAuth()
  const { token, userId } = useJwtStore()
  const [stats, setStats] = useState<UserStats | null>(null)
  useEffect(() => {
    ;(async () => {
      if (!token || !userId) return
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const { user } = await res.json()
      setStats({
        likeCount: user.likedUrls.length,
        memberSince: user.createdAt,
        siteCount: user.submittedUrls.length,
      })
    })()
  }, [token, userId])

  return (
    <RequireAuth>
      <div className="flex justify-center items-center flex-col h-full max-w-full">
        <div className="px-4 max-w-full break-words">
          <div className="flex gap-4 items-center">
            <div className="text-shark-300 font-bold text-2xl/none">
              Login with
            </div>
            {socialLogin && (
              <div className="bg-shark-600 px-2 py-1 rounded-2xl text-sm/none">
                {socialLogin.provider}
              </div>
            )}
          </div>
          <div className="mt-6 text-shark-100 text-2xl/none">
            {socialLogin ? `Email: ${socialLogin.email}` : "Web3 Login"}
          </div>
          <div className="text-shark-200 mt-4">
            Member since {moment(stats?.memberSince).format("MMMM Do, YYYY")}
          </div>
          <div className="text-shark-300 font-bold text-2xl/none mt-12">
            Websites submitted
          </div>
          <div className="text-shark-50 font-extrabold mt-6 text-[56px]/none">
            {stats?.siteCount ?? 0}
          </div>
          <div className="text-shark-300 font-bold text-2xl/none mt-10">
            Likes submitted
          </div>
          <div className="text-shark-50 font-extrabold mt-6 text-[56px]/none">
            {stats?.likeCount ?? 0}
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

export default Dashboard
