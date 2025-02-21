import { useEffect, useState } from "react";

interface TradingViewChartProps {
  baseSym: string;
  quoteSym: string;
  baseTokenAddress: string;
  quoteTokenAddress: string;
}

export function TradingViewChart({
  baseSym,
  quoteSym,
  baseTokenAddress,
  quoteTokenAddress,
}: TradingViewChartProps) {
  const [candleData, setCandleData] = useState<any>(null);
  const [validSymbols, setValidSymbols] = useState<{
    base: string;
    quote: string;
  }>({
    base: baseSym,
    quote: quoteSym,
  });

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        const response = await fetch(
          `https://fe-api.jup.ag/api/v1/charts/${baseTokenAddress}?quote_address=${quoteTokenAddress}&type=15m&time_from=1739685349&time_to=1739955349`
        );
        const data = await response.json();
        console.log("🚀 ~ fetchCandleData ~ data:", data);

        if (!data || Object.keys(data).length === 0) {
          console.warn("Invalid token pair, defaulting to SOL/USD");
          setValidSymbols({ base: "SOL", quote: "USD" });
        } else {
          setValidSymbols({ base: baseSym, quote: quoteSym });
        }

        setCandleData(data);
      } catch (error) {
        console.error("Error fetching candle data", error);
        setValidSymbols({ base: "SOL", quote: "USD" });
      }
    };

    fetchCandleData();
  }, [baseTokenAddress, quoteTokenAddress]);

  const tradingViewUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b51c4&symbol=${validSymbols.base}${validSymbols.quote}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=dark&studies=%5B%5D&theme=dark&style=1&timezone=exchange`;

  return (
    <div className="rounded-xl overflow-hidden w-full">
      <iframe
        title="TradingView Chart"
        src={tradingViewUrl}
        frameBorder="0"
        className="w-full !border-none"
        style={{ height: "385px", minHeight: "300px" }}
      />
    </div>
  );
}
