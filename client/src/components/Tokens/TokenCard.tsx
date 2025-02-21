import React from 'react';
import Link from 'next/link';

// Token type definition
type Token = {
    address: string;
    icon: string;
    name: string;
    symbol: string;
    organicScore?: number;
    organicVolume: number;
    fdv: number;
    liquidity: number;
};

// Props for TrendingTokensList
interface TrendingTokensListProps {
    trendingTokens: Token[];
    formatNumber: (num: number) => string;
}

// Individual token card component
const TokenCard = ({ token, index, formatNumber }: { token: Token; index: number; formatNumber: (num: number) => string }) => {
    return (
        <Link href={`/tokens/${token.address}`} className="cursor-pointer rounded-lg border border-v2-lily/5 bg-[#151F29] hover:bg-v2-background-page">
            <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                    <span className="text-xs text-v2-lily/50">#{index + 1}</span>
                    <div className="overflow-hidden rounded-full bg-v2-lily/5">
                        <span className="relative">
                            <img
                                src={token.icon}
                                alt={token.name}
                                width="32"
                                height="32"
                                className="rounded-full object-cover"
                                style={{ maxWidth: '32px', maxHeight: '32px' }}
                            />
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold">{token.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{token.symbol}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-xs text-v2-lily/30">Organic Score</div>
                    <div className="text-v2-primary">{token.organicScore ? Math.round(token.organicScore) : '-'}</div>
                </div>
            </div>
            <div className="flex justify-between border-t border-v2-lily/5 bg-v2-background-page px-4 py-2">
                <TokenStat label="Organic Vol:" value={formatNumber(token.organicVolume)} />
                <TokenStat label="FDV:" value={formatNumber(token.fdv)} />
                <TokenStat label="Liq:" value={formatNumber(token.liquidity)} />
            </div>
        </Link>
    );
};

// Token statistics display component
const TokenStat = ({ label, value }: { label: string; value: string }) => (    
    <div className="flex gap-x-1 text-xs text-v2-lily/30">
        <div>{label}</div>
        <div>{value}</div>
    </div>
);

// Main trending tokens list component
const TrendingTokensList = ({ trendingTokens, formatNumber }: TrendingTokensListProps) => {
    return (
        <div className="mt-6 grid grid-cols-1 gap-4 md:hidden text-white">
            {trendingTokens.map((token, index) => (
                <TokenCard key={token.address} token={token} index={index} formatNumber={formatNumber} />
            ))}
        </div>
    );
};

export default TrendingTokensList;
