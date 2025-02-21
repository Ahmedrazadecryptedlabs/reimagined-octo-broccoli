import { ArrowDownUp } from "lucide-react";

interface SwapButtonProps {
  onSwap: () => void;
}

const SwapButton = ({ onSwap }: SwapButtonProps) => {
  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#19232D]" />
      <div
        className="relative z-10 bg-[#1C2936] p-[6px] text-v2-lily-50 rotate-reload-btn rounded-full cursor-pointer border-[3px] border-[#131B24] hover:border-primary focus:border-primary hover:text-primary focus:text-primary transition-all"
        onClick={onSwap}
      >
        <ArrowDownUp className="text-inherit" size={13} />
      </div>
    </div>
  );
};

export default SwapButton;
