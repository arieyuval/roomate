import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const gender = searchParams.get("gender");
  const maxPrice = searchParams.get("max_price");
  const major = searchParams.get("major");
  const sameGenderPref = searchParams.get("same_gender_pref");
  const jobType = searchParams.get("job_type");
  const moveInDate = searchParams.get("move_in_date");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  // Get IDs the user has already swiped on
  const { data: swipedData } = await supabase
    .from("swipes")
    .select("swiped_id")
    .eq("swiper_id", user.id);

  const swipedIds = (swipedData || []).map((s) => s.swiped_id);
  const excludeIds = [user.id, ...swipedIds];

  // Build query
  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .not("user_id", "in", `(${excludeIds.join(",")})`)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply filters
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }
  if (gender) {
    query = query.eq("gender", gender);
  }
  if (maxPrice) {
    query = query.lte("max_price", parseInt(maxPrice));
  }
  if (major) {
    query = query.ilike("major", `%${major}%`);
  }
  if (sameGenderPref) {
    query = query.eq("same_gender_pref", sameGenderPref);
  }
  if (jobType) {
    query = query.eq("job_type", jobType);
  }
  if (moveInDate) {
    query = query.eq("move_in_date", moveInDate);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    profiles: data || [],
    total: count || 0,
    page,
    limit,
  });
}
