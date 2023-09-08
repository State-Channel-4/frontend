'use client';

import { useEncryptedStore } from "@/store/encrypted";
import { usePasswordStore } from "@/store/password";
import { C4Content, Tag, TagMap } from "@/types";
import { useCallback, useEffect, useReducer } from "react";
import { fetchMix, updateLikesInApi } from "../discover/utils";

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
}

type Action =
  | { type: "SET_ERROR"; message: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_MIX"; mix: C4Content[]; hasNextPage: boolean }
  | { type: "SET_TAGS"; tags: TagMap }
  | { type: "SET_LIKES"; likes: string[]; currentSite: C4Content | null }
  | { type: "CHANGE_SITE", currentSite: C4Content | null, mixIndex: number }
  | { type: "SET_CURRENT_PAGE", currentPage: number }

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
}

const mixReducer = (state: MixState, action: Action): MixState => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: { message: action.message } };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_MIX":
      return {
        ...state,
        mix: action.mix,
        currentSite: action.mix[0],
        hasNextPage: action.hasNextPage,
      };
    case "SET_TAGS":
      return { ...state, selectedTags: action.tags };
    case "SET_LIKES":
      return {
        ...state,
        userLikes: action.likes,
        currentSite: action.currentSite,
      };
    case "CHANGE_SITE":
      return {
        ...state,
        currentSite: action.currentSite,
        mixIndex: action.mixIndex,
      };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.currentPage };
    default:
      return state;
  }
}

const useMix = () => {
  const { encrypted } = useEncryptedStore();
  const { password, token, userId } = usePasswordStore();
  const [state, dispatch] = useReducer(mixReducer, initialState);

  const getTagsFromStore = () => {
    if (typeof window === "undefined") return;
    const tagsFromStore = sessionStorage.getItem("c4.tags");
    if (!tagsFromStore) return;
    try {
      const parsedTags = JSON.parse(tagsFromStore);
      parsedTags.forEach((data: [string, Tag]) => {
        const [tagId, tag] = data;
        state.selectedTags.set(tagId, tag);
      });

    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  useEffect(() => {
    getTagsFromStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMix = async () => {
    try {
      const { selectedTags: currentTags, currentPage, mixLimit } = state;
      const mixResponse = await fetchMix(currentTags, currentPage, mixLimit);
      if (mixResponse.message) {
        dispatch({ type: "SET_ERROR", message: mixResponse.message });
      } else {
        const newMix = state.mixIndex > 0 && state.mix
          ? [...state.mix.slice(state.mixIndex), ...mixResponse.urls]
          : mixResponse.urls;

        dispatch({
          type: "SET_MIX",
          mix: newMix,
          hasNextPage: mixResponse.hasNextPage
        });
        // set the first site
        dispatch({ type: "CHANGE_SITE", currentSite: newMix[0], mixIndex: 0 });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", message: "Something went wrong getting a mix" });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  };

  useEffect(() => {
    getMix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedTags, state.currentPage]);

  const likeOrUnlike = useCallback(
    async (contentId: string) => {
      const { currentSite, userLikes } = state;
      if (!currentSite) return;

      const isLiked = userLikes.includes(contentId);
      const newUserLikes = isLiked
        ? userLikes.filter((item) => item !== contentId)
        : [...userLikes, contentId];

      dispatch({
        type: "SET_LIKES",
        likes: newUserLikes,
        currentSite: state.currentSite && {
          ...state.currentSite,
          likes: state.currentSite.likes + (isLiked ? -1 : 1)
        }
      });

      try {
        await updateLikesInApi(
          contentId,
          encrypted!,
          password!,
          token!,
          userId!
        );
      } catch (error) {
        console.error(error);
      }
    },
    [state, encrypted, password, token, userId]
  );

  const changeSite = () => {
    const { mix, mixIndex, currentPage } = state;
    if (!mix) return;
    const newMixIndex = mixIndex + 1

    // Get more content if we are almost at the end of the mix
    if (newMixIndex >= mix.length - 3) {
      dispatch({ type: "SET_CURRENT_PAGE", currentPage: currentPage + 1 });
      if (!state.hasNextPage) dispatch({ type: 'SET_TAGS', tags: new Map() })
      getMix();
    }

    if (newMixIndex < mix.length) {
      dispatch({ type: "CHANGE_SITE", currentSite: mix[newMixIndex], mixIndex: newMixIndex });
    }
  };

  return {
    currentSite: state.currentSite,
    hasNextPage: state.hasNextPage,
    isLoading: state.isLoading,
    error: state.error,
    userLikes: state.userLikes,
    likeOrUnlike,
    changeSite,
    selectedTags: state.selectedTags,
    mixEnded: state.mix && !state.hasNextPage && state.mixIndex >= state.mix?.length - 1,
  };
};

export default useMix;
