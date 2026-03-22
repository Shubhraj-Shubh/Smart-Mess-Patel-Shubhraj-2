import { GetAdmin } from "@/actions/adminActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const admin = await GetAdmin(session.user.email as string);

  if (!admin) {
    redirect("/");
  }

  // Only manager and admin (with full access) can access manager routes
  // Restrict coadmin from accessing manager routes
  if (admin.role === "coadmin") {
    redirect("/");
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}
