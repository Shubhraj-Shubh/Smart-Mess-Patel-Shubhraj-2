import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function WorkerNavbar() {
  return (
    <header className="px-8 mt-20">
      <nav className=" flex items-center justify-between py-2">
        <ul className="flex px-4 gap-4">
          <li>
            <Link href="/scan">
              <Button
                type="button"
                className="bg-secondary text-primary hover:bg-secondary"
              >
                Mess Addons
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/utensil">
              <Button
                type="button"
                className="bg-secondary text-primary hover:bg-secondary"
              >
                Utensil Scan
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
