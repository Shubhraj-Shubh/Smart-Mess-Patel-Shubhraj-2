"use client";
import { useEffect, useState } from "react";
import { GetActiveMessMenu } from "@/actions/uploadActions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Download } from "lucide-react";

interface MessMenuData {
  _id: string;
  title: string;
  menuImageUrl: string;
  uploadDate: Date;
}

export default function BoarderMessMenuPage() {
  const [messMenu, setMessMenu] = useState<MessMenuData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveMenu();
  }, []);

  const fetchActiveMenu = async () => {
    const result = await GetActiveMessMenu();
    if (result.status === 200 && result.data) {
      setMessMenu(result.data);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!messMenu) return;

    try {
      const response = await fetch(messMenu.menuImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${messMenu.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!messMenu) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No menu available</h1>
        <p className="text-gray-600">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{messMenu.title}</h1>
          <p className="text-sm text-gray-600">
            Updated: {new Date(messMenu.uploadDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.open(messMenu.menuImageUrl, "_blank")} variant="outline">
            View Full Size
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Menu
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <Image
          src={messMenu.menuImageUrl}
          alt={messMenu.title}
          width={1200}
          height={800}
          className="w-full h-auto rounded-lg"
          priority
        />
      </div>
    </div>
  );
}
