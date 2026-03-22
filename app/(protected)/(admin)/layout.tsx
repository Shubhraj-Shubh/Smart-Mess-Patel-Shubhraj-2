import { GetAdmin } from "@/actions/adminActions";
import { auth } from "@/lib/auth";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { redirect } from "next/navigation";

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

  if (!admin || admin.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}
