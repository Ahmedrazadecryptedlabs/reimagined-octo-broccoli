/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from 'react';




declare global {
  interface Window {
    deBridge?: any; // Declare deBridge as part of the window object
  }
}

export type SwapProps = {
  fromToken: { tokenName: string; address: string };
  toToken: { tokenName: string; address: string };
};
// @/types/index.ts (or wherever you defined `Token`)
export interface Token {
  address: string;
  decimals: number;
  symbol: string;
  name?: string;
  verified?: boolean;
  logoURI?: string;
  extraBadge?: string;
  isExternal?: boolean;
}



export interface TabConfig {
  /** Some tabs have headerTop, some do not—so make it optional. */
  headerTop?: boolean;
  /** Some tabs have showCancelAll, some do not—so also make it optional. */
  showCancelAll?: boolean;
  /** A string for your extra data (e.g., "swap-specific-data"). */
  additionalProp: string;
  /** An array of objects with an id and a label. */
  tabs: { id: string; label: string }[];
}

export type IconOption = {
  name: string;
  icon: string;
};

export type LoginProps = {
  magicToken: string;
  setMagicToken: Dispatch<SetStateAction<string>>;
};
export type Mint = {
  chainId: number;
  address: string;
  programId: string;
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  tags: string[];
  extensions: object;
};

export type PoolData = {
  type: string;
  programId: string;
  id: string;
  mintA: Mint;
  mintB: Mint;
  price: number;
  mintAmountA: number;
  mintAmountB: number;
  feeRate: number;
  openTime: string;
  tvl: number;
  day: object;
  week: object;
  month: object;
  pooltype: string[];
  rewardDefaultPoolInfos: string;
  rewardDefaultInfos: any[];
  farmUpcomingCount: number;
  farmOngoingCount: number;
  farmFinishedCount: number;
  marketId: string;
  lpMint: Mint;
  lpPrice: number;
  lpAmount: number;
  burnPercent: number;
};

export type GetPoolsInfoApiResponse = {
  id: string;
  success: boolean;
  data: Token[];
};

export type RaydiumSwapCompute = {
  id: string
  success: true
  version: 'V0' | 'V1'
  openTime?: undefined
  msg: undefined
  data: {
    swapType: 'BaseIn' | 'BaseOut'
    inputMint: string
    inputAmount: string
    outputMint: string
    outputAmount: string
    otherAmountThreshold: string
    slippageBps: number
    priceImpactPct: number
    routePlan: {
      poolId: string
      inputMint: string
      outputMint: string
      feeMint: string
      feeRate: number
      feeAmount: string
    }[]
  }
}


export interface Token {
  symbol: string;
  address: string;
  logoURI?: string;
}

export interface MarketData {
  marketCap: number | null;
  volume24h: number | null;
  liquidity: number | null;
}