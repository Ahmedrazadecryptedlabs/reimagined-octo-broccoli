import { Ban, RotateCw } from "lucide-react";
import React, { useState, useEffect } from "react";
import WalletModal from "../WalletModal/WalletConnectModal";
import { useWallet } from "@solana/wallet-adapter-react";

const tabMessages: Record<string, string> = {
  default: "No swap history",
  openOrders: "No open orders",
  activeDCAs: "You have no active orders",
  activeVAs: "No active orders",
};

interface ConnectWalletSectionProps {
  tabs: { id: string; label: string }[];
  defaultActiveTab?: string;
  showCancelAll?: boolean;
  headerTop?: boolean;
}

const ConnectWalletSection = ({
  tabs = [],
  defaultActiveTab = tabs[0]?.id || "",
  showCancelAll = true,
  headerTop = false,
}: ConnectWalletSectionProps) => {

  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const { connected } = useWallet();
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, tabs]);

  if (!tabs.length) {
    return <p className="text-gray-400">No tabs available</p>;
  }

  return (
    <div className="my-4">
      {headerTop && (
        <div className="flex flex-wrap items-center justify-between rounded-lg w-full my-2">
          <div className="flex space-x-2 sm:space-x-3 items-center mb-2 sm:mb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full ${activeTab === tab.id
                    ? "bg-primary/10 border border-cyan-400 text-primary"
                    : "text-gray-500 hover:text-primary"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button className="group flex items-center justify-center rounded-lg border border-white/10 px-3 sm:px-[12px] py-3 hover:border-primary">
              <RotateCw
                className="text-white/50 transition-colors duration-200 group-hover:text-primary"
                size={10}
              />
            </button>
            {showCancelAll && (
              <button
                className="group flex items-center space-x-1 sm:space-x-2 text-sm font-bold px-2 sm:px-3 py-2 rounded-lg text-gray-500 border border-gray-600 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                <Ban
                  size={12}
                  className="text-gray-500 transition-colors duration-200 group-hover:text-primary"
                />
                <span className="text-xxs sm:text-xs">Cancel All</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex h-[200px] w-full flex-col items-center justify-center space-y-2 rounded-lg border border-v2-lily/5 mt-3">
        <div className="text-center">
          {!connected ? (
            <>
              <p className="text-sm text-gray-400 mb-2">View History</p>
              <button
                onClick={() => setWalletModalOpen(true)}
                className="border border-transparent px-5 sm:px-6 py-2 text-primary bg-primary/10 text-black rounded-lg font-bold shadow-md transition-all duration-300 hover:border-cyan-400"
              >
                Connect Wallet
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              {tabMessages[activeTab] || ""}
            </p>
          )}
        </div>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
};

export default ConnectWalletSection;
