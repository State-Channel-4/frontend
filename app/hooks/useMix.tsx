"use client"

import { useCallback, useEffect, useReducer } from "react"
import { useEncryptedStore } from "@/store/encrypted"
import { useJwtStore } from "@/store/jwt"
import { C4Content, Tag, TagMap } from "@/types"

import { fetchMix, updateLikesInApi } from "../(discover)/discover/utils"

type MixState = {
  currentSite: C4Content | null
  selectedTags: TagMap
  isLoading: boolean
  error: { message: string }
  mixIndex: number
  userLikes: string[]
  mix: C4Content[] | null
  mixLimit: number
  mixIndexLimit: number // the number that will act as a trigger to get more content
}

type Action =
  | { type: "SET_ERROR"; message: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_MIX"; mix: C4Content[] }
  | { type: "SET_TAGS"; tags: TagMap }
  | { type: "SET_LIKES"; likes: string[]; currentSite: C4Content | null }
  | { type: "CHANGE_SITE"; currentSite: C4Content | null; mixIndex: number }

const initialState: MixState = {
  currentSite: null,
  selectedTags: new Map(),
  isLoading: true,
  error: { message: "" },
  mixIndex: -1,
  userLikes: [],
  mix: null,
  mixLimit: 100,
  mixIndexLimit: -3,
}

const mixReducer = (state: MixState, action: Action): MixState => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: { message: action.message } }
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading }
    case "SET_MIX":
      return {
        ...state,
        mix: action.mix,
        currentSite: action.mix[0],
      }
    case "SET_TAGS":
      return { ...state, selectedTags: action.tags }
    case "SET_LIKES":
      return {
        ...state,
        userLikes: action.likes,
        currentSite: action.currentSite,
      }
    case "CHANGE_SITE":
      return {
        ...state,
        currentSite: action.currentSite,
        mixIndex: action.mixIndex,
      }
    default:
      return state
  }
}

const useMix = () => {
  const { encrypted } = useEncryptedStore()
  const { token, userId } = useJwtStore()
  const [state, dispatch] = useReducer(mixReducer, initialState)

  const getTagsFromStore = () => {
    if (typeof window === "undefined") return
    const tagsFromStore = sessionStorage.getItem("c4.tags")
    if (!tagsFromStore) return
    try {
      const parsedTags = JSON.parse(tagsFromStore)
      parsedTags.forEach((data: [string, Tag]) => {
        const [tagId, tag] = data
        state.selectedTags.set(tagId, tag)
      })
    } catch (error) {
      console.error("Error parsing JSON:", error)
    }
  }

  useEffect(() => {
    getTagsFromStore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchMixContent = async () => {
    try {
      const { selectedTags: currentTags, mixLimit } = state
      // if the selected tags are the same as the current tags and we have a mix, don't get a new mix
      if (
        JSON.stringify(currentTags) === JSON.stringify(state.selectedTags) &&
        state.mix &&
        state.mixIndex < state.mix.length + state.mixIndexLimit
      )
        return
      const mixResponse = await fetchMix(currentTags, mixLimit)
      if (mixResponse.message) {
        dispatch({ type: "SET_ERROR", message: mixResponse.message })
      } else {
        handleMixResponse(state, mixResponse)
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        message: "Something went wrong getting a mix",
      })
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false })
    }
  }

  function handleMixResponse(state: MixState, mixResponse: any) {
    const newMix =
      state.mix && state.mixIndex >= state.mix.length + state.mixIndexLimit
        ? [...state.mix.slice(state.mixIndex), ...mixResponse.urls]
        : mixResponse.urls

    dispatch({
      type: "SET_MIX",
      mix: newMix,
    })
    // set the first site
    dispatch({ type: "CHANGE_SITE", currentSite: newMix[0], mixIndex: 0 })
  }

  useEffect(() => {
    fetchMixContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedTags])

  const likeOrUnlike = useCallback(
    async (contentId: string) => {
      const { currentSite, userLikes } = state
      if (!currentSite) return

      const isLiked = userLikes.includes(contentId)
      const newUserLikes = isLiked
        ? userLikes.filter((item) => item !== contentId)
        : [...userLikes, contentId]

      dispatch({
        type: "SET_LIKES",
        likes: newUserLikes,
        currentSite: state.currentSite && {
          ...state.currentSite,
          likes: state.currentSite.likes + (isLiked ? -1 : 1),
        },
      })

      try {
        await updateLikesInApi(contentId, encrypted!, token!, userId!)
      } catch (error) {
        console.error(error)
      }
    },
    [state, encrypted, token, userId]
  )

  const changeSite = () => {
    const { mix, mixIndex, selectedTags } = state
    if (!mix) return
    const newMixIndex = mixIndex + 1

    // Get more content if we are almost at the end of the mix
    if (newMixIndex >= mix.length + state.mixIndexLimit) {
      fetchMixContent()
    }

    if (newMixIndex < mix.length) {
      dispatch({
        type: "CHANGE_SITE",
        currentSite: mix[newMixIndex],
        mixIndex: newMixIndex,
      })
    }
  }

  return {
    currentSite: state.currentSite,
    isLoading: state.isLoading,
    error: state.error,
    userLikes: state.userLikes,
    likeOrUnlike,
    changeSite,
  }
}

export default useMix
