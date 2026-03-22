import { UserInputForm } from "./AddAdminForm";
import Admins from "./ShowAdmins";
import { GetAdmin } from "@/actions/adminActions";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth();
  let adminId = "";
  let adminRole = "";

  if (session && session.user) {
    const admin = await GetAdmin(session.user.email as string);
    if (admin) {
      adminId = admin._id.toString();
      adminRole = admin.role;
    }
  }

  return (
    <>
      <Admins />
      {adminId && <UserInputForm adminId={adminId} adminRole={adminRole} />}
    </>
  );
}
