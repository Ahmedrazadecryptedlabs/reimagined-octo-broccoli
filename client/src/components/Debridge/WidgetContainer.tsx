'use client';

import { DeBridgeWidget } from "../Widgets/DeBridgeWidget";
import { SkeletonLoader } from "./SkeletonLoader";

interface WidgetContainerProps {
  isSkeletonVisible: boolean;
  widgetZIndex: number;
}

export const WidgetContainer = ({ isSkeletonVisible, widgetZIndex }: WidgetContainerProps) => (
  <div className="relative w-full sm:w-[600px] h-[500px] sm:h-[720px]">
    <SkeletonLoader isVisible={isSkeletonVisible} />
    <DeBridgeWidget widgetZIndex={widgetZIndex} />
  </div>
);
