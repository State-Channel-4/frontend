'use client';

import { useEncryptedStore } from "@/store/encrypted";
import { usePasswordStore } from "@/store/password";
import { C4Content, Tag, TagMap } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
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
        setMix(mixResponse.urls);
        setCurrentSite(mixResponse.urls[0]);
        setHasNextPage(mixResponse.hasNextPage);
      }
    } catch (error) {
      setError({ message: "Error handling mix" });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, mixLimit, selectedTags]);

  const getTagsFromStore = useCallback(() => {
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
    getTagsFromStore();
    getMix();
  }, [getMix, getTagsFromStore]);

  const likeOrUnlike = useCallback(
    async (contentId: string) => {
      if (!currentSite) return;

      const isLiked = userLikes.includes(contentId);
      const newUserLikes = isLiked
        ? userLikes.filter((item) => item !== contentId)
        : [...userLikes, contentId];

      setUserLikes(newUserLikes);

      currentSite.likes += isLiked ? -1 : 1;

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
    if (mixIndex >= mix.length - 1) {
      setCurrentPage(currentPage + 1);
      getMix();
    } else {
      const newMixIndex = mixIndex + 1;
      setMixIndex(newMixIndex);
      setCurrentSite(mix[newMixIndex]);
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
