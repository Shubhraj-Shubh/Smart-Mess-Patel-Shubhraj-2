"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CostsAndFinesNav() {
  const [activeTab, setActiveTab] = useState<"costs" | "fines" | "utensil">(
    "costs"
  );

  const handleCostsClick = () => {
    setActiveTab("costs");
    document.getElementById("costs-section")?.classList.remove("hidden");
    document.getElementById("fines-section")?.classList.add("hidden");
    document.getElementById("utensil-section")?.classList.add("hidden");
  };

  const handleFinesClick = () => {
    setActiveTab("fines");
    document.getElementById("costs-section")?.classList.add("hidden");
    document.getElementById("fines-section")?.classList.remove("hidden");
    document.getElementById("utensil-section")?.classList.add("hidden");
  };

  const handleUtensilClick = () => {
    setActiveTab("utensil");
    document.getElementById("costs-section")?.classList.add("hidden");
    document.getElementById("fines-section")?.classList.add("hidden");
    document.getElementById("utensil-section")?.classList.remove("hidden");
  };

  return (
    <div className="flex gap-4 p-4 border-b">
      <Button
        onClick={handleCostsClick}
        className={activeTab === "costs" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"}
      >
        Costs
      </Button>
      <Button
        onClick={handleFinesClick}
        className={activeTab === "fines" ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 hover:bg-gray-500"}
      >
        Fines
      </Button>
      <Button
        onClick={handleUtensilClick}
        className={
          activeTab === "utensil"
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-gray-400 hover:bg-gray-500"
        }
      >
        Utensil Fine
      </Button>
    </div>
  );
}
