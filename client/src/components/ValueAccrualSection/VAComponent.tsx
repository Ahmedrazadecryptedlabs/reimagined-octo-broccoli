import React, { useState } from "react";
import TokenInputSection from "../Inputs/TokenInputSection";
import SwapButton from "@/components/Buttons/SwapButton";
import LimitOrderSummary from "../LimitOrder/LimitOrderSummary";
import TokenInputDropdown from "../Dropdowns/TokenInputDropdown";
import PortfolioIncreaseInput from "./PortfolioIncreaseInput";
import AutoReceiveToggle from "./AutoReceiveToggle";
import Orderdate from "./OrderDate";
import { ConnectWalletBtn } from "../Buttons/ConnectWalletBtn";
import WalletModal from "../WalletModal/WalletConnectModal";

interface VAComponentProps {
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

const VAComponent = ({
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
}: VAComponentProps) => {
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const handleOpenModal = () => {
    setWalletModalOpen(true);
  };

  const vaDetails = [
    { label: "Max budget", value: "100 USDC" },
    { label: "To buy", value: "SOL" },
    { label: "To increase portfolio value by", value: "50 USD" },
    { label: "Every", value: "1 day" },
    { label: "Start date", value: "13, Jan 2025, 4:44 PM" },
    { label: "Platform fee", value: "0.1%" },
  ];

  return (
    <div className="space-y-[5px]">
      {/* Selling Token Input */}
      <TokenInputSection
        label="I Have A Max Budget Of"
        tokenListLoading={tokenListLoading}
        selectedToken={sellCurrency}
        amount={sellAmount}
        onAmountChange={setSellAmount}
        onSelectToken={setSellCurrency}
        quoteLoading={quoteLoading}
        modalType="sell"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        showAmountSpan={true} // Ensure this is true
      />

      {/* Swap Button */}
      <SwapButton
        onSwap={() => {
          const tempCurrency = sellCurrency;
          setSellCurrency(buyCurrency);
          setBuyCurrency(tempCurrency);
          setSellAmount(buyAmount);
        }}
      />

      {/* Buying Token Input */}
      <TokenInputDropdown
        label="To Buy"
        tokenListLoading={tokenListLoading}
        selectedToken={buyCurrency}
        modalType="buy"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
      />

      <PortfolioIncreaseInput />

      {/* Rate and Expiry Section */}
      <Orderdate rate="1.23456" currency="BTC" approxValue="$1234.56" />

      <AutoReceiveToggle />
      {/* Action Button */}
      <ConnectWalletBtn
        text={connected ? "Swap" : "Connect Wallet"}
        onClick={handleOpenModal}
        marginTop="!mt-4 !mb-2" // Optional margin top if needed
      />

      {/* VA Summary */}
      <LimitOrderSummary
        headerText="VA Summary"
        linkText="Learn more"
        linkUrl="#"
        orderDetails={vaDetails}
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
};

export default VAComponent;
