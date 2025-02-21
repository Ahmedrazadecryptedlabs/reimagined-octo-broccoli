import { ArrowRightLeft } from "lucide-react";

interface TokenPairProps {
  baseSym: string;
  quoteSym: string;
  baseImg: string;
  quoteImg: string;
  onSwap: () => void;
}

export function TokenPair({
  baseSym,
  quoteSym,
  baseImg,
  quoteImg,
  onSwap,
}: TokenPairProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex items-center">
        <img
          src={baseImg}
          alt={baseSym}
          className="w-7 h-7 rounded-full border-2 border-[#192230] mr-[-8px]"
        />
        <img
          src={quoteImg}
          alt={quoteSym}
          className="w-7 h-7 rounded-full border-2 border-[#192230]"
        />
      </div>
      <span className="font-semibold text-md">
        {baseSym} <span className="text-[#535E66]">/</span> {quoteSym}
      </span>
      <span className="text-sm">
        <ArrowRightLeft onClick={onSwap} className="text-[#535E66]" size={12} />
      </span>
    </div>
  );
}
