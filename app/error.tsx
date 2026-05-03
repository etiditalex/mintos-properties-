"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-brand">Error</p>
      <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-black sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
        This page couldn&apos;t load correctly. You can try again, or return to the homepage.
      </p>
      {process.env.NODE_ENV === "development" && error.message ? (
        <p className="mt-4 max-w-lg break-words font-mono text-xs text-zinc-500">{error.message}</p>
      ) : null}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-700 underline-offset-4 hover:text-brand hover:underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
