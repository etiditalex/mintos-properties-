import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as BlogPostRow[];
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as BlogPostRow;
}
