import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCallback, useRef } from "react";
import QRCode from "qrcode";
import { toPng, toSvg, toJpeg } from "html-to-image";
import { Nunito_Sans } from "next/font/google";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  GetActiveGsecSignature,
  GetActiveHallPresidentSignature,
} from "@/actions/uploadActions";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  cardNo: string;
  secret: string;
  rollno: string;
};

const nunito = Nunito_Sans({ subsets: ["latin"] });

type SignatureUrls = {
  gsecSignatureUrl: string;
  hallPresidentSignatureUrl: string;
};

let signatureUrlsCache: SignatureUrls | null = null;
let signatureUrlsPromise: Promise<SignatureUrls> | null = null;

const fetchSignatureUrls = async (): Promise<SignatureUrls> => {
  if (signatureUrlsCache) {
    return signatureUrlsCache;
  }

  if (!signatureUrlsPromise) {
    signatureUrlsPromise = (async () => {
      const [gsecResult, hallPresidentResult] = await Promise.all([
        GetActiveGsecSignature(),
        GetActiveHallPresidentSignature(),
      ]);

      const urls: SignatureUrls = {
        gsecSignatureUrl:
          gsecResult.status === 200 && gsecResult.data
            ? gsecResult.data.signatureUrl
            : "",
        hallPresidentSignatureUrl:
          hallPresidentResult.status === 200 && hallPresidentResult.data
            ? hallPresidentResult.data.signatureUrl
            : "",
      };

      signatureUrlsCache = urls;
      return urls;
    })().catch((error) => {
      signatureUrlsPromise = null;
      throw error;
    });
  }

  return signatureUrlsPromise;
};

export default function BoarderCard({ user }: { user: User }) {
  const ref = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [gsecSignatureUrl, setGsecSignatureUrl] = useState<string>("");
  const [hallPresidentSignatureUrl, setHallPresidentSignatureUrl] =
    useState<string>("");

  useEffect(() => {
    let isMounted = true;

    fetchSignatureUrls()
      .then((urls) => {
        if (!isMounted) {
          return;
        }

        setGsecSignatureUrl(urls.gsecSignatureUrl);
        setHallPresidentSignatureUrl(urls.hallPresidentSignatureUrl);
      })
      .catch((error) => {
        console.error("Error fetching signatures:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const downloadJPEG = useCallback(
    (rollno: string, name: string) => {
      if (ref.current === null) {
        return;
      }

      toJpeg(ref.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `${rollno}_${name}.jpeg`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [ref]
  );
  const downloadPNG = useCallback(
    (rollno: string, name: string) => {
      if (ref.current === null) {
        return;
      }

      toPng(ref.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `${rollno}_${name}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [ref]
  );
  const downloadSVG = useCallback(
    (rollno: string, name: string) => {
      if (ref.current === null) {
        return;
      }

      toSvg(ref.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `${rollno}_${name}.svg`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [ref]
  );

  useEffect(() => {
    QRCode.toDataURL(user.secret)
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err));
  }, [user.secret]);

  return (
    <div className="space-y-2">
      <div
        ref={ref}
        className={`relative bg-[url('/idcard2024.svg')] bg-cover bg-center w-[500px] h-[313px] shadow-md rounded-lg uppercase ${nunito.className}`}
      >
        {qrCodeUrl && (
          <Image
            width={200}
            height={200}
            src={qrCodeUrl}
            alt="QR Code"
            className="absolute top-[100px] left-1 transform"
          />
        )}
        {gsecSignatureUrl && (
          <Image
            width={80}
            height={40}
            src={gsecSignatureUrl}
            alt="G.Sec Signature"
            className="absolute bottom-[38px] right-[200px] object-contain"
          />
        )}
        {hallPresidentSignatureUrl && (
          <Image
            width={80}
            height={40}
            src={hallPresidentSignatureUrl}
            alt="Hall President Signature"
            className="absolute bottom-[38px] right-[44px] object-contain"
          />
        )}
        <div className="absolute top-[124px] left-[200px] font-medium text-md flex">
          <div className="text-[#1c1c66] flex flex-col gap-1 items-start">
            <div>Name</div>
            <div>Roll No.</div>
            <div>Phone No.</div>
            <div>Card No.</div>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <div>
              &nbsp;:&nbsp;&nbsp;
              {(() => {
                const trimmedName = user.name.trim();
                if (trimmedName.length <= 18) {
                  return trimmedName;
                }

                const words = trimmedName.split(" ");
                const firstWord = words[0];
                const lastWord = words[words.length - 1];

                if (firstWord.length + lastWord.length <= 18) {
                  return `${firstWord} ${lastWord}`;
                }

                return firstWord;
              })()}
            </div>
            <div>&nbsp;:&nbsp;&nbsp;{user.rollno}</div>
            <div>&nbsp;:&nbsp;&nbsp;{user.phoneNo}</div>
            <div>&nbsp;:&nbsp;&nbsp;{user.cardNo}</div>
          </div>
        </div>
      </div>

      <div className="space-x-2">
        <Button
          onClick={() => downloadJPEG(user.rollno, user.name)}
          className="bg-secondary text-primary hover:bg-secondary"
        >
          Download JPEG
        </Button>
        <Button
          onClick={() => downloadPNG(user.rollno, user.name)}
          className="bg-secondary text-primary hover:bg-secondary"
        >
          Download PNG
        </Button>
        <Button
          onClick={() => downloadSVG(user.rollno, user.name)}
          className="bg-secondary text-primary hover:bg-secondary"
        >
          Download SVG
        </Button>
        <Link href={`/boarder/${user._id}`}>
          <Button className="hover:text-primary" size="sm">
            <ExternalLink />
          </Button>
        </Link>
      </div>
    </div>
  );
}
