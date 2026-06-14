import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-zor-paper px-6 text-center">
      <div className="max-w-lg">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-zor-blue">
          ZOR Professional
        </p>
        <h1 className="mt-5 text-4xl font-semibold text-zor-blue-deep">Page not found</h1>
        <p className="mt-4 text-zor-muted">
          The page does not exist yet or the slug is not part of the mock content.
        </p>
        <Link
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-zor-blue px-5 text-sm font-semibold text-white"
          href="/hr"
        >
          Return to homepage
        </Link>
      </div>
    </main>
  );
}
