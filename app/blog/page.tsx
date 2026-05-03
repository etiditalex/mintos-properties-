import Link from "next/link";
import { Metadata } from "next";

import { getPublishedBlogPosts } from "@/services/blogService";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on coastal Kenya real estate, land, and property investment.",
};

function formatPostDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <section>
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-zinc-200 text-black">
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white to-white" />
        <div className="relative mx-auto flex min-h-[14rem] w-full max-w-[88rem] items-end px-6 pb-10 sm:min-h-[16rem] sm:px-10 lg:min-h-[18rem] lg:px-14">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-brand">Journal</p>
            <h1 className="text-4xl font-semibold text-black sm:text-5xl">Blog</h1>
            <div className="h-[3px] w-12 bg-brand" />
            <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
              Market notes, buying tips, and updates from Mintos Properties.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-10">
        {posts.length === 0 ? (
          <p className="text-center text-sm text-zinc-600">
            No articles yet. Check back soon.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {posts.map((post) => (
              <li key={post.id} className="py-8 first:pt-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                  {formatPostDate(post.created_at)}
                </p>
                <Link href={`/blog/${post.slug}`} className="group mt-2 block">
                  <h2 className="text-2xl font-semibold text-black transition group-hover:text-brand">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600">{post.excerpt}</p>
                  ) : null}
                  <span className="mt-3 inline-block text-sm font-semibold text-brand">Read more →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
