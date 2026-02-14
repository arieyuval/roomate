import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all user IDs this user has passed on
  const { data: passedSwipes, error: swipeError } = await supabase
    .from("swipes")
    .select("swiped_id")
    .eq("swiper_id", user.id)
    .eq("action", "pass");

  if (swipeError) {
    return NextResponse.json({ error: swipeError.message }, { status: 500 });
  }

  const passedIds = (passedSwipes || []).map((s) => s.swiped_id);

  if (passedIds.length === 0) {
    return NextResponse.json({ profiles: [] });
  }

  // Fetch those profiles
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", passedIds)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ profiles: profiles || [] });
}
