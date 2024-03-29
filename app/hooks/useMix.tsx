"use client"

import { useCallback, useEffect, useReducer } from "react"
import { useSearchParams } from "next/navigation"
import { useJwtStore } from "@/store/jwt"
import { useReceiptsStore } from "@/store/receipts"
import { C4Content } from "@/types"

import {
  fetchLikes,
  fetchMix,
  updateLikesInApi,
} from "../(discover)/discover/utils"

type MixState = {
  currentSite: C4Content | null
  // selectedTags: TagMap
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
  | { type: "SET_MIX"; mix: C4Content[] }
  // | { type: "SET_TAGS"; tags: TagMap }
  | {
      type: "SET_LIKES"
      currentSite: C4Content | null
      likes: string[]
      mix?: C4Content[]
    }
  | { type: "CHANGE_SITE"; currentSite: C4Content | null; mixIndex: number }

const initialState: MixState = {
  currentSite: null,
  // selectedTags: new Map(),
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
    // case "SET_TAGS":
    //   return { ...state, selectedTags: action.tags }
    case "SET_LIKES":
      if (!action.mix) {
        return {
          ...state,
          userLikes: action.likes,
        }
      }
      return {
        ...state,
        userLikes: action.likes,
        currentSite: action.currentSite,
        mix: action.mix,
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
  const params = useSearchParams()
  const tag = params.get("tag")
  const { token, userId } = useJwtStore()
  const { updateList } = useReceiptsStore()
  const [state, dispatch] = useReducer(mixReducer, initialState)

  // const getTagsFromStore = () => {
  //   if (typeof window === "undefined") return
  //   const tagsFromStore = sessionStorage.getItem("c4.tags")
  //   if (!tagsFromStore) return
  //   try {
  //     const parsedTags = JSON.parse(tagsFromStore)
  //     parsedTags.forEach((data: [string, Tag]) => {
  //       const [tagId, tag] = data
  //       state.selectedTags.set(tagId, tag)
  //     })
  //   } catch (error) {
  //     console.error("Error parsing JSON:", error)
  //   }
  // }

  // useEffect(() => {
  //   getTagsFromStore()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const fetchUserLikes = useCallback(async () => {
    const likes = await fetchLikes(userId!)
    dispatch({
      type: "SET_LIKES",
      likes,
      currentSite: null,
    })
  }, [userId])

  useEffect(() => {
    if (!userId) return
    fetchUserLikes()
  }, [fetchUserLikes, userId])

  const fetchMixContent = async () => {
    try {
      const { mixLimit } = state
      // if the selected tags are the same as the current tags and we have a mix, don't get a new mix
      if (
        // JSON.stringify(currentTags) === JSON.stringify(state.selectedTags) &&
        state.mix &&
        state.mixIndex < state.mix.length + state.mixIndexLimit
      )
        return
      const mixResponse = await fetchMix(tag ? [tag] : [], mixLimit)
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
  }, [tag])

  const likeOrUnlike = useCallback(
    async (contentId: string) => {
      const { currentSite, mix, mixIndex, userLikes } = state
      if (!currentSite) return
      const isLiked = userLikes.includes(contentId)
      const newUserLikes = isLiked
        ? userLikes.filter((item) => item !== contentId)
        : [...userLikes, contentId]

      const updatedSite = state.currentSite && {
        ...state.currentSite,
        likes: state.currentSite.likes + (isLiked ? -1 : 1),
      }
      const updatedMix = [...(mix as C4Content[])]
      updatedMix[mixIndex] = updatedSite as C4Content
      dispatch({
        type: "SET_LIKES",
        likes: newUserLikes,
        currentSite: updatedSite,
        mix: updatedMix,
      })
      try {
        await updateLikesInApi(contentId, !isLiked, token!, updateList) // isLiked is the opposite of the user action (I am not sure why) by Nico Serrano
      } catch (error) {
        console.error(error)
      }
    },
    [state, token, updateList]
  )

  const changeSite = () => {
    const { mix, mixIndex, mixLimit } = state
    if (!mix) return
    const newMixIndex = mixIndex + 1

    // Get more content if we are almost at the end of the mix and if mix length equals limit (more urls exist in server)
    if (
      mix.length === mixLimit &&
      newMixIndex >= mix.length + state.mixIndexLimit
    ) {
      fetchMixContent()
    }

    if (newMixIndex < mix.length) {
      dispatch({
        type: "CHANGE_SITE",
        currentSite: mix[newMixIndex],
        mixIndex: newMixIndex,
      })
    }
    // Reset index to zero if index is greater than or equal to length
    else {
      dispatch({
        type: "CHANGE_SITE",
        currentSite: mix[0],
        mixIndex: 0,
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
