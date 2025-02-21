"use client";
import { useState, useEffect } from "react";

export function useDebouncedSearch(initialValue: string, delay: number) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialValue);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setSearching(false);
    }, delay);
    return () => clearTimeout(handler);
  }, [searchQuery, delay]);

  return { searchQuery, setSearchQuery, debouncedSearchQuery, searching };
}
