"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlignHorizontalDistributeCenter, Clock } from "lucide-react";
import MiniTradingViewWidget from "../Charts/MiniTradingViewWidget";
import ConnectWalletSection from "../SpotSection/ConnectWalletSection";

interface TabsSectionProps {
    showChart: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabs: string[];
    setShowChart: (show: boolean) => void;
    showConnectWallet: boolean;
    setShowConnectWallet: (show: boolean) => void;
    renderTabContent: () => React.ReactNode;
    tabStates: any;
}

export default function TabsSection({
    showChart,
    activeTab,
    setActiveTab,
    tabs,
    setShowChart,
    showConnectWallet,
    setShowConnectWallet,
    renderTabContent,
    tabStates,
}: TabsSectionProps) {
    return (
        <motion.div
            initial={{ width: showChart ? "33%" : "35%", opacity: 0 }}
            animate={{ width: showChart ? "33%" : "35%", opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="tabs-section w-full space-y-3 order-1 lg:order-none"
        >
            <div className="flex md:flex-row items-center justify-between rounded-full w-full">
                <div
                    className={`flex items-center px-1 space-x-1 justify-evenly bg-[#192230] rounded-full py-1 ${showChart ? "w-full" : "w-full !mr-12"
                        }`}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                if (tab !== "Swap") {
                                    setShowChart(true);
                                }
                            }}
                            className={`w-full py-3 rounded-full text-sm font-bold transition-all ${activeTab === tab
                                ? "bg-primary/20 text-primary"
                                : "bg-transparent text-white hover:bg-primary/10 hover:text-gray-200"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "Swap" && (
                    <div className="flex items-center space-x-1 ml-2">
                        <motion.button
                            onClick={() => setShowChart(!showChart)}
                            className={`w-11 h-11 flex items-center justify-center rounded-full transition ${showChart
                                ? "bg-primary/10 text-cyan-400"
                                : "bg-primary-transparent text-white"
                                }`}
                        >
                            <AlignHorizontalDistributeCenter size={17} />
                        </motion.button>
                        <motion.button
                            onClick={() => setShowConnectWallet(!showConnectWallet)}
                            className={`w-11 h-11 flex items-center justify-center rounded-full transition ${showConnectWallet
                                ? "bg-primary/10 text-cyan-400"
                                : "bg-primary-transparent text-white"
                                }`}
                        >
                            <Clock size={19} />
                        </motion.button>
                    </div>
                )}
            </div>

            {showChart && (
                <div className="bg-gray-900 rounded-2xl order-2 overflow-hidden block md:hidden">
                    {/* <TradingViewChartCard
                baseToken={sellCurrency}
                quoteToken={buyCurrency}
              /> */}
                </div>
            )}

            {renderTabContent()}

            {!showChart && (
                <div className="order-5 lg:order-none">
                    <MiniTradingViewWidget />
                    <AnimatePresence>
                        {showConnectWallet && (
                            <motion.div
                                key="connect-wallet-static"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {(() => {
                                    const { tabs: _, ...rest } = tabStates[activeTab] || {};
                                    return (
                                        <ConnectWalletSection
                                            tabs={tabStates[activeTab]?.tabs || []}
                                            defaultActiveTab={
                                                tabStates[activeTab]?.tabs?.[0]?.id || ""
                                            }
                                            {...rest}
                                        />
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}
