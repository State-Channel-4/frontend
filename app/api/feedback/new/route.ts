import { NextRequest, NextResponse } from "next/server"

import { feedbackTable } from "@/config/airtable"

export async function POST(request: NextRequest) {
  const feedbackItem = await request.json()
  const Message = feedbackItem["Message"]
  try {
    const records = await feedbackTable.create([{ fields: { Message } }])
    return NextResponse.json({ newRecord: records[0].id }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: "Something went wrong! 😕" },
      { status: 500 }
    )
  }
}
