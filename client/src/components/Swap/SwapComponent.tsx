"use-client";

import React, { useState } from "react";
import TokenInputSection from "../Inputs/TokenInputSection";
import SwapButton from "@/components/Buttons/SwapButton";
import JupiterZToggle from "@/components/Swap/jupiterztoggle";
import SettingsToggle from "@/components/Swap/SettingsToggle";
import { ConnectWalletBtn } from "../Buttons/ConnectWalletBtn";
import WalletModal from "../WalletModal/WalletConnectModal";



interface WalletOption {
  name: string;
  id: string;
  icon: string;
}

interface SwapComponentProps {
  tokenListLoading: boolean;
  sellCurrency: any;
  setSellCurrency: (token: any) => void;
  buyCurrency: any;
  setBuyCurrency: (token: any) => void;
  sellAmount: number | undefined;
  setSellAmount: (amount: number | undefined) => void;
  buyAmount: number | undefined;
  quoteLoading: boolean;
  modalType: "sell" | "buy";
  setModalType: (type: "sell" | "buy") => void;
  setModalOpen: (open: boolean) => void;
  connected: boolean;
  executeJupiterSwap: () => void;
  loadingSwap: boolean;
}

const SwapComponent = ({
  tokenListLoading,
  sellCurrency,
  setSellCurrency,
  buyCurrency,
  setBuyCurrency,
  sellAmount,
  setSellAmount,
  buyAmount,
  quoteLoading,
  modalType,
  setModalType,
  setModalOpen,
  connected,
  executeJupiterSwap,
  loadingSwap,
}: SwapComponentProps) => {

  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const handleOpenModal = () => {
    setWalletModalOpen(true);
  };

  return (
    <div className="space-y-2">
      <SettingsToggle />
      <TokenInputSection
        label="You're Selling"
        tokenListLoading={tokenListLoading}
        selectedToken={sellCurrency}
        amount={sellAmount}
        onAmountChange={setSellAmount}
        onSelectToken={setSellCurrency}
        quoteLoading={quoteLoading} // ✅ Ensure this is passed
        modalType="sell"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        showAmountSpan={false} // Explicitly false
      />
      <SwapButton
        onSwap={() => {
          const tempCurrency = sellCurrency;
          setSellCurrency(buyCurrency);
          setBuyCurrency(tempCurrency);
          setSellAmount(buyAmount);
        }}
      />
      <TokenInputSection
        label="You're Buying"
        tokenListLoading={tokenListLoading}
        selectedToken={buyCurrency}
        amount={buyAmount}
        onSelectToken={setBuyCurrency}
        onAmountChange={() => { }}
        modalType="buy"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        quoteLoading={quoteLoading}
        showAmountSpan={false} // Explicitly false
        backgroundColorClass="bg-[#19232D]" // or any other custom Tailwind class
      />
      <JupiterZToggle />
      <ConnectWalletBtn
        text={connected ? "Swap" : "Connect Wallet"}
        onClick={handleOpenModal}
        marginTop="mt-4" // Optional margin top if needed
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
      {/* Modal component */}
    </div>
  );
};

export default SwapComponent;
