import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { Copy, ExternalLink, LogOut } from "lucide-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

const WalletHeader = () => {

  const { connected, publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      connection.getBalance(publicKey).then((lamports) => {
        setBalance(lamports / 1e9); // Convert lamports to SOL
      });
    }
  }, [connected, publicKey, connection]);

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
    }
  };

  return (
    <div className="text-white flex flex-col sm:items-start">
      <h2 className="text-white text-2xl font-bold">
        {connected ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm text-primary">
              {publicKey
                ? `${publicKey
                  .toBase58()
                  .slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
                : ""}
            </span>
            <a
              href={`https://solanabeach.io/address/${publicKey?.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>
          </div>
        ) : (
          "Connect Wallet"
        )}
      </h2>
      <p className="text-gray-400 text-sm">
        {!connected && "You need to connect to a Solana wallet."}
      </p>

      {connected && (
        <div className="flex items-center justify-between rounded-lg w-full mt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">
              {balance !== null ? `$${(balance * 100).toFixed(2)}` : "$0"}
            </span>
            <span className="text-sm text-slate-400">
              ~{balance !== null ? balance.toFixed(4) : "0"} SOL
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-[#2C3C4E] rounded-full text-white"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 text-white" />
            </Button>
            <Button
              onClick={disconnect}
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-[#2C3C4E] rounded-full text-white"
            >
              <LogOut className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletHeader;
