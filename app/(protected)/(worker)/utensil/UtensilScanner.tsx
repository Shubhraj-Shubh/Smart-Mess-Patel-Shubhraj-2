"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyQRCode } from "@/actions/QRActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  issueUtensil,
  returnUtensil,
  getUtensilFineAmount,
} from "@/actions/UtensilFineAction";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  cardNo: string;
  rollno: string;
  active: boolean;
};

export default function UtensilScanner({
  workerId,
  workerName,
}: {
  workerId: string;
  workerName: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"issue" | "return">("issue");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountLabel, setAmountLabel] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);

  const stopScannerSafely = useCallback(async () => {
    if (!scannerRef.current || !isScanningRef.current) {
      return;
    }

    try {
      await scannerRef.current.stop();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error || "");

      // Ignore known race where stop() is called after scanner has already stopped.
      if (!message.toLowerCase().includes("scanner is not running or paused")) {
        console.error("Failed to stop scanner:", error);
      }
    } finally {
      isScanningRef.current = false;
      setIsScanning(false);
    }
  }, []);

  const fetchUser = async (decodedText: string) => {
    try {
      const res = await verifyQRCode(decodedText);

      if (res && res.valid && res.user) {
        if (res.user.active === false) {
          toast.error("Inactive Card");
          setUser(null);
          return;
        }

        setUser(res.user);
      } else {
        toast.error("Invalid User");
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };

  const scanQR = async () => {
    if (isScanningRef.current) {
      return;
    }

    const html5QrCode = new Html5Qrcode("utensil-reader");
    scannerRef.current = html5QrCode;
    isScanningRef.current = true;
    setIsScanning(true);

    const config = { fps: 10, qrbox: { width: 300, height: 300 } };

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          await fetchUser(decodedText);
          await stopScannerSafely();
        },
        () => {
          // Ignore per-frame decode errors while camera is scanning.
        }
      );
    } catch (error) {
      console.error("Failed to start scanner:", error);
      isScanningRef.current = false;
      setIsScanning(false);
      toast.error("Unable to start scanner");
    }
  };

  useEffect(() => {
    return () => {
      void stopScannerSafely();
    };
  }, [stopScannerSafely]);

  const handleUtensilAction = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);

    const actionPayload = {
      userId: user._id,
      workerId,
      workerName,
    };

    const response =
      mode === "issue"
        ? await issueUtensil(actionPayload)
        : await returnUtensil(actionPayload);

    if (response.success) {
      toast.success(response.message);
      setUser(null);
    } else {
      toast.error(response.message);
    }

    setIsSubmitting(false);
  };

  const refreshAmount = async () => {
    const res = await getUtensilFineAmount();
    setAmountLabel(res.amount);
  };

  return (
    <div className="flex flex-col items-center gap-5 pb-12">
      <h1 className="text-2xl font-semibold mt-4">Utensil Scan</h1>
      <p className="text-sm text-muted-foreground text-center max-w-xl">
        Issue utensil at pickup and return it when student gives it back. If not
        returned before 8:30 PM, configured fine gets applied automatically.
      </p>

      <div className="flex gap-3">
        <Button
          type="button"
          variant={mode === "issue" ? "default" : "outline"}
          onClick={() => setMode("issue")}
        >
          Issue
        </Button>
        <Button
          type="button"
          variant={mode === "return" ? "default" : "outline"}
          onClick={() => setMode("return")}
        >
          Return
        </Button>
        <Button type="button" variant="outline" onClick={refreshAmount}>
          Fine Amount
        </Button>
      </div>

      {amountLabel !== null && (
        <p className="text-sm text-muted-foreground">
          Current utensil fine: Rs {amountLabel}
        </p>
      )}

      <Button
        type="button"
        onClick={scanQR}
        className="hover:text-primary"
        disabled={isScanning}
      >
        {isScanning ? "Scanning..." : "Scan QR"}
      </Button>

      <div
        id="utensil-reader"
        style={{ width: "300px", margin: "auto" }}
        className="border-2 border-primary rounded-lg transition-all"
      ></div>

      {user && (
        <div className="w-full max-w-md border rounded-lg p-4 space-y-4">
          <div className="font-medium flex flex-col items-center">
            <div>Name: {user.name}</div>
            <div>Roll No.: {user.rollno}</div>
            <div>Card No.: {user.cardNo}</div>
          </div>

          <Button
            onClick={handleUtensilAction}
            disabled={isSubmitting}
            className="w-full"
          >
            {mode === "issue" ? "Issue Utensil" : "Return Utensil"}
          </Button>
        </div>
      )}
    </div>
  );
}
