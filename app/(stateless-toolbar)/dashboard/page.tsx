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
    const fetchUserData = async () => {
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
    }
    fetchUserData()
  }, [token, userId])

  return (
    <RequireAuth>
      <div className="flex h-full max-w-full flex-col items-center justify-center">
        <div className="max-w-full break-words px-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl/none font-bold text-shark-300">
              Login with
            </div>
            {socialLogin && (
              <div className="rounded-2xl bg-shark-600 px-2 py-1 text-sm/none">
                {socialLogin.provider}
              </div>
            )}
          </div>
          <div className="mt-6 text-2xl/none text-shark-100">
            {socialLogin ? `Email: ${socialLogin.email}` : "Web3 Login"}
          </div>
          <div className="mt-4 text-shark-200">
            Member since {moment(stats?.memberSince).format("MMMM Do, YYYY")}
          </div>
          <div className="mt-12 text-2xl/none font-bold text-shark-300">
            Websites submitted
          </div>
          <div className="mt-6 text-[56px]/none font-extrabold text-shark-50">
            {stats?.siteCount ?? 0}
          </div>
          <div className="mt-10 text-2xl/none font-bold text-shark-300">
            Likes submitted
          </div>
          <div className="mt-6 text-[56px]/none font-extrabold text-shark-50">
            {stats?.likeCount ?? 0}
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

export default Dashboard
