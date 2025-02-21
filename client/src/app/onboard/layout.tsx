"use client";

import TopNavigation from "@/components/Navbar/TopNavigation";
import SubTabs from "@/components/Navbar/SubTabs";
import { ReactNode } from "react";

interface OnboardLayoutProps {
  children: ReactNode;
}

export default function OnboardLayout({ children }: OnboardLayoutProps) {
  return (
    <div className="bg-gray-800 min-h-screen flex flex-col">
      <TopNavigation />
      <SubTabs />
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
}
