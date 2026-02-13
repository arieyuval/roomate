import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const profileData = {
    user_id: user.id,
    name: body.name,
    age: body.age,
    major: body.major || null,
    gender: body.gender || null,
    location: body.location,
    region: body.region || null,
    same_gender_pref: body.same_gender_pref || "no_preference",
    max_price: body.max_price || null,
    move_in_date: body.move_in_date || null,
    job_type: body.job_type || null,
    bio: body.bio || null,
    contact_info: body.contact_info || null,
    photo_urls: body.photo_urls || [],
    is_active: body.is_active ?? true,
  };

  // Upsert: create or update
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileData, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
