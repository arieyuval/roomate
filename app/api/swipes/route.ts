import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { swiped_id, action } = await request.json();

  if (!swiped_id || !["interested", "pass"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Insert swipe
  const { error: swipeError } = await supabase.from("swipes").insert({
    swiper_id: user.id,
    swiped_id,
    action,
  });

  if (swipeError) {
    // Duplicate swipe
    if (swipeError.code === "23505") {
      return NextResponse.json(
        { error: "Already swiped on this user" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: swipeError.message }, { status: 500 });
  }

  // Check if a match was created (by the DB trigger)
  let matched = false;
  let matchId: string | undefined;

  if (action === "interested") {
    const { data: matchData } = await supabase
      .from("matches")
      .select("id")
      .or(
        `and(user1_id.eq.${user.id},user2_id.eq.${swiped_id}),and(user1_id.eq.${swiped_id},user2_id.eq.${user.id})`
      )
      .single();

    if (matchData) {
      matched = true;
      matchId = matchData.id;
    }
  }

  return NextResponse.json({ success: true, matched, match_id: matchId });
}
