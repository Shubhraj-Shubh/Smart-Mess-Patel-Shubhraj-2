"use client";
import { useState, useEffect, useCallback } from "react";
import {
  UploadMessMenu,
  GetAllMessMenus,
  DeleteMessMenu,
  SetActiveMessMenu,
  UploadGsecSignature,
  UploadHallPresidentSignature,
  GetAllSignatures,
  DeleteSignature,
  SetActiveSignature,
} from "@/actions/uploadActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";

interface MessMenuData {
  _id: string;
  title: string;
  menuImageUrl: string;
  uploadDate: Date;
  active: boolean;
}

interface SignatureData {
  _id: string;
  type: "gsec" | "hallpresident";
  signatureUrl: string;
  uploadDate: Date;
  active: boolean;
}

export default function UploadPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState("mess-menu");
  
  // Mess Menu states
  const [messMenuTitle, setMessMenuTitle] = useState("");
  const [messMenus, setMessMenus] = useState<MessMenuData[]>([]);
  const [messMenuLoading, setMessMenuLoading] = useState(false);
  
  // Signatures state
  const [signatures, setSignatures] = useState<SignatureData[]>([]);
  const [signatureLoading, setSignatureLoading] = useState(false);

  // Menu image crop states
  const [menuImage, setMenuImage] = useState<string | null>(null);
  const [menuCrop, setMenuCrop] = useState({ x: 0, y: 0 });
  const [menuZoom, setMenuZoom] = useState(1);
  const [menuCroppedAreaPixels, setMenuCroppedAreaPixels] =
    useState<Area | null>(null);
  const [showMenuCropper, setShowMenuCropper] = useState(false);

  // G.Sec signature crop states
  const [gsecSignature, setGsecSignature] = useState<string | null>(null);
  const [gsecCrop, setGsecCrop] = useState({ x: 0, y: 0 });
  const [gsecZoom, setGsecZoom] = useState(1);
  const [gsecCroppedAreaPixels, setGsecCroppedAreaPixels] =
    useState<Area | null>(null);
  const [showGsecCropper, setShowGsecCropper] = useState(false);

  // Hall President signature crop states
  const [hallPresidentSignature, setHallPresidentSignature] = useState<
    string | null
  >(null);
  const [hallPresidentCrop, setHallPresidentCrop] = useState({ x: 0, y: 0 });
  const [hallPresidentZoom, setHallPresidentZoom] = useState(1);
  const [hallPresidentCroppedAreaPixels, setHallPresidentCroppedAreaPixels] =
    useState<Area | null>(null);
  const [showHallPresidentCropper, setShowHallPresidentCropper] =
    useState(false);

  useEffect(() => {
    fetchMessMenus();
    fetchSignatures();
  }, []);

  const fetchMessMenus = async () => {
    const result = await GetAllMessMenus();
    if (result.status === 200 && result.data) {
      setMessMenus(result.data);
    }
  };

  const fetchSignatures = async () => {
    const result = await GetAllSignatures();
    if (result.status === 200 && result.data) {
      setSignatures(result.data);
    }
  };

  // Create image from crop
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL("image/jpeg");
  };

  const handleMenuImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuImage(reader.result as string);
        setShowMenuCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGsecSignatureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGsecSignature(reader.result as string);
        setShowGsecCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHallPresidentSignatureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHallPresidentSignature(reader.result as string);
        setShowHallPresidentCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setMenuCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleGsecCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setGsecCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleHallPresidentCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setHallPresidentCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Submit handlers
  const handleMessMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menuImage || !menuCroppedAreaPixels) {
      toast.error("Please upload and crop the menu image");
      return;
    }

    if (!messMenuTitle.trim()) {
      toast.error("Please enter a menu title");
      return;
    }

    setMessMenuLoading(true);

    try {
      const croppedMenuImage = await getCroppedImg(
        menuImage,
        menuCroppedAreaPixels
      );

      const result = await UploadMessMenu(messMenuTitle, croppedMenuImage);

      if (result.status === 200) {
        toast.success(result.message);
        setMessMenuTitle("");
        setMenuImage(null);
        setShowMenuCropper(false);
        fetchMessMenus();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload mess menu");
    }

    setMessMenuLoading(false);
  };

  const handleGsecSignatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gsecSignature || !gsecCroppedAreaPixels) {
      toast.error("Please upload and crop the signature");
      return;
    }

    setSignatureLoading(true);

    try {
      const croppedSignature = await getCroppedImg(
        gsecSignature,
        gsecCroppedAreaPixels
      );

      const result = await UploadGsecSignature(croppedSignature);

      if (result.status === 200) {
        toast.success(result.message);
        setGsecSignature(null);
        setShowGsecCropper(false);
        fetchSignatures();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload signature");
    }

    setSignatureLoading(false);
  };

  const handleHallPresidentSignatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hallPresidentSignature || !hallPresidentCroppedAreaPixels) {
      toast.error("Please upload and crop the signature");
      return;
    }

    setSignatureLoading(true);

    try {
      const croppedSignature = await getCroppedImg(
        hallPresidentSignature,
        hallPresidentCroppedAreaPixels
      );

      const result = await UploadHallPresidentSignature(croppedSignature);

      if (result.status === 200) {
        toast.success(result.message);
        setHallPresidentSignature(null);
        setShowHallPresidentCropper(false);
        fetchSignatures();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload signature");
    }

    setSignatureLoading(false);
  };

  const handleDeleteMessMenu = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mess menu?")) return;

    const result = await DeleteMessMenu(id);
    if (result.status === 200) {
      toast.success(result.message);
      fetchMessMenus();
    } else {
      toast.error(result.message);
    }
  };

  const handleSetActiveMessMenu = async (id: string) => {
    const result = await SetActiveMessMenu(id);
    if (result.status === 200) {
      toast.success(result.message);
      fetchMessMenus();
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteSignature = async (id: string) => {
    if (!confirm("Are you sure you want to delete this signature?")) return;

    const result = await DeleteSignature(id);
    if (result.status === 200) {
      toast.success(result.message);
      fetchSignatures();
    } else {
      toast.error(result.message);
    }
  };

  const handleSetActiveSignature = async (id: string) => {
    const result = await SetActiveSignature(id);
    if (result.status === 200) {
      toast.success(result.message);
      fetchSignatures();
    } else {
      toast.error(result.message);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMenuDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuImage(reader.result as string);
        setShowMenuCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGsecDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGsecSignature(reader.result as string);
        setShowGsecCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHallPresidentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHallPresidentSignature(reader.result as string);
        setShowHallPresidentCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Upload Section</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="mess-menu">Mess Menu</TabsTrigger>
          <TabsTrigger value="gsec-signature">G.Sec Signature</TabsTrigger>
          <TabsTrigger value="hall-president-signature">
            Hall President Signature
          </TabsTrigger>
        </TabsList>

        {/* MESS MENU TAB */}
        <TabsContent value="mess-menu">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Upload Mess Menu</h2>
            <form onSubmit={handleMessMenuSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">Menu Title</label>
                <Input
                  type="text"
                  value={messMenuTitle}
                  onChange={(e) => setMessMenuTitle(e.target.value)}
                  placeholder="e.g., Weekly Menu - March 2026"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Menu Card Image *
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleMenuDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleMenuImageUpload}
                    className="hidden"
                    id="menu-image-upload"
                  />
                  <label
                    htmlFor="menu-image-upload"
                    className="cursor-pointer block"
                  >
                    {menuImage && !showMenuCropper ? (
                      <div className="space-y-2">
                        <Image
                          src={menuImage}
                          alt="Menu preview"
                          width={400}
                          height={300}
                          className="mx-auto object-contain"
                        />
                        <p className="text-sm text-gray-600">
                          Click or drag to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg mb-2">
                          Drag and drop menu image here
                        </p>
                        <p className="text-sm text-gray-600">
                          or click to browse
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {showMenuCropper && menuImage && (
                  <div className="mt-4">
                    <div className="relative h-96 bg-gray-100 rounded-lg">
                      <Cropper
                        image={menuImage}
                        crop={menuCrop}
                        zoom={menuZoom}
                        aspect={16 / 10}
                        onCropChange={setMenuCrop}
                        onZoomChange={setMenuZoom}
                        onCropComplete={handleMenuCropComplete}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="text-sm">Zoom</label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={menuZoom}
                        onChange={(e) => setMenuZoom(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowMenuCropper(false)}
                      className="mt-2"
                    >
                      Apply Crop
                    </Button>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={messMenuLoading} className="w-full">
                {messMenuLoading ? "Uploading..." : "Upload Mess Menu"}
              </Button>
            </form>

            <h3 className="text-xl font-bold mt-8">Uploaded Mess Menus</h3>
            <div className="space-y-4">
              {messMenus.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No mess menus uploaded yet
                </p>
              ) : (
                messMenus.map((menu) => (
                  <div
                    key={menu._id}
                    className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {menu.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(menu.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                          {menu.active && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <Image
                            src={menu.menuImageUrl}
                            alt={menu.title}
                            width={500}
                            height={300}
                            className="rounded-lg object-cover w-full"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          onClick={() => window.open(menu.menuImageUrl, "_blank")}
                        >
                          View Full Size
                        </Button>
                        {!menu.active && (
                          <Button onClick={() => handleSetActiveMessMenu(menu._id)}>
                            Set as Active
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteMessMenu(menu._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* G.SEC SIGNATURE TAB */}
        <TabsContent value="gsec-signature">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Upload G.Sec Mess Signature</h2>
            <form onSubmit={handleGsecSignatureSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">
                  G.Sec Signature Image *
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleGsecDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleGsecSignatureUpload}
                    className="hidden"
                    id="gsec-signature-upload"
                  />
                  <label
                    htmlFor="gsec-signature-upload"
                    className="cursor-pointer block"
                  >
                    {gsecSignature && !showGsecCropper ? (
                      <div className="space-y-2">
                        <Image
                          src={gsecSignature}
                          alt="G.Sec signature preview"
                          width={200}
                          height={100}
                          className="mx-auto object-contain"
                        />
                        <p className="text-sm text-gray-600">
                          Click or drag to change signature
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg mb-2">
                          Drag and drop G.Sec signature here
                        </p>
                        <p className="text-sm text-gray-600">
                          or click to browse
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {showGsecCropper && gsecSignature && (
                  <div className="mt-4">
                    <div className="relative h-64 bg-gray-100 rounded-lg">
                      <Cropper
                        image={gsecSignature}
                        crop={gsecCrop}
                        zoom={gsecZoom}
                        aspect={2 / 1}
                        onCropChange={setGsecCrop}
                        onZoomChange={setGsecZoom}
                        onCropComplete={handleGsecCropComplete}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="text-sm">Zoom</label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={gsecZoom}
                        onChange={(e) => setGsecZoom(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowGsecCropper(false)}
                      className="mt-2"
                    >
                      Apply Crop
                    </Button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={signatureLoading}
                className="w-full"
              >
                {signatureLoading ? "Uploading..." : "Upload G.Sec Signature"}
              </Button>
            </form>

            <h3 className="text-xl font-bold mt-8">Uploaded G.Sec Signatures</h3>
            <div className="space-y-4">
              {signatures.filter((s) => s.type === "gsec").length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No G.Sec signatures uploaded yet
                </p>
              ) : (
                signatures
                  .filter((s) => s.type === "gsec")
                  .map((signature) => (
                    <div
                      key={signature._id}
                      className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                G.Sec Signature
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  signature.uploadDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            {signature.active && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Active
                              </span>
                            )}
                          </div>

                          <div className="mt-4">
                            <Image
                              src={signature.signatureUrl}
                              alt="G.Sec signature"
                              width={300}
                              height={150}
                              className="rounded-lg object-contain bg-gray-50 p-4"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(signature.signatureUrl, "_blank")
                            }
                          >
                            View Full Size
                          </Button>
                          {!signature.active && (
                            <Button
                              onClick={() =>
                                handleSetActiveSignature(signature._id)
                              }
                            >
                              Set as Active
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteSignature(signature._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* HALL PRESIDENT SIGNATURE TAB */}
        <TabsContent value="hall-president-signature">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Upload Hall President Signature
            </h2>
            <form
              onSubmit={handleHallPresidentSignatureSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block mb-2 font-medium">
                  Hall President Signature Image *
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleHallPresidentDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleHallPresidentSignatureUpload}
                    className="hidden"
                    id="hall-president-signature-upload"
                  />
                  <label
                    htmlFor="hall-president-signature-upload"
                    className="cursor-pointer block"
                  >
                    {hallPresidentSignature && !showHallPresidentCropper ? (
                      <div className="space-y-2">
                        <Image
                          src={hallPresidentSignature}
                          alt="Hall President signature preview"
                          width={200}
                          height={100}
                          className="mx-auto object-contain"
                        />
                        <p className="text-sm text-gray-600">
                          Click or drag to change signature
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg mb-2">
                          Drag and drop Hall President signature here
                        </p>
                        <p className="text-sm text-gray-600">
                          or click to browse
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {showHallPresidentCropper && hallPresidentSignature && (
                  <div className="mt-4">
                    <div className="relative h-64 bg-gray-100 rounded-lg">
                      <Cropper
                        image={hallPresidentSignature}
                        crop={hallPresidentCrop}
                        zoom={hallPresidentZoom}
                        aspect={2 / 1}
                        onCropChange={setHallPresidentCrop}
                        onZoomChange={setHallPresidentZoom}
                        onCropComplete={handleHallPresidentCropComplete}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="text-sm">Zoom</label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={hallPresidentZoom}
                        onChange={(e) =>
                          setHallPresidentZoom(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowHallPresidentCropper(false)}
                      className="mt-2"
                    >
                      Apply Crop
                    </Button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={signatureLoading}
                className="w-full"
              >
                {signatureLoading
                  ? "Uploading..."
                  : "Upload Hall President Signature"}
              </Button>
            </form>

            <h3 className="text-xl font-bold mt-8">
              Uploaded Hall President Signatures
            </h3>
            <div className="space-y-4">
              {signatures.filter((s) => s.type === "hallpresident").length ===
              0 ? (
                <p className="text-center text-gray-500 py-8">
                  No Hall President signatures uploaded yet
                </p>
              ) : (
                signatures
                  .filter((s) => s.type === "hallpresident")
                  .map((signature) => (
                    <div
                      key={signature._id}
                      className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                Hall President Signature
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  signature.uploadDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            {signature.active && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Active
                              </span>
                            )}
                          </div>

                          <div className="mt-4">
                            <Image
                              src={signature.signatureUrl}
                              alt="Hall President signature"
                              width={300}
                              height={150}
                              className="rounded-lg object-contain bg-gray-50 p-4"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(signature.signatureUrl, "_blank")
                            }
                          >
                            View Full Size
                          </Button>
                          {!signature.active && (
                            <Button
                              onClick={() =>
                                handleSetActiveSignature(signature._id)
                              }
                            >
                              Set as Active
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteSignature(signature._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

