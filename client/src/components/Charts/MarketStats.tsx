import { MarketData } from "@/types";

interface MarketStatsProps {
  marketData: MarketData;
}

export function MarketStats({ marketData }: MarketStatsProps) {
  return (
    <div className="flex items-center justify-end mt-3 space-x-5 text-sm text-gray-300">
      <div>
        <span className="text-[#41595A] font-semibold flex flex-col justify-start items-start text-xs">
          Mkt Cap
        </span>
        <span className="text-v2-lily-50 font-semibold text-gray-400">
          {marketData.marketCap
            ? `$${(marketData.marketCap / 1e9).toFixed(1)}B`
            : "Loading..."}
        </span>
      </div>
      <div>
        <span className="text-[#41595A] font-semibold flex flex-col justify-start items-start text-xs">
          24h Vol
        </span>
        <span className="text-v2-lily-50 font-semibold text-gray-400">
          {marketData.volume24h
            ? `$${(marketData.volume24h / 1e9).toFixed(1)}B`
            : "Loading..."}
        </span>
      </div>
      <div>
        <span className="text-[#41595A] font-semibold flex flex-col justify-start items-start text-xs">
          Liquidity
        </span>
        <span className="text-v2-lily-50 font-semibold text-gray-400">
          {marketData.liquidity
            ? `$${(marketData.liquidity / 1e9).toFixed(1)}B`
            : "Loading..."}
        </span>
      </div>
    </div>
  );
}
