import { CEXHeader } from "@/components/Cex/CexHeader";
import { Guides } from "@/components/Cex/Guides";
import { StepsBox } from "@/components/Cex/Steps";


export default function CEXPage() {
  return (
    <div className="min-h-screen flex flex-col items-center sm:px-6 sm:py-8">
      <CEXHeader />
      <Guides />
      <StepsBox />
    </div>
  );
}
