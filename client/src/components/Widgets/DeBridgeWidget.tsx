"use client";

import { useEffect, useState } from "react";

interface DeBridgeWidgetProps {
  widgetZIndex: number;
}

export function DeBridgeWidget({ widgetZIndex }: DeBridgeWidgetProps) {
  return (
    <div
      id="debridgeWidget"
      className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl [&>iframe]:max-w-full"
      style={{
        zIndex: widgetZIndex,
        opacity: widgetZIndex > 0 ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    ></div>
  );
}
