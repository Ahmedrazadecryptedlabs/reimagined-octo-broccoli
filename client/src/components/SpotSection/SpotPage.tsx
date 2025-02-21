"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePoolContext } from "@/context/PoolContext";
import {
  DEFAULT_SELL_ADDRESS,
  DEFAULT_BUY_ADDRESS,
  FEE_CONFIG,
  APP_CONNECTION,
} from "@/constants";
import { Token } from "@/types";
import SwapComponent from "@/components/Swap/SwapComponent";
import LimitComponent from "../LimitOrder/LimitComponent";
import DCASection from "../DCAOrders/DCASection";
import VAComponent from "../ValueAccrualSection/VAComponent";
import { useJupiterQuote } from "@/hooks/useJupiterQuote";
import { useSwap } from "@/context/SwapContext";
import TokensModal from "../Modal/TokensModal";

import ChartSection from "../Charts/ChartSection";
import TabsSection from "../Tabs/TabsSection";
import { useDebounce } from "@/hooks/useDebounce";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useTokenSearch } from "@/hooks/useTokenSearch";
import { useJupiterSwapExecution } from "@/hooks/useJupiterSwapExecution";

const tabs = ["Swap", "Limit", "DCA", "VA"];

/** Type for each tab's config */
interface TabConfig {
  headerTop?: boolean;
  showCancelAll?: boolean;
  additionalProp: string;
  tabs: { id: string; label: string }[];
}

