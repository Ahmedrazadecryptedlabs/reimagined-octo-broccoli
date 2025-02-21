import { Header } from "@/components/Debridge/DebridgeHeader";
import { WidgetManager } from "@/components/Debridge/WidgetManager";
import { WidgetContainer } from "@/components/Debridge/WidgetContainer";

interface DebridgeContentProps {
    isSkeletonVisible: boolean;
    setSkeletonVisible: (visible: boolean) => void;
    widgetZIndex: number;
    setWidgetZIndex: (zIndex: number) => void;
}

export function DebridgeContent({
    isSkeletonVisible,
    setSkeletonVisible,
    widgetZIndex,
    setWidgetZIndex,
}: DebridgeContentProps) {
    return (
        <div className="text-white text-center flex flex-col justify-center items-center">
            <Header />
            <WidgetManager setSkeletonVisible={setSkeletonVisible} setWidgetZIndex={setWidgetZIndex} />
            <WidgetContainer isSkeletonVisible={isSkeletonVisible} widgetZIndex={widgetZIndex} />
        </div>
    );
}
