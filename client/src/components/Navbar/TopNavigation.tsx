"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Maximize2, SquareDot, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletIcon } from "@solana/wallet-adapter-react-ui"; // Import the WalletIcon component
import { Button } from "@/components/ui/button";
import SettingsModal from "../Modal/SettingsModal";
import WalletModal from "../WalletModal/WalletConnectModal";
import { IoIosSettings } from "react-icons/io";

interface WalletOption {
  name: string;
  id: string;
  icon: string;
}

export default function TopNavigation() {
  const pathname = usePathname();
  const { connected, publicKey, connect, wallet } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeTab = pathname.startsWith("/onboard") ? "Onboard" : "Spot";

  const WalletOption = ({ icon, name, id }: WalletOption) => (
    <Button
      variant="outline"
      style={{ padding: "1.9rem" }}
      className="flex items-center justify-start sm:w-full    bg-[#1C2A3A] !gap-0 border-none text-white"
      onClick={() => handleConnect(id)}
    >
      <img src={icon} alt={name} className="w-6 h-6 mr-3" />
      <span className="font-bold">{name}</span>
    </Button>
  );

  const handleConnect = async (walletId: string) => {
    try {
      setConnectingWallet(walletId);
      setConnectionError(null);
      await connect();
      setWalletModalOpen(false);
    } catch (error) {
      console.error(`Failed to connect to ${walletId}:`, error);
      setConnectionError(`Failed to connect to ${walletId}. Please try again.`);
    } finally {
      setConnectingWallet(null);
    }
  };

  const shortenedPublicKey = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  return (
    <div className="flex items-center justify-between px-4 bg-[#131C25] w-full flex-nowrap">
      {/* Spacer for alignment on desktop - hidden on mobile */}
      <div className="hidden sm:flex sm:flex-1" />

      {/* Navigation Tabs */}
      <div className="flex gap-2 sm:gap-4 flex-1 sm:flex-grow-0 sm:justify-center">
        <Link href="/">
          <div
            className={`group flex items-center gap-2 px-3 sm:px-10 py-3 sm:py-5 cursor-pointer ${activeTab === "Spot"
                ? "bg-[rgba(199,242,130,0.05)] text-cyan-400 border-b-2 border-cyan-400"
                : "text-white"
              }`}
          >
            <div
              className={`hidden sm:flex w-8 h-8 items-center justify-center rounded-lg ${activeTab === "Spot"
                  ? "bg-[rgba(199,242,130,0.05)]"
                  : "bg-[#1C2A3A]"
                } group-hover:text-primary`}
            >
              <Maximize2
                className={`w-4 h-4 ${activeTab === "Spot" ? "text-cyan-400" : "text-white"
                  } group-hover:text-primary`}
              />
            </div>
            <span className="text-sm sm:text-base font-bold group-hover:text-primary">
              Spot
            </span>
          </div>
        </Link>

        <Link href="/onboard/onramp">
          <div
            className={`group flex items-center gap-2 px-3 sm:px-10 py-3 sm:py-5 cursor-pointer ${activeTab === "Onboard"
                ? "bg-[rgba(199,242,130,0.05)] text-cyan-400 border-b-2 border-cyan-400"
                : "text-white"
              }`}
          >
            <div
              className={`hidden sm:flex w-8 h-8 items-center justify-center rounded-lg ${activeTab === "Onboard"
                  ? "bg-[rgba(199,242,130,0.05)]"
                  : "bg-[#1C2A3A]"
                } group-hover:text-primary`}
            >
              <SquareDot
                className={`w-4 h-4 ${activeTab === "Onboard" ? "text-cyan-400" : "text-white"
                  } group-hover:text-primary`}
              />
            </div>
            <span className="text-sm sm:text-base font-bold group-hover:text-primary">
              Onboard
            </span>
          </div>
        </Link>
      </div>

      {/* Right Section - flex-1 on desktop to maintain center alignment of tabs */}
      <div className="flex items-center gap-3 sm:flex-1 justify-end">
        {/* Settings Icon */}
        <div
          onClick={() => setSettingsModalOpen(true)}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1C2A3A] rounded-full hover:bg-gray-600 hover:border border-primary group"
        >
          <IoIosSettings className="text-white w-[17px] h-[17px] font-extrabold group-hover:text-primary" />
        </div>

        {isClient && (
          <Button
            variant="outline"
            className="bg-[#1C2A3A] border-none hover:bg-[#2C3A4A] text-white rounded-3xl hover:text-white px-2 py-2 sm:py-0"
            onClick={() => setWalletModalOpen(true)}
          >
            <span className="font-bold flex items-center">
              {!connected ? (
                <span className="bg-gradient-to-r from-cyan-400 to-lime-400 bg-clip-text text-transparent">
                  <span className="block sm:hidden">Connect</span>
                  <span className="hidden sm:block">Connect Wallet</span>
                </span>
              ) : (
                <>
                  {wallet && (
                    <WalletIcon
                      wallet={wallet}
                      className="text-white w-6 h-6 rounded-full mr-0 sm:mr-1"
                    />
                  )}
                  {publicKey && (
                    <span className="hidden sm:block">
                      {publicKey.toBase58().slice(0, 2)}...
                      {publicKey.toBase58().slice(-2)}
                    </span>
                  )}
                </>
              )}
            </span>

            {connected && (
              <div className="flex items-center space-x-2">
                <ChevronDown size={20} className="text-white" />
              </div>
            )}
          </Button>
        )}

        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setWalletModalOpen(false)}
        />
      </div>

      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
      )}
    </div>
  );
}
