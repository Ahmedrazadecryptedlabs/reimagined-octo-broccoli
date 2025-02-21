"use client";
import React from "react";
import { motion } from "framer-motion";
import TradingViewChartCard from "../Charts/ApeProChartCard";
import ConnectWalletSection from "../SpotSection/ConnectWalletSection";
import { Clock } from "lucide-react";

interface ChartSectionProps {
    showChart: boolean;
    sellCurrency: any;
    buyCurrency: any;
    tabStates: any;
    activeTab: string;
    showConnectWallet: boolean;
}

export default function ChartSection({
    showChart,
    sellCurrency,
    buyCurrency,
    tabStates,
    activeTab,
    showConnectWallet,
}: ChartSectionProps) {
    return (
        <motion.div
            key="chart-section"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="chart-section w-full lg:w-[65%] order-2 lg:order-none"
        >
            <div className="bg-gray-900 rounded-2xl order-2 overflow-hidden hidden md:block">
                <TradingViewChartCard
                    baseToken={sellCurrency ?? undefined}
                    quoteToken={buyCurrency ?? undefined}
                />
            </div>

            {showConnectWallet && (
                <motion.div
                    key="connect-wallet"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="transition-opacity order-4 lg:order-none"
                >
                    {(() => {
                        const { tabs: _, ...rest } = tabStates[activeTab] || {};
                        return (
                            <ConnectWalletSection
                                tabs={tabStates[activeTab]?.tabs || []}
                                defaultActiveTab={tabStates[activeTab]?.tabs?.[0]?.id || ""}
                                {...rest}
                            />
                        );
                    })()}
                </motion.div>
            )}
        </motion.div>
    );
}
