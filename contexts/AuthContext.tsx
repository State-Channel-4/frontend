"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import Channel4Icon from "@/assets/channel-4-icon-v2.svg"
import { usePasswordStore } from "@/store/password"
import { Web3Auth } from "@web3auth/modal"
import {
  BrowserProvider,
  Eip1193Provider,
  JsonRpcSigner,
  Provider,
} from "ethers"

type AuthContextType = {
  initializingW3A: boolean
  signer: JsonRpcSigner | null
  signIn: () => void
  signedIn: boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  initializingW3A: false,
  signer: null,
  signIn: () => undefined,
  signedIn: false,
  signOut: () => undefined,
})

export const AuthProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
  const { token, userId, updateToken, updateUserId } = usePasswordStore()

  const getSigner = async (web3AuthProvider: Eip1193Provider) => {
    const provider = new BrowserProvider(web3AuthProvider)
    return await provider.getSigner()
  }

  const signIn = async () => {
    try {
      const web3AuthProvider = await web3Auth?.connect()
      if (web3AuthProvider) {
        // Create ethers provider from web3 auth provider
        const rpcSigner = await getSigner(web3AuthProvider)
        const signedMessage = await rpcSigner.signMessage(
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
        setSigner(rpcSigner)
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
    return !!signer && !!token && !!userId
  }, [signer, token, userId])

  useEffect(() => {
    const init = async () => {
      const client = new Web3Auth({
        clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID ?? "",
        web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0xaa36a7",
          rpcTarget: "https://rpc.ankr.com/eth_sepolia",
          displayName: "Ethereum Sepolia",
          blockExplorer: "https://sepolia.etherscan.io",
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
      // Check if web3 is connected and if so extract signer
      if (client.status === "connected" && client.provider) {
        const rpcSigner = await getSigner(client.provider)
        setSigner(rpcSigner)
      }
    }
    init()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        initializingW3A: !web3Auth,
        signer,
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
