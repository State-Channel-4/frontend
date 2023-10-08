"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Channel4Icon from "@/assets/channel-4-icon-v2.svg"
import { Web3Auth } from "@web3auth/modal"

type WalletContextType = {
  connect: () => void
  disconnect: () => void
  isConnected: boolean
}

const WalletContext = createContext<WalletContextType>({
  connect: () => undefined,
  disconnect: () => undefined,
  isConnected: false,
})

export const WalletProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false)
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)

  const connect = async () => {
    await web3Auth?.connect()
    setIsConnected(true)
  }

  const disconnect = async () => {
    await web3Auth?.logout()
    setIsConnected(false)
  }

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
      if (client.status === "connected") {
        setIsConnected(true)
      }
      setWeb3Auth(client)
    }
    init()
  }, [])

  return (
    <WalletContext.Provider value={{ connect, disconnect, isConnected }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletContextType => useContext(WalletContext)
