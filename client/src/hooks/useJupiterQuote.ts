import { useState, useCallback } from "react";
import { Token } from "@/types";
import { QuoteResponse } from "@jup-ag/api";
// import showToast from "@/lib/showToast";// Ensure correct import
import { FEE_CONFIG } from "@/constants";
import { createJupiterApiClient } from "@jup-ag/api";



const jupiterQuoteApi = createJupiterApiClient();
export const useJupiterQuote = () => {
    const [buyAmount, setBuyAmount] = useState<number | undefined>(undefined);
    const [quoteLoading, setQuoteLoading] = useState<boolean>(false);

    const getJupiterQuote = useCallback(

        async (fromToken: Token, toToken: Token, _sellAmount?: number, setLoading?: (loading: boolean) => void) => {
            setQuoteLoading(false)
            if (!_sellAmount || _sellAmount <= 0) {
                // showToast({ message: "Please enter a valid amount", type: "error" });
                setBuyAmount(0);
                return null;
            }

            if (fromToken.address === toToken.address) {
                // showToast({
                //     message: "Input and output tokens cannot be the same.",
                //     type: "error",
                // });
                setBuyAmount(0);
                return null;
            }

            try {
                setLoading?.(true); // Trigger loading state
                setQuoteLoading(true);

                const amount = Math.floor(_sellAmount * 10 ** fromToken.decimals);
                const data: QuoteResponse = await jupiterQuoteApi.quoteGet({
                    inputMint: fromToken.address,
                    outputMint: toToken.address,
                    amount,
                    slippageBps: 2500,
                    swapMode: "ExactIn",
                    platformFeeBps: FEE_CONFIG.platformFeeBps,
                });
                console.log("Api jit >>")
                if (data && data.outAmount) {
                    const _buyAmount = parseFloat(data.outAmount) / 10 ** toToken.decimals;
                    setBuyAmount(_buyAmount);
                    return data;
                } else {
                    setBuyAmount(0);
                    return null;
                }
            } catch (error) {
                // showToast({
                //     message: "Error fetching quote, please try again.",
                //     type: "error",
                // });
                console.error("Error fetching Jupiter quote:", error);
                return null;
            } finally {
                setLoading?.(false);
                setQuoteLoading(false);
            }
        },
        []
    );


    return { buyAmount, quoteLoading, setQuoteLoading, getJupiterQuote };

};
