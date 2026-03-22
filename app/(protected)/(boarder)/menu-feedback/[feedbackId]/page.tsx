import {  GetMenuPollByBoarderId } from "@/actions/MenuPollActions";
import { GetMenu } from "@/actions/MessMenuActions";
import MealPlan from "./MenuTable";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBoarder } from "@/actions/boarderActions";

export default async function Page({
  params,
}: {
  params: Promise<{ feedbackId: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const boarder = await getBoarder(session.user.email as string);

  if (!boarder) {
    redirect("/unknown");
  }

  const feedbackId = (await params).feedbackId;

  const res = await GetMenuPollByBoarderId(feedbackId, boarder._id);

  if (res.status !== 200) {
    return <div>{res.message}</div>;
  }

  if (!res.data) {
    return <div>No feedback found</div>;
  }

  if (res.data.expiryDate < new Date()) {
    return <div>Feedback Expired</div>;
  }

  const menuRes = await GetMenu(res.data.menuId.toString());

  if (!res.data) {
    return <div>Mess Menu not found</div>;
  }

  return (
    <div>
      {menuRes.data?.menu && (
        <MealPlan
          data={menuRes.data.menu}
          boarderId={boarder._id}
          feedbackId={feedbackId}
          feedbacks={res.data.feedbacks}
        />
      )}
    </div>
  );
}
