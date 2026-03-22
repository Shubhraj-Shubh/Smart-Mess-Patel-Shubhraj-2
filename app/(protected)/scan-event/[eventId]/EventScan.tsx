"use client";
import React, { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addAttendee } from "@/actions/EventActions";

const EventScan = ({ eventId }: { eventId: string }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const scanUser = async (decodedText: string) => {
    try {
      const res = await addAttendee(eventId, decodedText);

      if (res.success) {
        toast.success("User verified");
        setErrorMessage("");
      } else {
        setErrorMessage(res.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to verify QR code");
    }
  };

  const scanQR = () => {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 300, height: 300 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        scanUser(decodedText);
        html5QrCode.stop();
      },
      (error) => {
        console.warn(`Error scanning: ${error}`);
      }
    );

    return () => {
      html5QrCode.stop().catch((err) => console.error(err));
    };
  };

  return (
    <div className="flex flex-col items-center gap-5 py-16">
      <Button type="button" onClick={scanQR} className="hover:text-primary">
        Scan QR
      </Button>
      <div
        id="reader"
        style={{ width: "300px", margin: "auto" }}
        className="border-2 border-primary rounded-lg transition-all"
      ></div>

      {errorMessage && (
        <p className="text-lg text-destructive font-semibold">{errorMessage}</p>
      )}
    </div>
  );
};

export default EventScan;
