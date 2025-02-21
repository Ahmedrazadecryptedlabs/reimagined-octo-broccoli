import { useState } from "react";
import { Search, Info } from "lucide-react";
import TokensModal from "@/components/Modal/TokensModal";

export default function TrendingTokensHeader() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-col">
                <div className="flex gap-1 self-start text-xl font-semibold">
                    <div className="relative flex">
                        <div className="text-white">Trending Tokens</div>
                        <div className="absolute -right-5 -top-1.5 z-10 rotate-[10deg] rounded-md bg-[#EE0909] px-1 text-xs font-semibold text-white">
                            BETA!
                        </div>
                    </div>
                </div>
                <span className="text-sm text-v2-lily/50">
                    <div className="">
                        <div className="flex items-center gap-1">
                            <div className="text-v2-lily-50">
                                Trending tokens derived using Organic Score
                            </div>
                            <Info className="text-v2-lily-50" size={12} />
                        </div>
                    </div>
                </span>
            </div>

            {/* Search Button */}
            <div className="gap-y-2 rounded-xl border border-[#17212C] bg-v3-background-perps-dark w-full md:w-[400px] text-v2-lily-50">
                <button
                    className="group flex w-full items-center justify-between p-4"
                    onClick={() => setModalOpen(true)} // Open Modal on Click
                >
                    <div className="flex min-w-0 flex-1 items-center">
                        <div className="flex h-full w-5 flex-shrink-0 items-center justify-center text-v2-lily/50">
                            <div className="flex items-center fill-current text-white/[0.15]">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 18 18"
                                    fill="inherit"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M7.30327 14.6058C8.75327 14.6074 10.1705 14.1746 11.3729 13.3637L15.5971 17.5871C16.1463 18.1371 17.0377 18.1371 17.5877 17.5871C18.1377 17.0371 18.1377 16.1457 17.5877 15.5964L13.3643 11.3722C14.5823 9.55661 14.9229 7.28943 14.2909 5.19563C13.6596 3.10183 12.1229 1.40183 10.1033 0.56283C8.08365 -0.276231 5.79385 -0.16607 3.86505 0.86283C1.93537 1.89251 0.569053 3.73243 0.140853 5.87683C-0.286487 8.02143 0.269759 10.2448 1.65725 11.9354C3.04397 13.6261 5.11665 14.6064 7.30325 14.6058H7.30327ZM7.30327 1.68943C8.79233 1.68865 10.2197 2.28005 11.2729 3.33319C12.3252 4.38631 12.9166 5.81359 12.9166 7.30279C12.9166 8.79199 12.3252 10.2192 11.2729 11.2724C10.2198 12.3247 8.79247 12.9162 7.30327 12.9162C5.81407 12.9162 4.38687 12.3247 3.33367 11.2724C2.28133 10.2193 1.68913 8.79199 1.68991 7.30279C1.69148 5.81451 2.28287 4.38719 3.33523 3.33479C4.38759 2.28239 5.81483 1.69103 7.30323 1.68947L7.30327 1.68943Z" fill="inherit"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3 truncate text-base text-v2-lily/30">
                            Search for tokens
                        </div>
                    </div>
                </button>
            </div>

            {/* Modal Component */}
            {modalOpen && (
                <TokensModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}
