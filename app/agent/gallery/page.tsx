"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Image as ImageIcon, Pencil, RefreshCw, Trash2 } from "lucide-react";

import { AgentPageHeader } from "@/components/admin/AgentPageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";

type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"];

const GALLERY_STORAGE_BUCKET = "property-images";
const GALLERY_STORAGE_PREFIX = "gallery";

async function uploadGalleryImage(file: File, galleryId: string): Promise<string> {
  const supabase = createSupabaseBrowserClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${GALLERY_STORAGE_PREFIX}/${galleryId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(GALLERY_STORAGE_BUCKET)
    .upload(path, file, { upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from(GALLERY_STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function GalleryEditModal({
  row,
  onClose,
  onSaved,
}: {
  row: GalleryRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [caption, setCaption] = useState(row.caption ?? "");
  const [published, setPublished] = useState(row.published);
  const [displayOrder, setDisplayOrder] = useState(String(row.display_order));
  const [imageUrl, setImageUrl] = useState(row.image_url);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
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

  const previewSrc = filePreviewUrl ?? imageUrl;

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
      let nextUrl = imageUrl.trim();
      if (photoFile) {
        nextUrl = await uploadGalleryImage(photoFile, row.id);
      }
      const { error } = await supabase
        .from("gallery_images")
        .update({
          caption: caption.trim() || null,
          published,
          display_order: orderNum,
          image_url: nextUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      if (error) {
        setLocalError(error.message);
        setSaving(false);
        return;
      }
      onSaved();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Unable to save gallery image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Edit gallery image"
      panelClassName="max-h-[90vh] max-w-2xl overflow-y-auto"
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        {previewSrc ? (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewSrc} alt="" className="h-64 w-full object-cover" />
          </div>
        ) : null}

        <label className="grid gap-2 text-sm text-zinc-700" htmlFor="edit_gallery_file">
          <span className="font-medium">Replace image from device (optional)</span>
          <input
            id="edit_gallery_file"
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="rounded-sm border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition-colors file:mr-3 file:rounded-sm file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/15 focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <Input
          id="edit_gallery_url"
          label="Or image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
          required
        />

        <Input
          id="edit_gallery_caption"
          label="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Short description"
        />

        <Input
          id="edit_gallery_order"
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
          Published
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

export default function AgentGalleryPage() {
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editTarget, setEditTarget] = useState<GalleryRow | null>(null);

  const [caption, setCaption] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [published, setPublished] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: queryError } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
        return;
      }
      setRows((data as GalleryRow[]) ?? []);
    } catch {
      setError("Unable to load gallery images.");
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
    if (!photoFile) {
      setError("Choose an image file to upload.");
      setCreating(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: inserted, error: insertError } = await supabase
        .from("gallery_images")
        .insert({
          caption: caption.trim() || null,
          published,
          display_order: orderNum,
          image_url: "pending",
        })
        .select("id")
        .single();

      if (insertError || !inserted?.id) {
        setError(insertError?.message ?? "Unable to create gallery image.");
        setCreating(false);
        return;
      }

      const publicUrl = await uploadGalleryImage(photoFile, inserted.id);
      const { error: patchError } = await supabase
        .from("gallery_images")
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", inserted.id);

      if (patchError) {
        setError(`Uploaded, but failed to save url: ${patchError.message}`);
      }

      setCaption("");
      setDisplayOrder("0");
      setPublished(true);
      setPhotoFile(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create gallery image.");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this gallery image?")) return;
    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await supabase.from("gallery_images").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await load();
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-8">
      {editTarget && (
        <GalleryEditModal
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
        title="Gallery"
        breadcrumb="Dashboard / Gallery"
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
            <ImageIcon className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">New image</p>
            <h2 className="text-lg font-bold text-slate-900">Add to gallery</h2>
          </div>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onCreate}>
          <label className="grid gap-2 text-sm text-zinc-700 md:col-span-2" htmlFor="new_gallery_file">
            <span className="font-medium">Image from device</span>
            <input
              id="new_gallery_file"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="rounded-sm border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition-colors file:mr-3 file:rounded-sm file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/15 focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
              required
            />
          </label>

          <Input
            id="new_gallery_caption"
            label="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Short description"
          />

          <Input
            id="new_gallery_order"
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
            Published
          </label>

          <Button type="submit" className="md:col-span-2" disabled={creating}>
            {creating ? "Adding…" : "Add image"}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">All gallery images</h3>
          <p className="mt-1 text-sm text-slate-500">Upload order controls display on the public site.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Caption</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                  <td className="px-4 py-3 tabular-nums text-slate-600">{row.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="h-12 w-16 overflow-hidden rounded-md bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={row.image_url} alt="" className="h-12 w-16 object-cover" />
                    </div>
                  </td>
                  <td className="max-w-sm truncate px-4 py-3 text-slate-700">{row.caption ?? "—"}</td>
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
          <div className="border-t border-slate-100 px-6 py-14 text-center text-sm text-slate-500">
            No gallery images yet. Add one above.
          </div>
        )}
        {loading && (
          <div className="border-t border-slate-100 px-6 py-14 text-center text-sm text-slate-500">
            Loading…
          </div>
        )}
      </div>
    </div>
  );
}

