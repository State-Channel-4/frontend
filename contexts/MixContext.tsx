"use client"

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react"
import { usePathname } from "next/navigation"
import { useEncryptedStore } from "@/store/encrypted"
import { usePasswordStore } from "@/store/password"
import { C4Content, Tag, TagMap } from "@/types"

import { fetchMix, updateLikesInApi } from "../app/discover/utils"

type MixState = {
  currentSite: C4Content | null
  selectedTags: TagMap
  isLoading: boolean
  error: { message: string }
  mixIndex: number
  userLikes: string[]
  currentPage: number
  mix: C4Content[] | null
  hasNextPage: boolean
  mixLimit: number
  mixIndexLimit: number // the number that will act as a trigger to get more content
}

type Action =
  | { type: "SET_ERROR"; message: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_MIX"; mix: C4Content[]; hasNextPage: boolean }
  | { type: "SET_TAGS"; tags: TagMap }
  | { type: "SET_LIKES"; likes: string[]; currentSite: C4Content | null }
  | { type: "CHANGE_SITE"; currentSite: C4Content | null; mixIndex: number }
  | { type: "SET_CURRENT_PAGE"; currentPage: number }

const initialState: MixState = {
  currentSite: null,
  selectedTags: new Map(),
  isLoading: true,
  error: { message: "" },
  mixIndex: -1,
  userLikes: [],
  currentPage: 1,
  mix: null,
  hasNextPage: false,
  mixLimit: 100,
  mixIndexLimit: -3,
}

// TODO: Remove any
const MixContext = createContext<any>({})

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
        hasNextPage: action.hasNextPage,
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
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.currentPage }
    default:
      return state
  }
}

interface IProps {
  children: React.ReactNode
}

export const MixProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(mixReducer, initialState)
  return (
    <MixContext.Provider value={[state, dispatch]}>
      {children}
    </MixContext.Provider>
  )
}

const useMix = () => {
  const { encrypted } = useEncryptedStore()
  const { password, token, userId } = usePasswordStore()
  // const [state, dispatch] = useReducer(mixReducer, initialState)
  const [state, dispatch] = useContext(MixContext)

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
      const { selectedTags: currentTags, currentPage, mixLimit } = state
      // if the selected tags are the same as the current tags and we have a mix, don't get a new mix
      if (
        JSON.stringify(currentTags) === JSON.stringify(state.selectedTags) &&
        state.mix &&
        state.mixIndex < state.mix.length + state.mixIndexLimit
      )
        return
      const mixResponse = await fetchMix(currentTags, currentPage, mixLimit)
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
      hasNextPage: mixResponse.hasNextPage,
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
      // TODO: Remove any
      const newUserLikes = isLiked
        ? userLikes.filter((item: any) => item !== contentId)
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
        await updateLikesInApi(
          contentId,
          encrypted!,
          password!,
          token!,
          userId!
        )
      } catch (error) {
        console.error(error)
      }
    },
    [state, encrypted, password, token, userId]
  )

  const changeSite = () => {
    const { mix, mixIndex, currentPage, selectedTags } = state
    if (!mix) return
    const newMixIndex = mixIndex + 1

    // Get more content if we are almost at the end of the mix
    if (newMixIndex >= mix.length + state.mixIndexLimit) {
      dispatch({ type: "SET_CURRENT_PAGE", currentPage: currentPage + 1 })
      if (selectedTags.size > 0 && !state.hasNextPage)
        dispatch({ type: "SET_TAGS", tags: new Map() })
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
    hasNextPage: state.hasNextPage,
    isLoading: state.isLoading,
    error: state.error,
    userLikes: state.userLikes,
    likeOrUnlike,
    changeSite,
  }
}

export default useMix
