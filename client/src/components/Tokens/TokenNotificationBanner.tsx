const TokenNotificationBanner = () => {
    return (
        <div className="flex items-center justify-center gap-1 rounded-lg border border-v2-lily/10 bg-white-5 p-4 text-center text-sm text-white-75">
            <span>
                Organic Trending Tokens: Organic Scores are in BETA. Share feedback to help us improve by contacting us on{' '}
                <a className="underline" href="https://discord.gg/jup">
                    Discord
                </a>
            </span>
        </div>
    );
};

export default TokenNotificationBanner; 