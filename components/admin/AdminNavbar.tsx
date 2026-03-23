import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { GetAdmin } from "@/actions/adminActions";

export default async function AdminNavbar() {
  const session = await auth();

  if (!session?.user) return null;

  const admin = await GetAdmin(session.user.email as string);

  if (!admin) return null;

  return (
    <header className="px-8 mb-4 pt-20">
      <nav className="py-2">
        <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 px-4">
          {admin.role === "admin" && (
            <>
              <li>
                <Link href="/admin">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Admins
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/upload-section">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Upload Section
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/add-boarders">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Add Boarders
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/remove-boarders">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Remove Boarders
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/allcomplaints">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Complaints
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/see-boarders">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    See Boarders Id&apos;s
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/event">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Event&apos;s
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/representatives">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Representatives
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/gc-refreshments/add">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    GC-Add Refreshments
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/gc-refreshments/confirm">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    GC-Confirm Refreshments
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/boarder">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Boarders
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/worker">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Workers
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/utensil-fine">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Utensil Fine
                  </Button>
                </Link>
              </li>
            </>
          )}

          {admin.role === "manager" && (
            <>
              <li>
                <Link href="/boarder">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Boarders
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/see-boarders">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    See Boarders Id&apos;s
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/worker">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Workers
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/utensil-fine">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Utensil Fine
                  </Button>
                </Link>
              </li>
                <li>
                <Link href="/gc-refreshments/confirm">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    GC-Confirm Refreshments
                  </Button>
                </Link>
              </li>
            </>
          )}

          {admin.role === "coadmin" && (
            <li>
              <Link href="/gc-refreshments/add">
                <Button
                  type="button"
                  className="bg-secondary text-primary hover:bg-secondary"
                >
                  GC-Add Refreshments
                </Button>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
