import { TagMap } from "@/types";
import { JsonRpcSigner, Wallet } from "ethers";

import { createProxyUrls } from "@/app/utils";
import { getRawTransactionToSign } from "@/lib/utils";

export const fetchMix = async (
  tags: TagMap,
  limit: number
) => {
  const mixParams = createMixParams(tags, limit);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mix?${mixParams.toString()}`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    const mixWithProxyUrls = createProxyUrls(data.urls);
    return { urls: mixWithProxyUrls };
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    console.error("Error fetching mix:", error);
    return { message };
  }
};

export const fetchLikes = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/likes`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const { likes } = await response.json();
    return likes.map(({ id }: { id: string }) => id);
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    console.error("Error fetching mix:", error);
    return { message };
  }
}

export const updateLikesInApi = async (
  contentId: string,
  liked: boolean,
  signer: JsonRpcSigner,
  token: string,
  userId: string,
) => {
  const functionName = "toggleLike";
  // Stringifying the URL for now since input in smart contract has changed to string and is
  const params = ['2', liked, 1, signer.address]; // TODO: use a url id compatible with Solidity (object_id cannot be casted to bigint. I think it is too large)
  const metaTx = await getRawTransactionToSign(functionName, params);
  // const wallet = Wallet.fromEncryptedJsonSync(encrypted!, password!);
  const signedLikeUrlTx = await signer.signTransaction(metaTx);
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/like/${contentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      signedMessage: signedLikeUrlTx,
      address: signer.address,
      functionName: functionName,
      params: params,
      // TODO: temp params for mongodb
      userId: userId,
    }),
  }).then((response) => {
    return response.json();
  });
};

export const feedbackMessages = {
  "not-found": "Oops! We couldn't find any content... Let's try again — maybe some other tags.",
  loading: "Loading content...",
};

export const createMixParams = (
  tags: TagMap,
  mixLimit: number
) => {
  const mixParams = new URLSearchParams();

  const tagIds = tags.size > 0 ? Array.from(tags, ([tagId, tagName]) => tagId) : ["all"];
  tagIds.forEach(tagId => mixParams.append("tags", tagId));
  mixParams.append("limit", mixLimit.toString());

  return mixParams;
};

