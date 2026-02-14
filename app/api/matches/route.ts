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

  // Get the most recent message per match + current user's message counts
  const matchIds = matches.map((m) => m.id);

  const { data: allMessages } = await supabase
    .from("messages")
    .select("*")
    .in("match_id", matchIds)
    .order("created_at", { ascending: false });

  // Build last-message lookup (first message per match_id = most recent)
  const lastMessageMap = new Map();
  for (const msg of allMessages || []) {
    if (!lastMessageMap.has(msg.match_id)) {
      lastMessageMap.set(msg.match_id, msg);
    }
  }

  // Build my-message-count lookup
  const myCountMap = new Map();
  for (const msg of allMessages || []) {
    if (msg.sender_id === user.id) {
      myCountMap.set(msg.match_id, (myCountMap.get(msg.match_id) || 0) + 1);
    }
  }

  // Combine matches with profiles, last messages, and counts
  const matchesWithProfiles = matches.map((match) => {
    const otherUserId =
      match.user1_id === user.id ? match.user2_id : match.user1_id;
    const profile = (profiles || []).find(
      (p: { user_id: string }) => p.user_id === otherUserId
    );
    return {
      ...match,
      profile,
      last_message: lastMessageMap.get(match.id) || null,
      my_message_count: myCountMap.get(match.id) || 0,
    };
  });

  return NextResponse.json({ matches: matchesWithProfiles });
}
