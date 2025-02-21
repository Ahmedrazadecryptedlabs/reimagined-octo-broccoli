interface PriceDisplayProps {
  priceDisplay: string;
  quoteSym: string;
}

export function PriceDisplay({ priceDisplay, quoteSym }: PriceDisplayProps) {
  return (
    <div className="text-md font-bold flex flex-col space-y-3 justify-start items-start">
      {priceDisplay} {quoteSym}
      <span className="text-xs text-green-500">+6.89%</span>
    </div>
  );
}
