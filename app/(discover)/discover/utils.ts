import { TagMap } from "@/types"

import { createProxyUrls } from "@/app/utils"

export const fetchMix = async (tags: string[], limit: number) => {
  const mixParams = createMixParams(tags, limit)
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mix?${mixParams.toString()}`
    )
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    const data = await response.json()
    const mixWithProxyUrls = createProxyUrls(data.urls)
    return { urls: mixWithProxyUrls }
  } catch (error) {
    let message = "Unknown error"
    if (error instanceof Error) message = error.message
    console.error("Error fetching mix:", error)
    return { message }
  }
}

export const fetchLikes = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/likes/${userId}`
    )
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    const { likes } = await response.json()
    return likes.map(({ id }: { id: string }) => id)
  } catch (error) {
    let message = "Unknown error"
    if (error instanceof Error) message = error.message
    console.error("Error fetching mix:", error)
    return { message }
  }
}

export const updateLikesInApi = async (
  contentId: string,
  liked: boolean,
  token: string,
  updateList: (data: any) => void
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/like/${contentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        liked: liked,
      }),
    }
  ).then((res) => res.json())
  updateList({
    object: response.like,
    type: "like",
    receipt: response.receipt,
  })
}

export const feedbackMessages = {
  "not-found":
    "Oops! We couldn't find any content under these tags... Try using different ones",
  loading: "Loading content...",
}

export const createMixParams = (tags: string[], mixLimit: number) => {
  const mixParams = new URLSearchParams()
  tags.forEach((tag) => mixParams.append("tags", tag))
  mixParams.append("limit", mixLimit.toString())

  return mixParams
}
