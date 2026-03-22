"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface ArrayInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

export function ArrayInput({ value, onChange, placeholder }: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };
  
  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="bg-secondary text-xs text-secondary-foreground px-2 py-1 rounded-md flex items-center"
          >
            {item}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0"
              onClick={() => removeItem(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
