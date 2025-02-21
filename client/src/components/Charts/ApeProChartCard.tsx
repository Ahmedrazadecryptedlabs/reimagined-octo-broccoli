import { fetchJupiterPrice, fetchMarketData, shortenAddress } from "@/utils";

interface TradingViewChartCardProps {
  baseToken?: {
    symbol?: string;
    address?: string;
    logoURI?: string;
  };
  quoteToken?: {
    symbol?: string;
    address?: string;
    logoURI?: string;
  };
}
import { useEffect, useState } from "react";
import { TokenPair } from "./TokenPair";
import { AddressPair } from "./AddressPair";
import { PriceDisplay } from "./PriceDisplay";
import { MarketStats } from "./MarketStats";
import { TradingViewChart } from "./TradingViewChart";
import { MarketData } from "@/types";
// import { DexscreenerChart } from "./TradingViewChart";
// import { DexscreenerChart } from "./TradingViewChart";

export default function TradingViewChartCard({
  baseToken,
  quoteToken,
}: TradingViewChartCardProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [marketData, setMarketData] = useState<MarketData>({
    marketCap: null,
    volume24h: null,
    liquidity: null,
  });
  const [baseSym, setBaseSym] = useState(baseToken?.symbol || "SOL");
  const [quoteSym, setQuoteSym] = useState(quoteToken?.symbol || "USDC");

  const baseAddr =
    baseToken?.address || "So11111111111111111111111111111111111111112";
  const quoteAddr =
    quoteToken?.address || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  const baseShort = shortenAddress(baseAddr);
  const quoteShort = shortenAddress(quoteAddr);

  const baseImg = baseToken?.logoURI || "/icons/sol.svg";
  const quoteImg = quoteToken?.logoURI || "/icons/usdc.svg";

  useEffect(() => {
    setBaseSym(baseToken?.symbol || "SOL");
    setQuoteSym(quoteToken?.symbol || "USDC");
  }, [baseToken, quoteToken]);

  useEffect(() => {
    if (!baseAddr || !quoteAddr) {
      setPrice(null);
      return;
    }
    async function doFetchPrice() {
      try {
        setLoadingPrice(true);
        const p = await fetchJupiterPrice(baseAddr, quoteAddr);

        if (typeof p === "number") {
          setPrice(p);
        } else {
          setPrice(null);
        }
      } catch (err) {
        console.error(err);
        setPrice(null);
      } finally {
        setLoadingPrice(false);
      }
    }
    doFetchPrice();
  }, [baseAddr, quoteAddr]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchMarketData(baseAddr, quoteAddr);
      setMarketData(data);
    }
    fetchData();
  }, [baseAddr, quoteAddr]);

  let priceDisplay = "Fetching Price...";
  if (loadingPrice) priceDisplay = "Loading...";
  else if (price !== null) priceDisplay = price.toFixed(3);
  else priceDisplay = "Price not available";

  const handleSwap = () => {
    setBaseSym(quoteSym);
    setQuoteSym(baseSym);
  };

  return (
    <div className="bg-[#131B24] rounded-2xl pt-1 text-white">
      <div
        className="px-4 py-1 flex items-center justify-between"
        style={{ borderBottom: "2px solid #1E272F" }}
      >
        <TokenPair
          baseSym={baseSym}
          quoteSym={quoteSym}
          baseImg={baseImg}
          quoteImg={quoteImg}
          onSwap={handleSwap}
        />
        <AddressPair
          baseSym={baseSym}
          quoteSym={quoteSym}
          baseShort={baseShort}
          quoteShort={quoteShort}
        />
      </div>

      <div className="px-4 py-1 flex items-center justify-between">
        <PriceDisplay priceDisplay={priceDisplay} quoteSym={quoteSym} />
        <MarketStats marketData={marketData} />
      </div>

      <TradingViewChart
        baseSym={baseSym}
        quoteSym={quoteSym}
        baseTokenAddress={
          baseToken?.address || "So11111111111111111111111111111111111111112"
        }
        quoteTokenAddress={
          quoteToken?.address || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        }
      />
    </div>
  );
}
