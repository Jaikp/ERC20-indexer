import { useState } from "react"
import { useSyncProviders } from '../hooks/useSyncProviders'
import { formatAddress } from "../utils"
import React from "react"

export const DiscoverWalletProviders = ({setUserAddress}) => {
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>()
  const [userAccount, setUserAccount] = useState<string>("")
  const providers = useSyncProviders()

  // Connect to the selected provider using eth_requestAccounts.
  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      const accounts = await providerWithInfo.provider.request({
        method: "eth_requestAccounts"
      })

      setSelectedWallet(providerWithInfo)
      setUserAccount(accounts?.[0])
      setUserAddress(accounts?.[0])
    
    } catch (error) {
      console.error(error)
    }
  }

  // Display detected providers as connect buttons.
  return (
    <>
      <h2>Wallets Detected:</h2>
      <div className="flex justify-between">
        {
          providers.length > 0 ? providers?.map((provider: EIP6963ProviderDetail) => (
            <div className="w-fit p-4">
              <button key={provider.info.uuid} onClick={() => handleConnect(provider)} >
                    
                      <img width='100' height='100' src={provider.info.icon} alt={provider.info.name} />
                      <div>{provider.info.name}</div>
                    
              </button>
            </div>
          )) :
            <div>
              No Announced Wallet Providers
            </div>
        }
      </div>
      <hr />
      <h2>{userAccount ? "" : "No "}Wallet Selected</h2>
      {userAccount &&
        <div>
          <div>
            <img src={selectedWallet.info.icon} alt={selectedWallet.info.name} />
            <div>{selectedWallet.info.name}</div>
            <div>({formatAddress(userAccount)})</div>
          </div>
        </div>
      }
    </>
  )
}
