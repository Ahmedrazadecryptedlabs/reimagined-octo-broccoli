"use client";

import { useEffect } from "react";

interface WidgetManagerProps {
  setSkeletonVisible: (visible: boolean) => void;
  setWidgetZIndex: (zIndex: number) => void;
}

export const WidgetManager = ({ setSkeletonVisible, setWidgetZIndex }: WidgetManagerProps) => {
  useEffect(() => {
    loadDeBridgeScript();
  }, []);

  const loadDeBridgeScript = () => {
    const script = document.createElement("script");
    script.src = "https://app.debridge.finance/assets/scripts/widget.js";
    script.async = true;
    script.onload = () => initializeWidget();
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  };

  const initializeWidget = () => {
    try {
      window.deBridge?.widget({
        v: "1",
        element: "debridgeWidget",
        title: "",
        description: "",
        width: "600",
        height: "720",
        r: null,
        supportedChains: JSON.stringify({
          inputChains: { "1": "all", "10": "all", "56": "all" },
          outputChains: { "1": "all", "10": "all", "56": "all" },
        }),
        inputChain: 56,
        outputChain: 1,
        inputCurrency: "",
        outputCurrency: "",
        address: "",
        showSwapTransfer: true,
        amount: "",
        outputAmount: "",
        lang: "en",
        mode: "deswap",
        styles:
          "eyJhcHBCYWNrZ3JvdW5kIjoiIzMwNDI1NiIsImJvcmRlclJhZGl1cyI6MTIsInByaW1hcnlCdG5CZyI6IiMxMjFEMjgiLCJwcmltYXJ5QnRuVGV4dCI6IiMxZmJkZTgiLCJkZXNjcmlwdGlvbkZvbnRTaXplIjoiMTIifQ==",
        theme: "dark",
        isHideLogo: false,
      });

      setTimeout(() => {
        setSkeletonVisible(false);
        setWidgetZIndex(10);
      }, 12000);
    } catch (error) {
      console.error("Error initializing widget:", error);
    }
  };

  return null;
};
