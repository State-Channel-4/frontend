"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

/**
 * check signin status and navigate to
 * appropriate route
 * accept same props type with Route element of react-router-dom
 */

interface Props {
  children: JSX.Element
}

const RequireAuth = ({ children }: Props) => {
  const { initializingW3A, signIn, signedIn } = useAuth()
  if (initializingW3A) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4">
        <h2>Checking Web3Auth Connection...</h2>
        <Loader2 className="mt-4 animate-spin stroke-c4-green" size={36} />
      </div>
    )
  } else if (!signedIn) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center">
        <h2 className="my-5">
          Sign in{" "}
          <button
            className="cursor-pointer text-c4-green"
            onClick={() => signIn()}
          >
            here
          </button>{" "}
          to view this section
        </h2>
      </div>
    )
  } else {
    return children
  }
}

export default RequireAuth
