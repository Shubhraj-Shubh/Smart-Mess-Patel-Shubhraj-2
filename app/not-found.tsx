import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Oops! It looks like you&apos;ve stumbled upon a page that doesn&apos;t exist. Let&apos;s simplify things and get you back on track.
        </p>
        <Link
          href="/"
          className="text-primary hover:text-white hover:bg-primary border border-primary rounded-lg px-6 py-2 transition-all duration-300"
        >
          Go back to the homepage
        </Link>
      </div>
    </>
  );
}