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

  const { title, description } = await request.json();

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json(
      { error: "Bug reporting is not configured" },
      { status: 500 }
    );
  }

  const body = [
    `**Reported by:** ${user.email}`,
    "",
    description || "_No additional details provided._",
  ].join("\n");

  const res = await fetch(
    "https://api.github.com/repos/arieyuval/roomate/issues",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `[Bug] ${title.trim()}`,
        body,
        labels: ["bug"],
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to submit bug report" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
