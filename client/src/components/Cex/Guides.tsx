import { GuideButton } from "./GuideButton";

export const Guides = () => {
    const guides = [
        {
            name: "BINANCE",
            url: "/images/binance_cex.svg",
            link: "https://www.binance.com/en/support/faq/how-to-withdraw-crypto-from-binance-115003670492",
        },
        {
            name: "coinbase",
            url: "/images/coinbase_cex.svg",
            link: "https://help.coinbase.com/en-gb/coinbase/trading-and-funding/buying-selling-or-converting-crypto/how-do-i-sell-or-cash-out-my-digital-currency",
        },
        {
            name: "BYBIT",
            url: "/images/bybit.svg",
            link: "https://www.bybit.com/en/help-center/article/How-to-submit-on-chain-withdrawal-request",
        },
        {
            name: "OKX",
            url: "/images/okx.svg",
            link: "https://www.okx.com/help/how-do-i-make-a-withdrawal-app#on-chain-withdrawal",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-6 justify-center w-full sm:w-auto">
            {guides.map((guide) => (
                <GuideButton key={guide.name} {...guide} />
            ))}
        </div>
    );
};