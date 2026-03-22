import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
}

export default function LoadingButton({ isLoading, text }: LoadingButtonProps) {
  return (
    <Button type="submit" disabled={isLoading} className="hover:text-primary">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </>
      ) : (
        text
      )}
    </Button>
  );
}
