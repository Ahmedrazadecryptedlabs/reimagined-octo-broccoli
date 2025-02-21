// hooks/useDebridgeState.ts
import { useState } from "react";

export function useDebridgeState() {
    const [isSkeletonVisible, setSkeletonVisible] = useState<boolean>(true);
    const [widgetZIndex, setWidgetZIndex] = useState<number>(-1);

    return { isSkeletonVisible, setSkeletonVisible, widgetZIndex, setWidgetZIndex };
}
