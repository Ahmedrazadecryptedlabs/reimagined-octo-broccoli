const ActivitySection = () => {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-v2-primary scrollbar-track-gray-800 px-4 py-2 text-gray-400">
        {[
          { label: "Instant", primary: true },
          { label: "Trigger" },
          { label: "Recurring" },
          { label: "Smart Recurring" },
          { label: "Perps" },
        ].map(({ label, primary }) => (
          <button
            key={label}
            className={`whitespace-nowrap rounded-full px-4 py-1 text-xs md:text-sm border ${
              primary
                ? "border-v2-primary bg-v2-primary/10 text-v2-primary hover:bg-v2-primary/10 hover:text-v2-primary"
                : "border-[#283747] bg-[#283747] text-v2-lily/50 hover:bg-[#283747]/50 hover:text-v2-lily"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="my-5 mx-5 !mb-0 !mt-2"></div>
      <div className="h-[calc(100vh-200px)] flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-v2-primary scrollbar-track-gray-800 md:h-[calc(100vh-230px)]">
        <div className="flex h-full items-center justify-center">
          <span className="text-sm text-v2-lily/50">No activities found</span>
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;
