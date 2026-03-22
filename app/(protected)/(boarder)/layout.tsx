import { getBoarder } from "@/actions/boarderActions";
import BoarderNavbar from "@/components/boarder/BoarderNavbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
});

export default async function BoarderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const boarder = await getBoarder(session.user.email as string);

  if (!boarder) {
    redirect("/unknown");
  }

  return (
    <div className={`${oswald.className}`}>
      <BoarderNavbar />
      {children}
    </div>
  );
}
