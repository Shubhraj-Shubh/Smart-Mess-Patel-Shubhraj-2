import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "@/lib/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { handleSignOut } from "@/actions/authActions";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="md:px-8 px-4 fixed top-0 w-full z-20 backdrop-blur-md">
      <nav className="flex items-center justify-between py-2">
        <Link
          href={"/"}
          className="flex rounded-full backdrop-blur-sm items-center font-semibold text-primary border-2 border-primary gap-4 p-1 pr-4 md:text-xl"
        >
          <Image
            src={"/global/logo.svg"}
            alt="patel hall logo"
            width={32}
            height={32}
            className="h-full w-auto max-h-8 md:max-h-[40px]"
          />
          PATEL HALL OF RESIDENCE
        </Link>

        {/* Mobile Navigation */}
        <>
          <Sheet>
            <SheetTrigger asChild>
              <Menu className="h-6 w-6 md:hidden" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 px-2">
                  <Image
                    src={"/global/logo.svg"}
                    alt="patel hall logo"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <span className="font-semibold text-lg">Patel Hall</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg font-normal hover:bg-secondary hover:text-primary"
                  >
                    Home
                  </Button>
                </Link>
                <Link href="/team">
                  <Button
                    type="button"
                    className="bg-secondary text-primary hover:bg-secondary"
                  >
                    Student Representative
                  </Button>
                </Link>
                {session?.user ? (
                  <div className="px-4 py-2 rounded-lg bg-secondary/10">
                    <p className="text-sm text-muted-foreground">
                      Signed in as
                    </p>
                    <p className="font-medium">
                      {session.user.name?.split(" ")[0]}
                    </p>
                    <form action={handleSignOut} className="mt-4">
                      <Button
                        type="button"
                        onClick={handleSignOut}
                        className="hover:bg-primary"
                      >
                        Sign Out
                      </Button>
                    </form>
                  </div>
                ) : (
                  <Link href="/signin" className="w-full">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </>

        {/* Desktop Navigation */}
        <div className="hidden md:flex px-4 gap-4">
          <Link href="/team">
            <Button
              type="button"
              className="bg-secondary text-primary hover:bg-secondary"
            >
              Student Representative
            </Button>
          </Link>
          {session?.user ? (
            <form action={handleSignOut}>
              <Button
                type="button"
                onClick={handleSignOut}
                className="hover:bg-primary"
              >
                {session.user.name || "Sign Out"}
              </Button>
            </form>
          ) : (
            <Link href="/signin">
              <Button type="button" className="hover:bg-primary">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
