import { NextRequest, NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Payload = {
  email?: string;
  password?: string;
  fullName?: string;
  role?: "admin" | "agent" | "client";
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Payload;
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const fullName = String(body.fullName ?? "").trim();
  const role = body.role ?? "client";

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email + password (min 8 chars) are required." },
      { status: 400 },
    );
  }

  if (!fullName) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: roleData, error: roleError } = await supabase.rpc("current_user_role");
  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 403 });
  }
  if (roleData !== "admin") {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY on the server." },
      { status: 500 },
    );
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Unable to create user." },
      { status: 400 },
    );
  }

  // Ensure profile exists + set desired role.
  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: created.user.id,
      full_name: fullName,
      email,
      role,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    return NextResponse.json(
      { error: `User created, but profile failed: ${profileError.message}` },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, userId: created.user.id });
}

