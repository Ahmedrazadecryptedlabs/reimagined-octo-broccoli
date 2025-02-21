"use client";
import { useState } from "react";
import { createJupiterApiClient, SwapResponse } from "@jup-ag/api";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { APP_CONNECTION, FEE_CONFIG } from "@/constants";

export function useJupiterSwapExecution(
    getJupiterQuote: any,
    connectedWalletPK: any,
    signTransaction: any,
    sendTransaction: any,
    sellCurrency: any,
    buyCurrency: any,
    sellAmount: number | undefined
) {
    const [loadingSwap, setLoadingSwap] = useState<boolean>(false);
    const jupiterQuoteApi = createJupiterApiClient();

    const executeJupiterSwap = async () => {
        if (!connectedWalletPK || !signTransaction || !sendTransaction) {
            // showToast({ message: "Please connect your wallet.", type: "error" });
            return;
        }
        try {
            setLoadingSwap(true);
            const quoteResponse = await getJupiterQuote(
                sellCurrency,
                buyCurrency,
                sellAmount
            );
            if (!quoteResponse) throw new Error("Could not get quote from Jupiter");

            const blockhash = await APP_CONNECTION.getLatestBlockhash("confirmed");
            const referralAccountPubkey = new PublicKey(
                FEE_CONFIG.feeAccountReferralPublicKey
            );
            const mint = new PublicKey(buyCurrency.address);
            const [feeAccount] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("referral_ata"),
                    referralAccountPubkey.toBuffer(),
                    mint.toBuffer(),
                ],
                new PublicKey(FEE_CONFIG.jupiterReferralProgram)
            );

            const swapObj: SwapResponse = await jupiterQuoteApi.swapPost({
                swapRequest: {
                    quoteResponse,
                    userPublicKey: connectedWalletPK.toBase58(),
                    wrapAndUnwrapSol: true,
                    dynamicComputeUnitLimit: true,
                    prioritizationFeeLamports: "auto",
                    feeAccount: feeAccount.toBase58(),
                },
            });

            const transactionFromSwap = VersionedTransaction.deserialize(
                Buffer.from(swapObj.swapTransaction, "base64")
            );
            transactionFromSwap.message.recentBlockhash = blockhash.blockhash;

            const signedTransaction = await signTransaction(transactionFromSwap);
            const RAW_TX = signedTransaction.serialize();

            const signature = await APP_CONNECTION.sendRawTransaction(RAW_TX);
            // showToast({
            //   message: `Swap Transaction Sent. Please wait for confirmation.`,
            //   type: "info",
            // });
            console.log(`Transaction sent: https://solana.fm/tx/${signature}`);

            await APP_CONNECTION.confirmTransaction(signature, "confirmed");
            // showToast({
            //   message: `Swap successful! Transaction: ${signature}`,
            //   type: "success",
            // });
        } catch (error) {
            handleJupiterSwapError(error);
        } finally {
            setLoadingSwap(false);
        }
    };

    const handleJupiterSwapError = (error: any) => {
        if (error.message?.includes("User rejected the request")) {
            // showToast({
            //   message: "Transaction rejected by user. Please try again.",
            //   type: "error",
            // });
        } else if (error.message?.includes("Attempt to debit an account")) {
            // showToast({
            //   message:
            //     "Simulation failed: Attempt to debit an account but found no record of a prior credit. Please check your wallet balance or retry.",
            //   type: "error",
            // });
        } else if (error.logs) {
            const logs = error.logs.join("\n");
            // showToast({
            //   message: `Simulation failed with logs: ${logs}`,
            //   type: "error",
            // });
        } else {
            // showToast({
            //   message: `An unexpected error occurred: ${error.message}`,
            //   type: "error",
            // });
        }
        console.error("Error executing Jupiter swap:", error);
    };

    return { executeJupiterSwap, loadingSwap };
}
