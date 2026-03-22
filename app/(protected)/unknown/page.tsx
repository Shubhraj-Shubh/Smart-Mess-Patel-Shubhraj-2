import Link from "next/link";

export default function UnknownPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800">Access Denied</h1>
        <p className="mt-4 text-lg text-gray-600 text-center">
          This platform is exclusive to Patel Hall boarders and staff.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-2 text-white  bg-primary hover:bg-primary rounded-full"
        >
          Return to Home
        </Link>
      </div>
    </>
  );
}
