import Image from "next/image";
import { handleGoogleSignIn } from "@/actions/authActions";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <form action={handleGoogleSignIn} className="mb-2">
        <button
          type="submit"
          className="flex items-center border justify-center w-full text-muted-foreground md:shadow px-3 py-2 border-1 rounded-lg space-x-2 font-semibold transition-all duration-300 hover:shadow-sm text-lg"
        >
          <Image
            src={"/signin/googleicon.png"}
            alt="google icon"
            width={100}
            height={100}
            className="w-6 h-6"
          />
          <span className="text-muted-foreground font-bold">
            Sign In using Google
          </span>
        </button>
      </form>

      <div className="flex items-center justify-center my-4">
        <div className="w-1/3 border-b border-muted-ftext-muted-foreground mr-4"></div>
        <span className="text-muted-foreground font-semibold text-center text-sm">
          Or login with email
        </span>
        <div className="w-1/3 border-b border-muted-ftext-muted-foreground ml-4 "></div>
      </div>

      {children}
    </>
  );
}
