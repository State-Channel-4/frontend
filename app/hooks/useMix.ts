'use client';

import { useEncryptedStore } from "@/store/encrypted";
import { usePasswordStore } from "@/store/password";
import { C4Content, Tag, TagMap } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchMix, updateLikesInApi } from "../discover/utils";

const useMix = () => {
  const { encrypted } = useEncryptedStore();
  const { password, token, userId } = usePasswordStore();
  const [currentSite, setCurrentSite] = useState<C4Content | null>(null);
  const selectedTags = useRef<TagMap>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string }>({ message: "" });
  const [mixIndex, setMixIndex] = useState<number>(0);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mix, setMix] = useState<C4Content[] | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const mixLimit = 100;

  const getMix = useCallback(async () => {
    setIsLoading(true);
    try {
      const mixResponse = await fetchMix(
        selectedTags.current,
        currentPage,
        mixLimit
      );
      if (mixResponse.message) {
        setError({ message: mixResponse.message });
      } else {
        if (mixIndex > 0 && mix) {
          // If the index is greater than 0, that means we are adding to the mix, so we need to keep the rest of previous mix
          const newMix = [...mix.slice(mixIndex), ...mixResponse.urls];
          setMix(newMix);
        } else {
          setMix(mixResponse.urls);
        }
        setCurrentSite(mix ? mix[0] : null);
        setHasNextPage(mixResponse.hasNextPage);
      }
    } catch (error) {
      setError({ message: "Something went wrong getting a mix" });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, mixLimit, selectedTags]);

  const getTagsFromStore = useMemo(() => {
    const tagsFromStore = sessionStorage.getItem("c4.tags");
    if (!tagsFromStore) return;
    try {
      const parsedTags = JSON.parse(tagsFromStore);
      parsedTags.forEach((data: [string, Tag]) => {
        const [key, value] = data;
        selectedTags.current.set(key, value);
      });

    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, []);

  useEffect(() => {
    // TODO: Get user likes from API
    // getTagsFromStore();
    getMix();
  }, [getMix]);

  const likeOrUnlike = useCallback(
    async (contentId: string) => {
      if (!currentSite) return;

      const isLiked = userLikes.includes(contentId);
      const newUserLikes = isLiked
        ? userLikes.filter((item) => item !== contentId)
        : [...userLikes, contentId];

      setUserLikes(newUserLikes);

      setCurrentSite((prevSite) => {
        if (prevSite) {
          return {
            ...prevSite,
            likes: prevSite.likes + (isLiked ? -1 : 1)
          };
        }
        return prevSite;
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
    [currentSite, userLikes, encrypted, password, token, userId]
  );

  const changeSite = () => {
    if (!mix) return;
    const newMixIndex = mixIndex + 1

    // Get more content if we are almost at the end of the mix
    if (newMixIndex >= mix.length - 3) {
      setCurrentPage(currentPage + 1)
      getMix();
    }

    if (newMixIndex < mix.length) {
      setMixIndex(mixIndex);
      setCurrentSite(mix[newMixIndex])
    }
  };

  return {
    currentSite,
    hasNextPage,
    isLoading,
    error,
    userLikes,
    likeOrUnlike,
    changeSite,
    selectedTags,
    mixEnded: mix && !hasNextPage && mixIndex >= mix?.length - 1,
  };
};

export default useMix;
