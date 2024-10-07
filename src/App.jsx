import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { useState } from 'react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import './index.css';
import { DiscoverWalletProviders } from "./components/DiscoverWalletProviders";

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getTokenBalance() {
    setLoading(true);
    const config = {
      apiKey: import.meta.env.VITE_API_KEY,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setLoading(false);
    setHasQueried(true);
  }

  return (
    <div className="w-screen min-h-screen bg-black text-white p-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-4 font-bold">ERC-20 Token Indexer</h1>
        <p className="text-center text-lg">
          Plug in an address and this website will return all of its ERC-20 token balances!
        </p>
      </div>

      <div className="flex flex-col items-center mt-8">
        <h2 className="text-3xl mt-4 font-semibold">
          Get all the ERC-20 token balances of this address:
        </h2>
        <input
          onChange={(e) => setUserAddress(e.target.value)}
          className="text-black w-[600px] text-center p-4 mt-4 bg-white text-xl rounded border"
          placeholder="Enter Address"
          value={userAddress}
        />
        <div className="flex gap-2">
        <button
          onClick={getTokenBalance}
          className="bg-blue-500 text-white text-xl px-6 py-3 rounded mt-9 hover:bg-blue-600"
        >
          Check ERC-20 Token Balances
        </button>
        <Dialog>
          <DialogTrigger className="bg-blue-500 text-white text-xl px-6 py-3 rounded mt-9 hover:bg-blue-600">Connect Wallet</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect</DialogTitle>
              <DialogDescription>
                <DiscoverWalletProviders setUserAddress={setUserAddress}/>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        </div>
        

        <h2 className="text-3xl mt-12 mb-8 font-semibold">ERC-20 token balances:</h2>

        {hasQueried ? (
          <div className="grid grid-cols-4 gap-8 w-[90vw]">
            {results.tokenBalances.map((e, i) => {
              return (
                <div
                  className="flex flex-col items-start bg-blue-500 text-white p-6 rounded-lg  truncate"
                  key={i}
                >
                  <div>
                    <b>Symbol:</b> ${tokenDataObjects[i]?.symbol || 'N/A'}&nbsp;
                  </div>
                  <div className="flex mr-6">
                   <b>Balance:</b>&nbsp;
                    <p className="truncate">{Utils.formatUnits(
                      e.tokenBalance,
                      tokenDataObjects[i]?.decimals || 18
                    ).slice(0,12)}</p>
                  </div>
                  {tokenDataObjects[i]?.logo && (
                    <img
                      src={tokenDataObjects[i].logo}
                      alt="Token Logo"
                      className="mt-4 h-10 w-10"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (<>
          {
            loading ? ( <>Loading...</> ):( <p className="text-gray-500">Please make a query! This may take a few seconds...</p> )
          }
          </>
        )}
      </div>
    </div>
  );
}

export default App;
