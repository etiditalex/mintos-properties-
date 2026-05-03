"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Pencil, RefreshCw, Trash2 } from "lucide-react";

import { AgentPageHeader } from "@/components/admin/AgentPageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";

type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatTableDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function BlogEditModal({
  post,
  onClose,
  onSaved,
}: {
  post: BlogPostRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [body, setBody] = useState(post.body);
  const [published, setPublished] = useState(post.published);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setLocalError(null);
    const finalSlug = (slug.trim() || slugify(title)).replace(/^-+|-+$/g, "");
    if (!finalSlug) {
      setLocalError("Add a title or slug for the article URL.");
      setSaving(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          title: title.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim() || null,
          body: body.trim(),
          published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (updateError) {
        setLocalError(updateError.message);
        setSaving(false);
        return;
      }
      onSaved();
    } catch {
      setLocalError("Unable to save article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Edit article"
      panelClassName="max-h-[90vh] max-w-2xl overflow-y-auto"
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        <Input id="edit_title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input
          id="edit_slug"
          label="URL slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Auto from title if empty"
        />
        <label className="grid gap-2 text-sm text-zinc-700" htmlFor="edit_excerpt">
          <span className="font-medium">Excerpt (optional)</span>
          <textarea
            id="edit_excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="rounded-sm border border-zinc-300 p-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="grid gap-2 text-sm text-zinc-700" htmlFor="edit_body">
          <span className="font-medium">Body</span>
          <textarea
            id="edit_body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={12}
            className="rounded-sm border border-zinc-300 p-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand"
          />
          Published (visible on public blog)
        </label>
        {localError && <p className="text-sm text-red-600">{localError}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function AgentBlogsPage() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editTarget, setEditTarget] = useState<BlogPostRow | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: queryError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
        return;
      }
      setPosts((data as BlogPostRow[]) ?? []);
    } catch {
      setError("Unable to load articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  };

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Sign in to create articles.");
        setCreating(false);
        return;
      }

      const finalSlug = (slug.trim() || slugify(title)).replace(/^-+|-+$/g, "");
      if (!title.trim() || !finalSlug) {
        setError("Title and URL slug are required.");
        setCreating(false);
        return;
      }

      const { error: insertError } = await supabase.from("blog_posts").insert({
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim() || null,
        body: body.trim(),
        published,
        author_id: user.id,
      });

      if (insertError) {
        setError(insertError.message);
        setCreating(false);
        return;
      }

      setTitle("");
      setSlug("");
      setSlugManual(false);
      setExcerpt("");
      setBody("");
      setPublished(false);
      await load();
    } catch {
      setError("Unable to create article.");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this article permanently?")) return;
    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await load();
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-8">
      {editTarget && (
        <BlogEditModal
          key={editTarget.id}
          post={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            void load();
            setEditTarget(null);
          }}
        />
      )}

      <AgentPageHeader
        title="Blog"
        breadcrumb="Dashboard / Blog"
        actions={
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:bg-brand/15"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <BookOpen className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">New article</p>
            <h2 className="text-lg font-bold text-slate-900">Write a post</h2>
          </div>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onCreate}>
          <div className="md:col-span-2">
            <Input
              id="new_title"
              label="Title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
            />
          </div>
          <Input
            id="new_slug"
            label="URL slug"
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            placeholder="Auto from title if empty"
          />
          <label className="flex items-center gap-2 text-sm text-zinc-700 md:col-span-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand"
            />
            Published
          </label>
          <label className="grid gap-2 text-sm text-zinc-700 md:col-span-2" htmlFor="new_excerpt">
            <span className="font-medium">Excerpt (optional)</span>
            <textarea
              id="new_excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="rounded-sm border border-zinc-300 p-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="grid gap-2 text-sm text-zinc-700 md:col-span-2" htmlFor="new_body">
            <span className="font-medium">Body</span>
            <textarea
              id="new_body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={10}
              className="rounded-sm border border-zinc-300 p-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <Button type="submit" className="md:col-span-2" disabled={creating}>
            {creating ? "Publishing…" : "Create article"}
          </Button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">All articles</h3>
          <p className="mt-1 text-sm text-slate-500">Edit, delete, or draft posts. Only published posts appear on the site.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        post.published
                          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatTableDate(post.updated_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {post.published ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-emerald-100 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
                        >
                          View
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setEditTarget(post)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(post.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && posts.length === 0 && (
          <div className="border-t border-slate-100 px-6 py-12 text-center text-sm text-slate-500">
            No articles yet. Create one above.
          </div>
        )}
        {loading && (
          <div className="border-t border-slate-100 px-6 py-12 text-center text-sm text-slate-500">
            Loading articles…
          </div>
        )}
      </div>
    </div>
  );
}
