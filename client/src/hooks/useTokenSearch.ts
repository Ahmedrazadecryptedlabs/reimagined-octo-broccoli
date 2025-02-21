"use client";
import { useState, useEffect } from "react";
import { Token } from "@/types";

function isValidSolanaAddress(address: any) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function useTokenSearch(debouncedSearchQuery: string, tokenList: Token[]) {
  const [filteredTokenList, setFilteredTokenList] = useState<Token[]>([]);

  const fetchTokenFromAPI = async (query: string) => {
    try {
      const response = await fetch(`https://tokens.jup.ag/token/${query}`);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const tokenData = await response.json();
      if (tokenData && tokenData.address) {
        const simplifiedTokenData = {
          address: tokenData.address,
          decimals: tokenData.decimals,
          logoURI: tokenData.logoURI,
          symbol: tokenData.symbol,
          isExternal: true,
        };

        if (typeof window !== "undefined") {
          const before_storedTokens = JSON.parse(
            window.localStorage.getItem("externalTokens") || "[]"
          );
          if (
            !before_storedTokens.some(
              (token: any) => token.address === simplifiedTokenData.address
            )
          ) {
            before_storedTokens.push(simplifiedTokenData);
            window.localStorage.setItem(
              "externalTokens",
              JSON.stringify(before_storedTokens)
            );
          }
        }
      } else {
        // showToast({ message: "Token not found on external API.", type: "error" });
      }

      if (typeof window !== "undefined") {
        const localTokens = JSON.parse(
          window.localStorage.getItem("externalTokens") || "[]"
        );
        const combinedTokenList = [...localTokens, ...tokenList];
        const filteredTokens = combinedTokenList.filter(
          (token: Token) =>
            token.address
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ||
            token.symbol
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
        );
        setFilteredTokenList(filteredTokens);
      }
    } catch (error) {
      console.error("Error fetching token from external API:", error);
      // showToast({ message: `Failed to fetch token: ${error}`, type: "error" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localTokens = JSON.parse(
        window.localStorage.getItem("externalTokens") || "[]"
      );
      const combinedTokenList = [...localTokens, ...tokenList];
      const filteredTokens = combinedTokenList.filter(
        (token: Token) =>
          token.address
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          token.symbol
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredTokenList(filteredTokens);

      // If no match, and user typed something
      if (filteredTokens.length === 0 && debouncedSearchQuery) {
        if (isValidSolanaAddress(debouncedSearchQuery)) {
          fetchTokenFromAPI(debouncedSearchQuery);
        } else {
          // showToast({ message: "Invalid token address. Please check your input.", type: "error" });
        }
      }
    }
  }, [debouncedSearchQuery, tokenList]);

  return { filteredTokenList };
}
