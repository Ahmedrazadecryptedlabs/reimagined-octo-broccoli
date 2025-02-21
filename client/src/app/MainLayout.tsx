"use client";

import TopNavigation from "@/components/Navbar/TopNavigation";
import SpotTradeSection from "@/components/SpotSection/SpotPage";

export default function MainLayout() {
  return (
    <div className="w-full text-white">
      <TopNavigation />
      <SpotTradeSection />
    </div>
  );
}
