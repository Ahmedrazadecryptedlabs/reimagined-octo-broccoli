import { ExternalLink } from "lucide-react";

interface AddressPairProps {
  baseSym: string;
  quoteSym: string;
  baseShort: string;
  quoteShort: string;
}

export function AddressPair({
  baseSym,
  quoteSym,
  baseShort,
  quoteShort,
}: AddressPairProps) {
  return (
    <div className="hidden sm:flex flex-col items-center space-y-1 text-xs text-gray-400">
      <div className="flex items-center space-x-[6px]">
        <span className="text-xxs text-gray-200 font-semibold">{baseSym}</span>
        <span className="bg-[#0E141B] text-white px-[6px] py-[3px] text-xxs flex items-center rounded-sm">
          <span className="px-2">{baseShort}</span> <ExternalLink size={9} />
        </span>
      </div>
      <div className="flex items-center space-x-[6px]">
        <span className="text-xxs text-gray-200 font-semibold">{quoteSym}</span>
        <span className="bg-[#0E141B] text-white px-[6px] py-[3px] text-xxs flex items-center rounded-sm">
          <span className="px-1">{quoteShort}</span> <ExternalLink size={9} />
        </span>
      </div>
    </div>
  );
}
