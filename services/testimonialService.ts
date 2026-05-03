import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type PublicTestimonial = {
  id: string;
  quote: string;
  name: string;
  image: string | null;
};

type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];

export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, quote, author_name, author_image_url")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as Pick<TestimonialRow, "id" | "quote" | "author_name" | "author_image_url">[]).map(
    (row) => ({
      id: row.id,
      quote: row.quote,
      name: row.author_name,
      image: row.author_image_url,
    }),
  );
}
