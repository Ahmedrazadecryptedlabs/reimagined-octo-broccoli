import React from "react";
import Link from "next/link";

type Token = {
    address: string;
    name: string;
    symbol: string;
    icon: string;
    organicScore: number;
    organicVolume: number;
    fdv: number;
    liquidity: number;
};

type TokenTableProps = {
    trendingTokens: Token[];
    formatNumber: (num: number) => string;
};

const TokenTable = ({ trendingTokens, formatNumber }: TokenTableProps) => {

    return (
        <table className="min-w-full divide-y divide-gray-700 my-4 hidden md:table">
            <TableHeader />
            <tbody className="divide-y divide-v2-lily/5">
                {trendingTokens.map((token, index) => (
                    <TokenRow key={token.address} token={token} index={index} formatNumber={formatNumber} />
                ))}
            </tbody>
        </table>
    );
};

const TableHeader = () => (

    <thead className="!mt-12 whitespace-nowrap rounded-lg bg-v2-background-page text-right text-xs text-v2-lily/30">
        <tr>
            <th className="px-4 py-3 text-left first:rounded-l-lg">#</th>
            <th className="px-4 py-3 text-left">Token</th>
            <th className="px-4 py-3">Organic Score</th>
            <th className="px-4 py-3">Organic Volume</th>
            <th className="px-4 py-3">FDV</th>
            <th className="px-4 py-3 last:rounded-r-lg">Liquidity</th>
        </tr>
    </thead>
);

const TokenRow = ({ token, index, formatNumber }: { token: Token; index: number; formatNumber: (num: number) => string }) => (

    <tr className="group h-[76px] cursor-pointer text-white border-b border-v2-lily/5 text-right hover:bg-v2-background-page">
        <td className="px-4 text-left group-hover:first:rounded-l-lg">
            <Link href={`/tokens/${token.address}`}>{index + 1}</Link>
        </td>
        <td>
            <Link href={`/tokens/${token.address}`}>
                <TokenInfo token={token} />
            </Link>
        </td>
        <td>
            <Link href={`/tokens/${token.address}`}>
                <div className="flex w-full items-center justify-end p-4 text-sm text-v2-primary">
                    {token.organicScore ? Math.round(token.organicScore) : "-"}
                </div>
            </Link>
        </td>
        <td>
            <Link href={`/tokens/${token.address}`}>
                <div className="flex w-full items-center justify-end p-4">
                    {formatNumber(token.organicVolume)}
                </div>
            </Link>
        </td>
        <td>
            <Link href={`/tokens/${token.address}`}>
                <div className="flex w-full items-center justify-end p-4">
                    {formatNumber(token.fdv)}
                </div>
            </Link>
        </td>
        <td>
            <Link href={`/tokens/${token.address}`}>
                <div className="flex w-full items-center justify-end p-4 group-hover:rounded-r-2xl">
                    {formatNumber(token.liquidity)}
                </div>
            </Link>
        </td>
    </tr>
);

const TokenInfo = ({ token }: { token: Token }) => (

    <div className="flex h-full w-full items-center gap-4 p-4 text-left">
        <div className="overflow-hidden rounded-full bg-v2-lily/5">
            <span className="relative">
                <img
                    src={token.icon}
                    alt={token.name}
                    width="32"
                    height="32"
                    className="rounded-full object-cover"
                    style={{ maxWidth: "32px", maxHeight: "32px" }}
                />
            </span>
        </div>
        <div className="flex flex-col">
            <div className="flex items-center gap-1">
                <span className="font-semibold">{token.name}</span>
            </div>
            <span className="text-sm text-gray-400">{token.symbol}</span>
        </div>
    </div>
);

export default TokenTable;