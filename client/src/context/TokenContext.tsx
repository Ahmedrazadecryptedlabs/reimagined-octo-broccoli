"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Token } from "@/types";

interface TokenContextType {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  fetchTokens: () => void;
}
interface DebridgeContextType {
  isSkeletonVisible: boolean;
  setSkeletonVisible: (visible: boolean) => void;
  widgetZIndex: number;
  setWidgetZIndex: (zIndex: number) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
};

interface TokenProviderProps {
  children: React.ReactNode;
}

export const TokenProvider = ({ children }: TokenProviderProps) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const PAGE_SIZE = 50;

  const fetchTokens = async () => {
    if (hasFetched || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://token.jup.ag/all?page=1&limit=${PAGE_SIZE}`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const tokenList: Token[] = Array.isArray(data)
        ? data
        : Object.values(data);

      setTokens(tokenList);
      setHasFetched(true);
    } catch (error) {
      setError("Failed to fetch tokens.");
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchTokens();
    }
  }, [hasFetched]);

  return (
    <TokenContext.Provider value={{ tokens, loading, error, fetchTokens }}>
      {children}
    </TokenContext.Provider>
  );
};

