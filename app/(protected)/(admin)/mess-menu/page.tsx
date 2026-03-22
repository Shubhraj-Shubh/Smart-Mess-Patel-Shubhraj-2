import { GetAllMenus } from "@/actions/MessMenuActions";
import MessMenuForm from "./MessMenuForm";
import MenuPage from "./MenuPage";

export default async function Page() {
  const res = await GetAllMenus();

  return (
    <div>
      <MessMenuForm />
      {res.status === 500 ? (
        <p>Internal Server Error</p>
      ) : (
        res.data && <MenuPage menus={res.data} />
      )}
    </div>
  );
}
