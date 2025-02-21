import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
// import { useToast } from "@/hooks/use-toast";

interface WalletListProps {
  wallets: any[];
}

const WalletList = ({ wallets }: WalletListProps) => {
  const { select, connect } = useWallet();
  // const { toast } = useToast();

  const handleConnect = async (w: any) => {
    if (!w || !w.adapter) {
      // toast({
      //   title: "Wallet Error",
      //   description: "Invalid wallet selection.",
      //   variant: "destructive",
      // });
      return;
    }

    if (!w.readyState || w.readyState !== "Installed") {
      // toast({
      //   title: "Wallet Not Found",
      //   description: `${w.adapter.name} is not installed.`,
      //   variant: "destructive",
      // });
      return;
    }

    try {
      await select(w.adapter.name);
      await connect();
    } catch (error) {
      let errorMessage = "Error connecting to wallet.";
      if ((error as any).name === "WalletNotReadyError") {
        errorMessage = `${w.adapter.name} is not available.`;
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      // toast({
      //   title: "Connection Error",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto p-3">
      {wallets.length === 0 ? (
        <p className="text-gray-400">
          No wallets available. Please install a compatible wallet.
        </p>
      ) : (
        wallets.map((w) =>
          w && w.adapter ? (
            <div
              key={w.adapter.name}
              className="relative flex h-[70px] items-center justify-start gap-4 rounded-lg bg-[#1C2936] p-4 text-sm shadow-md md:text-base border-none hover:bg-[#22303C] overflow-hidden cursor-pointer"
              onClick={() => handleConnect(w)}
            >
              <img
                src={w.adapter.icon}
                alt={w.adapter.name}
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <span
                className="font-semibold text-white truncate text-sm"
                style={{ maxWidth: "calc(100% - 48px)" }}
              >
                {w.adapter.name}
              </span>
            </div>
          ) : null
        )
      )}
    </div>
  );
};

export default WalletList;
