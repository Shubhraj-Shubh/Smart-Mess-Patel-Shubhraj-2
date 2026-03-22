
"use client";
import { useState, useEffect } from "react";
import { UploadDriveMenu, GetAllDriveMenus, DeleteDriveMenu } from "@/actions/DriveMenuActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DriveMenuData {
  _id: string;
  title: string;
  driveLink: string;
  uploadDate: Date;
  active: boolean;
}

export default function DriveMenuPage() {
  const [title, setTitle] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [menus, setMenus] = useState<DriveMenuData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const result = await GetAllDriveMenus();
    if (result.status === 200 && result.data) {
      setMenus(result.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await UploadDriveMenu(title, driveLink);
    
    if (result.status === 200) {
      alert(result.message);
      setTitle("");
      setDriveLink("");
      fetchMenus();
    } else {
      alert(result.message);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu?")) return;
    
    const result = await DeleteDriveMenu(id);
    if (result.status === 200) {
      alert(result.message);
      fetchMenus();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quick Upload - Drive Link</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter menu title"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Drive Link</label>
          <Input
            type="url"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            placeholder="https://drive.google.com/file/d/FILE_ID/preview"
            required
          />
        </div>
        
        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Uploaded Drive Menus</h2>
      <div className="space-y-4">
        {menus.map((menu) => (
          <div key={menu._id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{menu.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(menu.uploadDate).toLocaleDateString()}
              </p>
              {menu.active && (
                <span className="text-green-600 text-sm font-medium">Active</span>
              )}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => window.open(menu.driveLink, "_blank")}
              >
                View
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(menu._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
