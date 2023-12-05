"use client"

import { useEffect } from "react"

const Dashboard = async () => {
  useEffect(() => {
    ;(async () => {})()
  })

  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="px-4">
        <div className="text-shark-300 font-bold text-2xl/none">Login with</div>
        <div className="mt-6 text-shark-100 text-[32px]/none">
          user’s email if they use social
        </div>
        <div className="text-shark-200 mt-4">Member since July 19, 2023</div>
        <div className="text-shark-300 font-bold text-2xl/none mt-12">
          Websites submitted
        </div>
        <div className="text-shark-50 font-extrabold mt-6 text-[56px]/none">
          109
        </div>
        <div className="text-shark-300 font-bold text-2xl/none mt-10">
          Likes submitted
        </div>
        <div className="text-shark-50 font-extrabold mt-6 text-[56px]/none">
          4
        </div>
      </div>
    </div>
  )
}

export default Dashboard
