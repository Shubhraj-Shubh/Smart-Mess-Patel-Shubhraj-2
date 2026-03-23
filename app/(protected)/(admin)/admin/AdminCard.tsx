"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { changeAdminRole, RemoveAdmin } from "@/actions/adminActions";
import { toast } from "sonner";

type AdminType = {
  _id: string;
  name: string;
  email: string;
  rollno: string;
  role: "admin" | "coadmin" | "manager";
};

export default function AdminCard({
  admin,
  adminId,
}: {
  admin: AdminType;
  adminId: string;
  adminRole: string;
}) {
  async function DeleteFromAdmins() {
    try {
      const res = await RemoveAdmin(admin._id, adminId);

      if (res.success) {
        toast.success("Admin Removed");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove admin");
    }
  }

  async function changeRole(newRole: "admin" | "coadmin" | "manager") {
    try {
      if (newRole === admin.role) {
        toast.info("Already in this role");
        return;
      }

      const res = await changeAdminRole(admin._id, adminId, newRole);

      if (res.success) {
        toast.success(`Role changed to ${newRole}`);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to change role");
    }
  }

  return (
    <div className="flex items-center justify-between border-t p-4 w-full">
      <div className="w-full">
        <div className="text-sm font-medium">{admin.name}</div>
        <div className="text-xs text-gray-500">{admin.email}</div>
      </div>
      <div className="w-full text-center text-sm">{admin.rollno}</div>
      <div className="w-full text-center text-sm uppercase font-semibold text-blue-600">
        {admin.role}
      </div>
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-gray-500">
              Change Role
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={admin.role === "admin"}
              onCheckedChange={() => changeRole("admin")}
            >
              Admin
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={admin.role === "coadmin"}
              onCheckedChange={() => changeRole("coadmin")}
            >
              Co-Admin
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={admin.role === "manager"}
              onCheckedChange={() => changeRole("manager")}
            >
              Manager
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => DeleteFromAdmins()}
            >
              Remove Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
