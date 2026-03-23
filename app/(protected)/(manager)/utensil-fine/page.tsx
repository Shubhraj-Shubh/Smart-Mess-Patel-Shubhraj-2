import { getAllUtensilEntries } from "@/actions/UtensilFineAction";
import UtensilAdminTable from "./utensil-admin-table";
import { auth } from "@/lib/auth";
import { GetAdmin } from "@/actions/adminActions";
import { redirect } from "next/navigation";

export default async function UtensilFinePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const admin = await GetAdmin(session.user.email as string);
  if (!admin || admin.role === "coadmin") {
    redirect("/");
  }

  const rows = await getAllUtensilEntries(300);
  const canManage = admin.role === "admin";

  return (
    <div className="pb-20 px-4">
      <h1 className="text-center text-2xl my-8">Utensil Fine Records</h1>
      <div className="max-w-screen-2xl mx-auto border-b">
        <div className="flex border-t p-2 items-center justify-around font-semibold">
          <div className="w-full text-center">Boarder Name</div>
          <div className="w-full text-center">Issued By</div>
          <div className="w-full text-center">Taken By</div>
          <div className="w-full text-center">Issued Time</div>
          <div className="w-full text-center">Returned Time</div>
          <div className="w-full text-center">Due Time</div>
          <div className="w-full text-center">Fine Status</div>
          {canManage && <div className="w-full text-center">Actions</div>}
        </div>
        <UtensilAdminTable initialRows={rows} canManage={canManage} />
      </div>
    </div>
  );
}
