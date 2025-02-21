"use client";

import * as React from "react";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import ActivitySection from "./WalletActivity";

interface SectionProps {
  title: string;
  badge: string;
  value: string;
  badgeClassName?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function Section({
  title,
  badge,
  value,
  badgeClassName,
  children,
  isOpen,
  onToggle,
}: SectionProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="rounded-lg bg-[#19232D] px-4 py-2"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{title}</span>
          <Badge
            variant="secondary"
            className={`rounded-full border border-[#065986] bg-[#062C41] px-2 py-1 text-xxs text-[#7CD4FD] md:text-xs ${badgeClassName}`}
          >
            {badge}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{value}</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        {children || (
          <div className="flex h-[400px] items-center justify-center text-sm text-gray-400">
            No Open Orders
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PortfolioView() {
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  const handleToggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="w-full space-y-2 rounded-xl mt-4">
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#19232D] h-11">
          <TabsTrigger
            value="portfolio"
            className="p-2 font-medium data-[state=active]:bg-[#304256] data-[state=active]:text-white"
          >
            Portfolio
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="p-2 text-gray-400 data-[state=active]:bg-[#304256] data-[state=active]:text-white"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-2">
          <Section
            title="Holdings"
            badge="0 tokens"
            value="$0"
            isOpen={openSection === "Holdings"}
            onToggle={() => handleToggle("Holdings")}
            badgeClassName="rounded-full border border-v2-lily-50 bg-transparent !text-gray-300 px-2 py-1 text-xxs md:text-xs"
          />
          <Section
            title="Limits"
            badge="0 Open Orders"
            value="$0"
            isOpen={openSection === "Limits"}
            onToggle={() => handleToggle("Limits")}
            badgeClassName="rounded-full border border-[#065986] bg-[#062C41] px-2 py-1 text-xxs text-[#7CD4FD] md:text-xs"
          />
          <Section
            title="Recurring"
            badge="0 Open Orders"
            value="$0"
            isOpen={openSection === "Recurring"}
            onToggle={() => handleToggle("Recurring")}
            badgeClassName="rounded-full border border-[#C7F284]/30 px-2 py-1 text-xxs text-[#C7F284] md:text-xs"
          />
          <Section
            title="Smart Recurring"
            badge="0 Open Orders"
            value="$0"
            isOpen={openSection === "Smart Recurring"}
            onToggle={() => handleToggle("Smart Recurring")}
          />
          <Section
            title="Perps"
            badge="0 Positions"
            value="$0"
            isOpen={openSection === "Perps"}
            onToggle={() => handleToggle("Perps")}
          />
        </TabsContent>

        <TabsContent value="activity">
          <ActivitySection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
