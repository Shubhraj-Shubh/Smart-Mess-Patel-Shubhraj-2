import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BoarderNavbar() {
  return (
    <header className="px-8 mb-4 pt-20">
      <nav className="flex items-center justify-between py-2">
        <ul className="flex px-4 gap-4">
          <li>
            <Link href="/dashboard">
              <Button
                type="button"
                className="bg-secondary text-primary hover:bg-secondary"
              >
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/file-complaint">
              <Button
                type="button"
                className="bg-secondary text-primary hover:bg-secondary"
              >
                Complaint
              </Button>
            </Link>
          </li>
           <li>
            <Link href="/messMenu">
              <Button
                type="button"
                className="bg-secondary text-primary hover:bg-secondary"
              >
                Mess-Menu
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
