import React, { useState } from "react";
import TokenInputSection from "../Inputs/TokenInputSection";
import SwapButton from "@/components/Buttons/SwapButton";

import RateExpirySection from "./RateExpirySection";
import LimitOrderSummary from "./LimitOrderSummary";
import { ConnectWalletBtn } from "../Buttons/ConnectWalletBtn";
import WalletModal from "../WalletModal/WalletConnectModal";

interface LimitComponentProps {
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

const LimitComponent = ({
  tokenListLoading,
  sellCurrency,
  setSellCurrency,
  buyCurrency,
  setBuyCurrency,
  sellAmount,
  setSellAmount,
  buyAmount,
  quoteLoading,
  setModalType,
  setModalOpen,
  connected,
}: LimitComponentProps) => {
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const handleOpenModal = () => {
    setWalletModalOpen(true);
  };

  const orderDetails = [
    { label: "Sell Order", value: "5 USDC" },
    { label: "To Buy", value: "0.026082225 SOL" },
    { label: "Buy SOL at Rate", value: "191.701436515 USDC" },
    { label: "Expiry", value: "Never" },
    { label: "Platform Fee", value: "0.10%" },
  ];
  return (
    <div className="space-y-[4px]">
      <TokenInputSection
        label="You're Selling"
        tokenListLoading={tokenListLoading}
        selectedToken={sellCurrency}
        amount={sellAmount}
        onAmountChange={setSellAmount}
        onSelectToken={setSellCurrency}
        quoteLoading={quoteLoading}
        modalType="sell"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        showAmountSpan={true} // Explicitly false
        showWalletInfo={true} // Control whether to show wallet info
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
        onAmountChange={() => {}}
        quoteLoading={quoteLoading}
        modalType="buy"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        showAmountSpan={true} // Explicitly false
        showWalletInfo={true} // Control whether to show wallet info
      />
      <RateExpirySection
        rate="191.530483704"
        currency="USDC"
        approxValue="$191.54"
      />
      <ConnectWalletBtn
        text={connected ? "Swap" : "Connect Wallet"}
        onClick={handleOpenModal}
        marginTop="!mt-4 !mb-2" // Optional margin top if needed
      />
      <LimitOrderSummary
        headerText="Limit Order Summary"
        infoText="You will receive exactly what you have specified, minus platform fees."
        linkText="Learn more"
        linkUrl="#"
        orderDetails={orderDetails}
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
};

export default LimitComponent;
