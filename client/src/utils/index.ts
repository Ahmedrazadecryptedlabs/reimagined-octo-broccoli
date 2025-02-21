import axios from 'axios';
import { GetPoolsInfoApiResponse, Token } from '../types';
import { Dispatch, SetStateAction } from 'react';
import { Magic } from '../context/MagicProvider';
import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SystemProgram } from '@solana/web3.js';
import { TransactionInstruction } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';
import { Transaction } from '@solana/web3.js';
import { APP_CONNECTION } from '../constants';
const BASE_API_URL = 'https://api-v3.raydium.io/';

export const getPoolsInfo = async (ids: string): Promise<Token[]> => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}pools/info/ids?ids=${encodeURIComponent(ids)}`,
      {
        headers: {
          accept: 'application/json',
        },
      }
    );
    const poolData = response?.data?.data || [];
    const allTokenList: Token[] = [];

    poolData.forEach((pool: { mintA: { address: any; symbol: any; decimals: any; logoURI: any; }; mintB: { address: any; symbol: any; decimals: any; logoURI: any; }; }) => {
      allTokenList.push({
        address: pool.mintA.address,
        symbol: pool.mintA.symbol,
        decimals: pool.mintA.decimals,
        logoURI: pool.mintA.logoURI,
        isExternal: false,
      });
      allTokenList.push({
        address: pool.mintB.address,
        symbol: pool.mintB.symbol,
        decimals: pool.mintB.decimals,
        logoURI: pool.mintB.logoURI,
        isExternal: false,
      });
    });

    const uniqueTokens = allTokenList.filter(
      (token, index, self) =>
        index === self.findIndex((t) => t.address === token.address)
    );

    return uniqueTokens; // Ensure uniqueTokens is returned
  } catch (error) {
    console.error("Error in getPoolsInfo:", error);
    return [];
  }
};


export type LoginMethod = 'EMAIL' | 'SMS' | 'SOCIAL' | 'FORM';

export const logout = async (setMagicToken: Dispatch<SetStateAction<string>>, magic: Magic | null) => {
  if (await magic?.user.isLoggedIn()) {
    await magic?.user.logout();
  }
  localStorage.setItem('magic_token', '');
  setMagicToken('');
};

export const saveToken = (token: string, setMagicToken: Dispatch<SetStateAction<string>>, loginMethod: LoginMethod) => {
  localStorage.setItem('magic_token', token);
  setMagicToken(token);
  localStorage.setItem('isAuthLoading', 'false');
  localStorage.setItem('loginMethod', loginMethod);
};


export async function getBlockhashFromBlockNumber(blockNumber: number): Promise<{
  blockhash: string;
  lastValidBlockHeight: number;
}> {
  try {
    const block = await APP_CONNECTION.getBlock(blockNumber, {
      maxSupportedTransactionVersion: 0, // Ensure compatibility with older transactions
    });

    if (block && block.blockhash) {
      return {
        blockhash: block.blockhash,
        lastValidBlockHeight: blockNumber
      }
    } else {
      throw new Error(`Block data not found for block number ${blockNumber}`);
    }
  } catch (error) {
    console.error(`Error fetching blockhash for block number ${blockNumber}:`, error);
    throw error;
  }
}



export function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 4) + "..." + address.slice(-5);
}

export async function fetchJupiterPrice(baseMint: string, quoteMint: string) {
  const url = `https://fe-api.jup.ag/api/v1/prices?list_address=${baseMint},${quoteMint}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch Jupiter price: ${res.statusText}`);
  }
  const json = await res.json();

  const price = json?.prices[baseMint];
  if (price !== undefined) {
    return price;
  } else {
    throw new Error("Price not found for the given addresses");
  }
}

export async function fetchMarketData(baseAddr: string, quoteAddr: string) {
  try {
    const url = `https://fe-api.jup.ag/api/v1/tokens/${baseAddr}?quote_address=${quoteAddr}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch market data: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("🚀 ~ fetchMarketData ~ data:", data)

    return {
      marketCap: data.mcap,
      volume24h: data.volume24h,
      liquidity: data.liquidity,
    };
  } catch (error) {
    console.error("Error fetching market data:", error);
    return { marketCap: null, volume24h: null, liquidity: null };
  }
}
