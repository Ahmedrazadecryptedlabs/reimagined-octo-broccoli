import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletConnecterProvider from "@/context/WalletProvider";
import { Toaster } from "react-hot-toast"; // Import Toaster
import { PoolProvider } from "@/context/PoolContext";
import { TokenProvider } from "@/context/TokenContext";
import { SwapProvider } from "@/context/SwapContext"; // Import SwapProvider

const inter_serif = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swap | Jupyter",
  description: "Jupyter Swap Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter_serif.className} antialiased`}>
        <SwapProvider>
          <TokenProvider>
            <PoolProvider>
              <WalletConnecterProvider>
                {children}
              </WalletConnecterProvider>
            </PoolProvider>
          </TokenProvider>
        </SwapProvider>
      </body>
    </html>
  );
}
