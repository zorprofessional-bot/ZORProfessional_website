import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-zor-paper px-6 text-center">
      <div className="max-w-lg">
        <LogoMark
          className="mx-auto h-16 w-16 rounded-2xl shadow-sm ring-1 ring-inset ring-zor-line"
          imageClassName="p-1"
          priority
          sizes="4rem"
        />
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
