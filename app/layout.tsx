import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";

import { Raleway } from "next/font/google";
import Footer from "@/components/global/Footer";

const raleway = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Mess - Patel Hall of Residence",
  description:
    "Patel Hall of Residence is one of the oldest and most prestigious halls of residence in IIT Kharagpur. It is home to some of the brightest minds in the country.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.className}`}>
        <ScrollArea className="w-screen h-screen"> 
          <Navbar />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </ScrollArea>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
