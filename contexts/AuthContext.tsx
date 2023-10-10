"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import Channel4Icon from "@/assets/channel-4-icon-v2.svg"
import { usePasswordStore } from "@/store/password"
import { Web3Auth } from "@web3auth/modal"
import { BrowserProvider } from "ethers"

type AuthContextType = {
  initializingW3A: boolean
  signIn: () => void
  signedIn: boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  initializingW3A: false,
  signIn: () => undefined,
  signedIn: false,
  signOut: () => undefined,
})

export const WalletProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
  const { token, userId, updateToken, updateUserId } = usePasswordStore()

  const signIn = async () => {
    try {
      const web3AuthProvider = await web3Auth?.connect()
      if (web3AuthProvider) {
        // Create ethers provider from web3 auth provider
        const provider = new BrowserProvider(web3AuthProvider)
        const signer = await provider.getSigner()
        const signedMessage = await signer.signMessage(
          process.env.NEXT_PUBLIC_API_LOGIN_SECRET!
        )
        // TODO: Place inside a server utils folder?
        // Login on the server
        const { user, token, message } = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signedMessage }),
          }
        ).then((response) => response.json())
        // handle any server error messages
        if (message) throw new Error(message)
        updateToken(token)
        updateUserId(user._id)
      }
    } catch (err) {
      // TODO: Add toast notifications to display errors?
      console.log("Error occured signing in: ", err)
    }
  }

  const signOut = async () => {
    await web3Auth?.logout()
    updateToken(null)
    updateUserId(null)
  }

  const signedIn = useMemo(() => {
    return web3Auth?.status === "connected" && token && userId
  }, [token, userId, web3Auth])

  useEffect(() => {
    const init = async () => {
      const client = new Web3Auth({
        clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID ?? "",
        web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0x5",
          rpcTarget: "https://rpc.ankr.com/eth_goerli",
          displayName: "Ethereum Goerli",
          blockExplorer: "https://goerli.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        },
        uiConfig: {
          appName: "Channel 4",
          logoDark: Channel4Icon.src,
          logoLight: Channel4Icon.src,
        },
      })
      await client.initModal()
      setWeb3Auth(client)
    }
    init()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        initializingW3A: !web3Auth,
        signIn,
        signedIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => useContext(AuthContext)
