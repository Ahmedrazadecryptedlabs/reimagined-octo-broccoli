interface SkeletonLoaderProps {
  isVisible: boolean;
}

export function SkeletonLoader({ isVisible }: SkeletonLoaderProps) {
  if (!isVisible) return null;
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-[#192531] rounded-2xl animate-pulse p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-1/4 bg-[#202a36] rounded"></div>
        <div className="h-8 w-8 bg-[#202a36] rounded"></div>
      </div>
      <div className="h-40 w-full bg-[#202a36] rounded"></div>
      <div className="h-8 w-16 bg-[#202a36] rounded mx-auto"></div>
      <div className="h-24 w-full bg-[#202a36] rounded"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 w-1/3 bg-[#202a36] rounded"></div>
        <div className="h-8 w-1/3 bg-[#202a36] rounded"></div>
      </div>
      <div className="h-10 w-full bg-[#202a36] rounded"></div>
    </div>
  );
}
