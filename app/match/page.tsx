"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useEncryptedStore } from "@/store/encrypted"
import { usePasswordStore } from "@/store/password"
import { MatchDocument } from "@/types"
import RequireAuth from "@/components/helper/RequireAuth"
import { Button } from "@/components/ui/button"


const handleVerificationSubmit = async (matchId, userId, token) => {
  const verifiedURLs = JSON.parse(localStorage.getItem("valid_urls")) || [];
  const invalidURLs = JSON.parse(localStorage.getItem("invalid_urls")) || [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/updatematch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId,
          userId,
          verifiedURLs,
        }),
      }
    );

    if (response.ok) {
      // Handle a successful response, e.g., show a success message
    } else {
      // Handle the error response, e.g., show an error message
    }
  } catch (error) {
    console.error("Error submitting verification:", error);
  }
};

const handleCheckboxChange = (event, url, storageKey) => {
  const isChecked = event.target.checked;

  // Get the current state from local storage or initialize an empty array
  let storedData = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Check if the URL is in the other list (valid_urls or invalid_urls) and remove it
  const otherStorageKey = storageKey === "valid_urls" ? "invalid_urls" : "valid_urls";
  storedData = storedData.filter((id) => !isInLocalStorage(id, otherStorageKey));

  if (isChecked) {
    // Add the URL ID to the array if checked
    storedData.push(url);
  } else {
    // Remove the URL ID from the array if unchecked
    const index = storedData.indexOf(url);
    if (index !== -1) {
      storedData.splice(index, 1);
    }
  }

  // Save the updated state to local storage
  localStorage.setItem(storageKey, JSON.stringify(storedData));
};

const isInLocalStorage = (urlId, storageKey) => {
  const storedData = JSON.parse(localStorage.getItem(storageKey)) || [];
  return storedData.includes(urlId);
};


const MatchDetails = ({ matchData, userId, token, onVerificationSubmit }: {matchData: MatchDocument, userId : string | null, token: string | null, onVerificationSubmit: (matchId: string, userId : string | null , token: string | null) => void }) => {
  const user1Urls = matchData.user1.urls.map((url, index) => (
    <li key={index}>
      {/*<input value = {url._id} type = "checkbox" onChange={(e) => handleCheckboxChange(e, url._id)} />*/}
      <strong>Title:</strong> {url.title} | <strong>URL:</strong> {url.url}
    </li>
  ));
  const user2Urls = matchData.user2.urls.map((url, index) => (
    <li key={index}>
      <strong>Title:</strong> {url.title} | <strong>URL:</strong> {url.url}<br />
      <input value = {url._id} type = "checkbox" onChange={(e) => handleCheckboxChange(e, url.url, "valid_urls")} />
      <label>Valid url</label><br />
      <input value = {url._id} type = "checkbox" onChange={(e) => handleCheckboxChange(e, url.url, "invalid_urls")} />
      <label>Invalid url</label><br />
    </li>
  ));

  return (
    <div>
      <h2>Match Details</h2>
      <ul>
        <li>
          <strong>Status:</strong> {matchData.status}
        </li>
        <li>
          <strong>Threshold:</strong> {matchData.threshold}
        </li>
        <li>
          <strong>Created At:</strong>{" "}
          {new Date(matchData.createdAt).toLocaleString()}
        </li>
        <li>
          <strong>Updated At:</strong>{" "}
          {new Date(matchData.updatedAt).toLocaleString()}
        </li>
        <li>
          <strong>your URLs:</strong>
          <ul>{user1Urls}</ul>
        </li>
        <li>
          <strong>URLs you have to validate :</strong>
          <ul>{user2Urls}</ul>
        </li>
      </ul>
      <Button variant="outline" className="rounded-full border-green-500 py-6 text-green-500"
      onClick={() => onVerificationSubmit(matchData._id, userId, token)}>Submit Verification</Button>
    </div>
  );
};


const Match = () => {
  const router = useRouter()
  const [match, setMatch] = useState(null)
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const { address } = useEncryptedStore()
  const { userId, token } = usePasswordStore()

  useEffect(() => {
    ;(async () => {
      try {
        const { match } = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getmatch/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json())
        if (match) {
          if (match.user1.id === userId) {
            setUser1(match.user1);
            setUser2(match.user2);
          } else {
            setUser1(match.user2);
            setUser2(match.user1);
          }
          setMatch(match); // Set the match state
        }
      } catch (error) {
        console.log(error);
      }
    })()
  }, [address, userId, token, router])



  return (
    <RequireAuth>
      <section className="mx-auto flex max-w-xl flex-col gap-6 p-6">
        <h2 className="text-left font-semibold">My matches</h2>
        <div className="h-0.5 bg-c4-gradient-separator"></div>
        <div className="flex h-full flex-col gap-8 rounded-lg bg-slate-900 p-6">
          <Row>
            <p className="font-semibold">your match</p>
            {match ? (
              <MatchDetails matchData={match}  userId = {userId} token = {token} onVerificationSubmit={handleVerificationSubmit} />
              ) : (
              <button>createMatch</button>
            )}
          </Row>
          <Row>
            <p className="font-semibold">your task</p>
            <p>user2</p>
            {user2 &&
              
              <p>{user2.id}</p>
            }
          </Row>
        </div>
      </section>
    </RequireAuth>
  )
}

const Row = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-between border-b-2 border-slate-500/50 pb-4">
      {children}
    </div>
  )
}

export default Match
