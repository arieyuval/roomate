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

  // Get all matches where this user is involved
  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!matches || matches.length === 0) {
    return NextResponse.json({ matches: [] });
  }

  // Get the other user's profile for each match
  const otherUserIds = matches.map((m) =>
    m.user1_id === user.id ? m.user2_id : m.user1_id
  );

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", otherUserIds);

  if (profilesError) {
    return NextResponse.json(
      { error: profilesError.message },
      { status: 500 }
    );
  }

  // Combine matches with profiles
  const matchesWithProfiles = matches.map((match) => {
    const otherUserId =
      match.user1_id === user.id ? match.user2_id : match.user1_id;
    const profile = (profiles || []).find((p) => p.user_id === otherUserId);
    return {
      ...match,
      profile,
    };
  });

  return NextResponse.json({ matches: matchesWithProfiles });
}
