import { ActiveMenu } from "@/actions/MessMenuActions";
import MenuTable from "./MenuTable";

export default async function Page() {
  const res = await ActiveMenu();

  if (res.status === 500) return <p>Internal Server Error</p>;

  return (
    <>
      <div>{res.data && <MenuTable data={res.data} />}</div>
    </>
  );
}
