"use client";
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/Sheet";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletHeader from "./WalletHeader";
import WalletList from "./WalletList";
import { PortfolioView } from "./PortfolioSection";
import { DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {

  const { wallets, connected } = useWallet();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={`w-full sm:max-w-[500px] ${connected ? "bg-[#304256]" : "bg-[#192530]"
          } border-l border-gray-800`}
      >
        <SheetHeader>
          <VisuallyHidden>
            <DialogTitle>Wallet Details</DialogTitle>{" "}
            {/* Visually hidden title */}
          </VisuallyHidden>
        </SheetHeader>
        <WalletHeader />
        {!connected && (
          <h2 className="text-sm font-bold mt-4 text-white p-3">Wallets</h2>
        )}
        {connected ? <PortfolioView /> : <WalletList wallets={wallets} />}
      </SheetContent>
    </Sheet>
  );
};

export default WalletModal;
