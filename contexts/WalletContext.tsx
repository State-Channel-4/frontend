"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Web3Auth } from "@web3auth/modal"

type WalletContextType = {
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  connect: () => undefined,
  disconnect: () => undefined,
})

export const WalletProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)

  const connect = async () => {
    await web3Auth?.connect()
  }

  const disconnect = async () => {
    await web3Auth?.logout()
  }

  useEffect(() => {
    const init = async () => {
      const client = new Web3Auth({
        clientId:
          "BE65SUL7uw9BlHE9fGxszZjg2qbjelx7WKPJmoJjVUxEwW7ckn4RDWmJAmYDlxRIg4JFAxaidM0Tby9HcaGYj2g",
        web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0x1",
          rpcTarget: "https://rpc.ankr.com/eth",
          displayName: "Ethereum Mainnet",
          blockExplorer: "https://goerli.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        },
      })
      // Init modal if client is not already connected
      if (!client.connected) {
        await client.initModal()
      }
      setWeb3Auth(client)
    }
    init()
  }, [])

  return (
    <WalletContext.Provider value={{ connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletContextType => useContext(WalletContext)
