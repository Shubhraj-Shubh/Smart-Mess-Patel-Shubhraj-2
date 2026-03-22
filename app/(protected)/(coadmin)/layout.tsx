import { GetAdmin } from "@/actions/adminActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default async function AdminLayout({
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

  // Only coadmin and admin (with full access) can access coadmin routes
  // Restrict manager from accessing coadmin routes
  if (admin.role === "manager") {
    redirect("/");
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}

