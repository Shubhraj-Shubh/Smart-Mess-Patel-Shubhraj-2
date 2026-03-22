"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BoarderCostsAndFinesNav() {
  const [activeTab, setActiveTab] = useState<"costs" | "fines">("costs");

  const handleCostsClick = () => {
    setActiveTab("costs");
    document.getElementById("boarder-costs-section")?.classList.remove("hidden");
    document.getElementById("boarder-fines-section")?.classList.add("hidden");
  };

  const handleFinesClick = () => {
    setActiveTab("fines");
    document.getElementById("boarder-costs-section")?.classList.add("hidden");
    document.getElementById("boarder-fines-section")?.classList.remove("hidden");
  };

  return (
    <div className="flex gap-4 p-4 border-b">
      <Button
        onClick={handleCostsClick}
        className={activeTab === "costs" ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-400 hover:bg-slate-500"}
      >
        Costs
      </Button>
      <Button
        onClick={handleFinesClick}
        className={activeTab === "fines" ? "bg-purple-500 hover:bg-purple-600" : "bg-slate-400 hover:bg-slate-500"}
      >
        Fines
      </Button>
    </div>
  );
}
