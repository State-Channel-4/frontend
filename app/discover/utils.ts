import { TagMap } from "@/types";
import { Wallet } from "ethers";

import { getRawTransactionToSign } from "@/lib/utils";

export const fetchMix = async (
  tags: TagMap,
  page: number,
  limit: number
) => {
  const mixParams = createMixParams(tags, page, limit);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mix?${mixParams.toString()}`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.urls;
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    console.error("Error fetching mix:", error);
    return { message };
  }
};

export const updateLikesInApi = async (
  contentId: string,
  encrypted: string,
  password: string,
  token: string,
  userId: string
) => {
  const functionName = "likeURL";
  const params = [2]; // TODO: use a url id compatible with Solidity (object_id cannot be casted to bigint. I think it is too large)
  const metaTx = await getRawTransactionToSign(functionName, params);
  const wallet = Wallet.fromEncryptedJsonSync(encrypted!, password!);
  const signedLikeUrlTx = await wallet?.signTransaction(metaTx);
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/like/${contentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      signedMessage: signedLikeUrlTx,
      address: wallet.address,
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
  "not-found": "No content found for the selected tags. Please try again.",
  "no-tags": "No tags selected. Please select at least one tag.",
  loading: "Loading content...",
};

export const createMixParams = (
  tags: TagMap,
  currentPage: number,
  mixLimit: number
) => {
  const mixParams = new URLSearchParams();
  tags.forEach((tag) => {
    mixParams.append("tags", tag._id);
  });

  mixParams.append("page", currentPage.toString() || "1");
  mixParams.append("limit", mixLimit.toString());

  return mixParams;
};
