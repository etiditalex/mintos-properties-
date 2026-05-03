import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublishedPostBySlug } from "@/services/blogService";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.excerpt ?? post.title,
  };
}

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

export default async function BlogArticlePage({ params }: Props) {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="pb-16">
      <div className="border-b border-zinc-200 bg-gradient-to-b from-[#faf8f5] to-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10">
          <Link
            href="/blog"
            className="text-sm font-medium text-brand transition hover:text-brand-muted"
          >
            ← Back to blog
          </Link>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            {formatPostDate(post.created_at)}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-black sm:text-4xl">{post.title}</h1>
          {post.excerpt ? <p className="mt-4 text-lg text-zinc-600">{post.excerpt}</p> : null}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 lg:px-10">
        <div className="whitespace-pre-wrap text-base leading-relaxed text-zinc-800">{post.body}</div>
      </div>
    </article>
  );
}