export default function SpotTradeSection() {
  const {
    connected,
    publicKey: connectedWalletPK,
    sendTransaction,
    signTransaction,
  } = useWallet();
  const { tokenList, tokenListLoading } = usePoolContext();

  const initialSellCurrency = tokenList.find(
    (token) => token.address === DEFAULT_SELL_ADDRESS
  );
  const initialBuyCurrency = tokenList.find(
    (token) => token.address === DEFAULT_BUY_ADDRESS
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"sell" | "buy">("sell");
  const [debouncedSellAmount, setDebouncedSellAmount] = useState<
    number | undefined
  >(undefined);

  // Instead of using the hook's quoteLoading, we create our own local loading state
  const { buyAmount, getJupiterQuote } = useJupiterQuote();
  const {
    sellCurrency,
    setSellCurrency,
    buyCurrency,
    setBuyCurrency,
    sellAmount,
    setSellAmount,
  } = useSwap();

  const [searchQuery, setSearchQuery] = useState("");
  const { debouncedSearchQuery, searching } = useDebouncedSearch(
    searchQuery,
    500
  );
  const { filteredTokenList } = useTokenSearch(debouncedSearchQuery, tokenList);

  const [activeTab, setActiveTab] = useState("Swap");
  const [showChart, setShowChart] = useState(true);
  const [showConnectWallet, setShowConnectWallet] = useState(true);

  // New local state to enforce minimum loading duration for the quote
  const [minQuoteLoading, setMinQuoteLoading] = useState(false);

  /**
   * 5) If token list is ready, set initial tokens
   */
  useEffect(() => {
    if (!tokenListLoading && tokenList.length > 0) {
      setSellCurrency(initialSellCurrency ?? null);
      setBuyCurrency(initialBuyCurrency ?? null);
    }
  }, [tokenList, tokenListLoading]);

  /**
   * 7) Debounce sellAmount
   */
  const debouncedSell = useDebounce(sellAmount, 500);
  useEffect(() => {
    if (sellAmount !== undefined && sellAmount > 0) {
      setDebouncedSellAmount(sellAmount);
    } else {
      setDebouncedSellAmount(undefined);
    }
  }, [sellAmount]);

  /**
   * 9) When debouncedSellAmount changes, fetch a Jupiter quote
   *     and enforce a minimum loading time of 500ms.
   */
  useEffect(() => {
    if (!sellCurrency || !buyCurrency || debouncedSellAmount === undefined) {
      return;
    }
    const fetchQuoteWithMinLoading = async () => {
      setMinQuoteLoading(true);
      const startTime = Date.now();
      await getJupiterQuote(sellCurrency, buyCurrency, debouncedSellAmount);
      const elapsed = Date.now() - startTime;
      const MIN_LOADING_DURATION = 500; // in milliseconds
      if (elapsed < MIN_LOADING_DURATION) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_LOADING_DURATION - elapsed)
        );
      }
      setMinQuoteLoading(false);
    };
    fetchQuoteWithMinLoading();
  }, [sellCurrency, buyCurrency, debouncedSellAmount]);

  /**
   * 14) Define tab states with index signature
   */
  const tabStates: { [key: string]: TabConfig } = {
    Swap: {
      showCancelAll: false,
      additionalProp: "swap-specific-data",
      tabs: [{ id: "default", label: "Default" }],
    },
    Limit: {
      headerTop: true,
      showCancelAll: true,
      additionalProp: "limit-specific-data",
      tabs: [
        { id: "openOrders", label: "Open Orders" },
        { id: "Order History", label: "Order History" },
      ],
    },
    DCA: {
      headerTop: true,
      showCancelAll: false,
      additionalProp: "dca-specific-data",
      tabs: [
        { id: "activeDCAs", label: "Active DCAs" },
        { id: "pastDCAs", label: "Past DCAs" },
      ],
    },
    VA: {
      headerTop: true,
      showCancelAll: true,
      additionalProp: "va-specific-data",
      tabs: [
        { id: "activeVAs", label: "Active VAs" },
        { id: "pastVAs", label: "Past VAs" },
      ],
    },
  };

  /**
   * 12) Use Jupiter swap execution hook
   */
  const { executeJupiterSwap, loadingSwap } = useJupiterSwapExecution(
    getJupiterQuote,
    connectedWalletPK,
    signTransaction,
    sendTransaction,
    sellCurrency,
    buyCurrency,
    sellAmount
  );

  /**
   * 12) Handle token selection from the modal
   */
  const handleTokenSelection = (token: Token) => {
    if (modalType === "sell") {
      setSellCurrency(token);
    } else if (modalType === "buy") {
      setBuyCurrency(token);
    }
    setModalOpen(false);
    setSearchQuery(""); // reset search
  };

  /**
   * 13) Render content for each tab
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case "Swap":
        return (
          <SwapComponent
            tokenListLoading={tokenListLoading}
            sellCurrency={sellCurrency}
            setSellCurrency={setSellCurrency}
            buyCurrency={buyCurrency}
            setBuyCurrency={setBuyCurrency}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            buyAmount={buyAmount}
            quoteLoading={minQuoteLoading}
            modalType={modalType}
            setModalType={setModalType}
            setModalOpen={setModalOpen}
            connected={connected}
            executeJupiterSwap={() => {}}
            loadingSwap={loadingSwap}
          />
        );
      case "Limit":
        return (
          <LimitComponent
            tokenListLoading={tokenListLoading}
            sellCurrency={sellCurrency}
            setSellCurrency={setSellCurrency}
            buyCurrency={buyCurrency}
            setBuyCurrency={setBuyCurrency}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            buyAmount={buyAmount}
            quoteLoading={minQuoteLoading}
            modalType={modalType}
            setModalType={setModalType}
            setModalOpen={setModalOpen}
            connected={connected}
            executeJupiterSwap={executeJupiterSwap}
            loadingSwap={loadingSwap}
          />
        );
      case "DCA":
        return (
          <DCASection
            tokenListLoading={tokenListLoading}
            sellCurrency={sellCurrency}
            setSellCurrency={setSellCurrency}
            buyCurrency={buyCurrency}
            setBuyCurrency={setBuyCurrency}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            buyAmount={buyAmount}
            quoteLoading={minQuoteLoading}
            modalType={modalType}
            setModalType={setModalType}
            setModalOpen={setModalOpen}
            connected={connected}
            executeJupiterSwap={executeJupiterSwap}
            loadingSwap={loadingSwap}
          />
        );
      case "VA":
        return (
          <VAComponent
            tokenListLoading={tokenListLoading}
            sellCurrency={sellCurrency}
            setSellCurrency={setSellCurrency}
            buyCurrency={buyCurrency}
            setBuyCurrency={setBuyCurrency}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            buyAmount={buyAmount}
            quoteLoading={minQuoteLoading}
            modalType={modalType}
            setModalType={setModalType}
            setModalOpen={setModalOpen}
            connected={connected}
            executeJupiterSwap={executeJupiterSwap}
            loadingSwap={loadingSwap}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-12 p-0 sm:p-4">
      <div className="flex flex-wrap justify-center lg:flex-nowrap w-full lg:w-2/3 gap-4 p-4 m-auto">
        {/* Chart Section with Animation */}
        <AnimatePresence>
          {showChart && (
            <ChartSection
              showChart={showChart}
              sellCurrency={sellCurrency}
              buyCurrency={buyCurrency}
              tabStates={tabStates}
              activeTab={activeTab}
              showConnectWallet={showConnectWallet}
            />
          )}
        </AnimatePresence>

        {/* Tabs Section */}
        <TabsSection
          showChart={showChart}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          setShowChart={setShowChart}
          showConnectWallet={showConnectWallet}
          setShowConnectWallet={setShowConnectWallet}
          renderTabContent={renderTabContent}
          tabStates={tabStates}
        />
      </div>

      {modalOpen && (
        <TokensModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onTokenSelect={handleTokenSelection}
        />
      )}
    </div>
  );
}
