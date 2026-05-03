"use client";

import { useEffect } from "react";

import "./globals.css";

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen bg-white antialiased text-black">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">Error</p>
          <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
            Please refresh the page or try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-10 inline-flex items-center justify-center rounded-sm bg-brand px-5 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
