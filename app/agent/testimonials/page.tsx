"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { MessageSquareQuote, Pencil, RefreshCw, Trash2 } from "lucide-react";

import { AgentPageHeader } from "@/components/admin/AgentPageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";

type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];

const TESTIMONIAL_STORAGE_BUCKET = "property-images";
const TESTIMONIAL_STORAGE_PREFIX = "testimonials";

async function uploadTestimonialPhoto(file: File, testimonialId: string): Promise<string> {
  const supabase = createSupabaseBrowserClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${TESTIMONIAL_STORAGE_PREFIX}/${testimonialId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(TESTIMONIAL_STORAGE_BUCKET)
    .upload(path, file, { upsert: false });
  if (uploadError) {
    throw new Error(uploadError.message);
  }
  const { data } = supabase.storage.from(TESTIMONIAL_STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function TestimonialEditModal({
  row,
  onClose,
  onSaved,
}: {
  row: TestimonialRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [quote, setQuote] = useState(row.quote);
  const [authorName, setAuthorName] = useState(row.author_name);
  const [imageUrl, setImageUrl] = useState(row.author_image_url ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [published, setPublished] = useState(row.published);
  const [displayOrder, setDisplayOrder] = useState(String(row.display_order));
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!photoFile) {
      setFilePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const previewSrc =
    filePreviewUrl ?? (imageUrl.trim() || row.author_image_url || null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setLocalError(null);
    const orderNum = Number(displayOrder);
    if (Number.isNaN(orderNum)) {
      setLocalError("Display order must be a number.");
      setSaving(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const trimmedUrl = imageUrl.trim();
      let author_image_url: string | null = trimmedUrl ? trimmedUrl : null;
      if (photoFile) {
        author_image_url = await uploadTestimonialPhoto(photoFile, row.id);
      }
      const { error: updateError } = await supabase
        .from("testimonials")
        .update({
          quote: quote.trim(),
          author_name: authorName.trim(),
          author_image_url,
          published,
          display_order: orderNum,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      if (updateError) {
        setLocalError(updateError.message);
        setSaving(false);
        return;
      }
      setPhotoFile(null);
      onSaved();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Unable to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Edit testimonial"
      panelClassName="max-h-[90vh] max-w-2xl overflow-y-auto"
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm text-zinc-700" htmlFor="edit_quote">
          <span className="font-medium">Quote</span>
          <textarea
            id="edit_quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
            rows={6}
            className="rounded-sm border border-zinc-300 p-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <Input
          id="edit_author"
          label="Client name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
        {previewSrc && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full border border-zinc-200 bg-zinc-50 object-cover"
            />
            <p className="text-xs text-zinc-500">Preview of client photo</p>
          </div>
        )}
        <label className="grid gap-2 text-sm text-zinc-700" htmlFor="edit_photo_file">
          <span className="font-medium">Photo from device (optional)</span>
          <input
            id="edit_photo_file"
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="rounded-sm border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition-colors file:mr-3 file:rounded-sm file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/15 focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
          />
          <span className="text-xs font-normal text-zinc-500">
            Upload saves to storage and replaces the URL below for this testimonial.
          </span>
        </label>
        <Input
          id="edit_image"
          label="Or photo URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
        />
        <Input
          id="edit_order"
          label="Display order"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand"
          />
          Published (show on homepage)
        </label>
        {localError && <p className="text-sm text-red-600">{localError}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function AgentTestimonialsPage() {
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editTarget, setEditTarget] = useState<TestimonialRow | null>(null);

  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [published, setPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("0");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: queryError } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
        return;
      }
      setRows((data as TestimonialRow[]) ?? []);
    } catch {
      setError("Unable to load testimonials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError(null);
    const orderNum = Number(displayOrder);
    if (Number.isNaN(orderNum)) {
      setError("Display order must be a number.");
      setCreating(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const trimmedUrl = imageUrl.trim();
      const { data: inserted, error: insertError } = await supabase
        .from("testimonials")
        .insert({
          quote: quote.trim(),
          author_name: authorName.trim(),
          author_image_url: photoFile ? null : trimmedUrl ? trimmedUrl : null,
          published,
          display_order: orderNum,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setCreating(false);
        return;
      }

      if (photoFile && inserted?.id) {
        try {
          const publicUrl = await uploadTestimonialPhoto(photoFile, inserted.id);
          const { error: patchError } = await supabase
            .from("testimonials")
            .update({ author_image_url: publicUrl })
            .eq("id", inserted.id);
          if (patchError) {
            setError(
              `Testimonial saved, but photo upload failed: ${patchError.message}. You can edit the entry to add a photo.`,
            );
          }
        } catch (uploadErr) {
          setError(
            uploadErr instanceof Error ?
              `Testimonial saved, but photo failed: ${uploadErr.message}`
            : "Testimonial saved, but photo upload failed.",
          );
        }
      }

      setQuote("");
      setAuthorName("");
      setImageUrl("");
      setPhotoFile(null);
      setPublished(true);
      setDisplayOrder("0");
      await load();
    } catch {
      setError("Unable to create testimonial.");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await load();
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-8">
      {editTarget && (
        <TestimonialEditModal
          key={editTarget.id}
          row={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            void load();
            setEditTarget(null);
          }}
        />
      )}

      <AgentPageHeader
        title="Testimonials"
        breadcrumb="Dashboard / Testimonials"
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
            <MessageSquareQuote className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">New entry</p>
            <h2 className="text-lg font-bold text-slate-900">Add testimonial</h2>
          </div>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onCreate}>
          <label className="grid gap-2 text-sm text-zinc-700 md:col-span-2" htmlFor="new_quote">
            <span className="font-medium">Quote</span>
            <textarea
              id="new_quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
              rows={5}
              className="rounded-sm border border-zinc-300 p-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <Input
            id="new_author"
            label="Client name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
          <label className="grid gap-2 text-sm text-zinc-700" htmlFor="new_photo_file">
            <span className="font-medium">Photo from device (optional)</span>
            <input
              id="new_photo_file"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="rounded-sm border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition-colors file:mr-3 file:rounded-sm file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/15 focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <Input
            id="new_image"
            label="Or photo URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
          />
          <Input
            id="new_order"
            label="Display order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-zinc-700 md:col-span-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand"
            />
            Published (show on homepage)
          </label>
          <Button type="submit" className="md:col-span-2" disabled={creating}>
            {creating ? "Adding…" : "Add testimonial"}
          </Button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">All testimonials</h3>
          <p className="mt-1 text-sm text-slate-500">
            Lower display order appears first in the carousel. Only published items appear on the public site.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Preview</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                  <td className="px-4 py-3 tabular-nums text-slate-600">{row.display_order}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.author_name}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-600">{row.quote}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.published
                          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                      }`}
                    >
                      {row.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditTarget(row)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(row.id)}
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
        {!loading && rows.length === 0 && (
          <div className="border-t border-slate-100 px-6 py-12 text-center text-sm text-slate-500">
            No testimonials yet. Add one above.
          </div>
        )}
        {loading && (
          <div className="border-t border-slate-100 px-6 py-12 text-center text-sm text-slate-500">
            Loading…
          </div>
        )}
      </div>
    </div>
  );
}
