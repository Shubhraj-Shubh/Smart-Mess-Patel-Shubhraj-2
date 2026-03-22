import { GetAdmin, GetAllAdmins } from "@/actions/adminActions";
import AdminCard from "./AdminCard";
import { auth } from "@/lib/auth";

export default async function Admins() {
  const session = await auth();

  if (!session || !session.user) return null;

  const admin = await GetAdmin(session.user.email as string);

  if (!admin) return null;

  const admins = await GetAllAdmins();

  return (
    <>
      <h1 className="text-center text-2xl my-4">Admins</h1>

      <div className="max-w-screen-lg m-auto border-b">
        {admins.map((item, index) => (
          <AdminCard key={index} admin={item} adminId={admin._id.toString()} adminRole={admin.role} />
        ))}
      </div>
    </>
  );
}
