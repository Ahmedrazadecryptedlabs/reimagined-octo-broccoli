import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePoolContext } from "@/context/PoolContext";
import { useJupiterQuote } from "@/hooks/useJupiterQuote";
import { useSwap } from "@/context/SwapContext";
import {
  DEFAULT_SELL_ADDRESS,
  DEFAULT_BUY_ADDRESS,
  FEE_CONFIG,
  APP_CONNECTION,
} from "@/constants";
import { createJupiterApiClient, SwapResponse } from "@jup-ag/api";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { Token } from "@/types";
import { useDebounce } from "./useDebounce";

export const useSpotTrade = () => {
  // Wallet and context
  const { connected, publicKey: connectedWalletPK, sendTransaction, signTransaction } = useWallet();
  const { tokenList, tokenListLoading } = usePoolContext();
  const { buyAmount, quoteLoading, getJupiterQuote } = useJupiterQuote();
  const { sellCurrency, setSellCurrency, buyCurrency, setBuyCurrency, sellAmount, setSellAmount } = useSwap();

  // Find initial tokens
  const initialSellCurrency = tokenList.find(
    (token) => token.address === DEFAULT_SELL_ADDRESS
  );
  const initialBuyCurrency = tokenList.find(
    (token) => token.address === DEFAULT_BUY_ADDRESS
  );

  // Local state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"sell" | "buy">("sell");
  const [debouncedSellAmount, setDebouncedSellAmount] = useState<number | undefined>(undefined);
  const [loadingSwap, setLoadingSwap] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filteredTokenList, setFilteredTokenList] = useState<Token[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("Swap");
  const [showChart, setShowChart] = useState(true);
  const [showConnectWallet, setShowConnectWallet] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Jupiter client
  const jupiterQuoteApi = createJupiterApiClient();

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
  useEffect(() => {
    const handler = setTimeout(() => {
      if (sellAmount !== undefined && sellAmount > 0) {
        setDebouncedSellAmount(sellAmount);
      } else {
        setDebouncedSellAmount(undefined);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [sellAmount]);

  /**
   * 8) Debounce searchQuery (for showing searching state)
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearching(false);
    }, 500);
    setSearching(true);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  /**
   * 9) When debouncedSellAmount changes, fetch a Jupiter quote
   */
  useEffect(() => {
    if (!sellCurrency || !buyCurrency || debouncedSellAmount === undefined) {
      return;
    }
    getJupiterQuote(sellCurrency, buyCurrency, debouncedSellAmount);
  }, [sellCurrency, buyCurrency, debouncedSellAmount]);

  /**
   * 11) Filter tokens based on search, with localStorage guarded
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localTokens = JSON.parse(
        window.localStorage.getItem("externalTokens") || "[]"
      );
      const combinedTokenList = [...localTokens, ...tokenList];
      const filteredTokens = combinedTokenList.filter((token) =>
        token.address.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredTokenList(filteredTokens);

      // If no match, and user typed something
      if (filteredTokens.length === 0 && debouncedSearchQuery) {
        if (isValidSolanaAddress(debouncedSearchQuery)) {
          fetchTokenFromAPI(debouncedSearchQuery);
        } else {
          // Optionally notify the user about an invalid token address.
        }
      }
    }
  }, [debouncedSearchQuery, tokenList]);

  /**
   * 2) Execute Jupiter Swap
   */
  const executeJupiterSwap = async () => {
    if (!connectedWalletPK || !signTransaction || !sendTransaction) {
      // Optionally show an error message here
      return;
    }
    try {
      setLoadingSwap(true);

      const quoteResponse = await getJupiterQuote(
        sellCurrency!,
        buyCurrency!,
        sellAmount
      );
      if (!quoteResponse) throw new Error("Could not get quote from Jupiter");

      const blockhash = await APP_CONNECTION.getLatestBlockhash("confirmed");
      const referralAccountPubkey = new PublicKey(
        FEE_CONFIG.feeAccountReferralPublicKey
      );
      const mint = new PublicKey(buyCurrency!.address);
      const [feeAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referral_ata"),
          referralAccountPubkey.toBuffer(),
          mint.toBuffer(),
        ],
        new PublicKey(FEE_CONFIG.jupiterReferralProgram)
      );

      const swapObj: SwapResponse = await jupiterQuoteApi.swapPost({
        swapRequest: {
          quoteResponse,
          userPublicKey: connectedWalletPK.toBase58(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: "auto",
          feeAccount: feeAccount.toBase58(),
        },
      });

      const transactionFromSwap = VersionedTransaction.deserialize(
        Buffer.from(swapObj.swapTransaction, "base64")
      );
      transactionFromSwap.message.recentBlockhash = blockhash.blockhash;

      const signedTransaction = await signTransaction(transactionFromSwap);
      const RAW_TX = signedTransaction.serialize();

      const signature = await APP_CONNECTION.sendRawTransaction(RAW_TX);
      console.log(`Transaction sent: https://solana.fm/tx/${signature}`);

      await APP_CONNECTION.confirmTransaction(signature, "confirmed");
    } catch (error) {
      handleJupiterSwapError(error);
    } finally {
      setLoadingSwap(false);
    }
  };

  /**
   * 3) Handle swap error
   */
  const handleJupiterSwapError = (error: any) => {
    if (error.message?.includes("User rejected the request")) {
      // Transaction rejected by user.
    } else if (error.message?.includes("Attempt to debit an account")) {
      // Simulation failed: insufficient credits.
    } else if (error.logs) {
      const logs = error.logs.join("\n");
      // Optionally notify the user with logs.
    } else {
      // Optionally notify the user about an unexpected error.
    }
    console.error("Error executing Jupiter swap:", error);
  };

  /**
   * 4) Validate Solana Address
   */
  const isValidSolanaAddress = (address: any) => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  /**
   * 6) Fetch token from external API, with localStorage guarded
   */
  const fetchTokenFromAPI = async (query: any) => {
    try {
      const response = await fetch(`https://tokens.jup.ag/token/${query}`);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const tokenData = await response.json();
      if (tokenData && tokenData.address) {
        const simplifiedTokenData = {
          address: tokenData.address,
          decimals: tokenData.decimals,
          logoURI: tokenData.logoURI,
          symbol: tokenData.symbol,
          isExternal: true,
        };

        if (typeof window !== "undefined") {
          const before_storedTokens = JSON.parse(
            window.localStorage.getItem("externalTokens") || "[]"
          );
          if (
            !before_storedTokens.some(
              (token: any) => token.address === simplifiedTokenData.address
            )
          ) {
            before_storedTokens.push(simplifiedTokenData);
            window.localStorage.setItem(
              "externalTokens",
              JSON.stringify(before_storedTokens)
            );
          }
        }
      }

      if (typeof window !== "undefined") {
        const localTokens = JSON.parse(
          window.localStorage.getItem("externalTokens") || "[]"
        );
        const combinedTokenList = [...localTokens, ...tokenList];
        const filteredTokens = combinedTokenList.filter(
          (token) =>
            token.address.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            token.symbol.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
        setFilteredTokenList(filteredTokens);
      }
    } catch (error) {
      console.error("Error fetching token from external API:", error);
    }
  };

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
    setSearchQuery("");
  };

  return {
    connected,
    tokenListLoading,
    sellCurrency,
    setSellCurrency,
    buyCurrency,
    setBuyCurrency,
    sellAmount,
    setSellAmount,
    buyAmount,
    quoteLoading,
    modalOpen,
    setModalOpen,
    modalType,
    setModalType,
    loadingSwap,
    searchQuery,
    setSearchQuery,
    filteredTokenList,
    searching,
    activeTab,
    setActiveTab,
    showChart,
    setShowChart,
    showConnectWallet,
    setShowConnectWallet,
    executeJupiterSwap,
    handleTokenSelection,
  };
};
