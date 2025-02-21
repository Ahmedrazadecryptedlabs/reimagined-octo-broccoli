import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useTokenContext } from "@/context/TokenContext";
import { FixedSizeList as List } from "react-window";
import { Token } from "@/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSelect?: (selectedToken: Token) => void;
}

const TokensModal = ({ isOpen, onClose, onTokenSelect }: ModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tokens, loading, error, fetchTokens } = useTokenContext(); // Access the context

  const handleSearch = useCallback(
    (query: string) => {
      if (!query) {
        return tokens;
      }

      const lowerQ = query.toLowerCase();
      return tokens.filter(
        (t) =>
          t.symbol.toLowerCase().includes(lowerQ) ||
          (t.name || "").toLowerCase().includes(lowerQ) ||
          t.address.toLowerCase().includes(lowerQ)
      );
    },
    [tokens]
  );

  const filteredTokens = handleSearch(searchQuery);

  useEffect(() => {
    if (isOpen && tokens.length === 0) {
      fetchTokens();
    }
  }, [isOpen, tokens, fetchTokens]);

  const loadMoreTokens = () => {
    // Implement load more logic if needed, like pagination
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-[450px] h-auto max-h-[85%] bg-[#304256] text-white mt-4 flex flex-col rounded-md shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
              size={14}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search tokens"
              className="w-full bg-[#304256] border border-gray-700 rounded-lg py-2 pl-8 pr-3 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>
          <button
            className="ml-4 text-gray-400 hover:text-gray-200 text-xs px-[7px] py-[6px] rounded transition bg-[#1A2530]"
            onClick={onClose}
          >
            Esc
          </button>
        </div>

        {error && <p className="text-center text-red-400 py-2">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-400 py-4">Fetching tokens...</p>
        ) : (
          <div className="flex-1 ">
            {filteredTokens.length > 0 ? (
              <List
                height={800}
                itemCount={filteredTokens.length}
                itemSize={50}
                width="100%"
                onItemsRendered={({
                  visibleStopIndex,
                }: {
                  visibleStopIndex: number;
                }) => {
                  if (visibleStopIndex === filteredTokens.length - 1) {
                    loadMoreTokens();
                  }
                }}
              >
                {({
                  index,
                  style,
                }: {
                  index: number;
                  style: React.CSSProperties;
                }) => {
                  const token = filteredTokens[index];
                  return (
                    <button
                      key={token.address}
                      onClick={() => {
                        onTokenSelect?.(token);
                        onClose();
                      }}
                      className="w-full flex items-center hover:bg-[#435467] rounded-lg h-12 py-2 px-3 text-left transition"
                      style={style}
                    >
                      <img
                        className="w-6 h-6 rounded-full mx-2"
                        src={token.logoURI || "/default.png"}
                        alt={token.symbol}
                      />
                      <div className="flex-1 flex flex-col mx-1">
                        <span className="text-sm font-bold flex items-center">
                          <span className="mr-2">{token.symbol}</span>
                        </span>
                        <span className="text-xs text-gray-300">
                          {token.name}
                        </span>
                      </div>
                    </button>
                  );
                }}
              </List>
            ) : (
              <p className="text-center text-gray-400 mt-4">
                No tokens found for "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokensModal;
