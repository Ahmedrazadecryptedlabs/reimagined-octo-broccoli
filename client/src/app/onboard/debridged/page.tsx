"use client";

import { useDebridgeState } from "@/hooks/useDebridgeState";
import { DebridgeContent } from "@/components/Debridge/DebridgeContent";

export default function DeBridgePage() {
  const { isSkeletonVisible, setSkeletonVisible, widgetZIndex, setWidgetZIndex } = useDebridgeState();

  return (
    <DebridgeContent
      isSkeletonVisible={isSkeletonVisible}
      setSkeletonVisible={setSkeletonVisible}
      widgetZIndex={widgetZIndex}
      setWidgetZIndex={setWidgetZIndex}
    />
  );
}
