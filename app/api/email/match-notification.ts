import { getResend } from "@/lib/resend";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";

export async function sendMatchEmail(user1Id: string, user2Id: string) {
  const admin = createAdminSupabaseClient();

  // Fetch both users' emails from auth.users (requires service role)
  const [{ data: auth1 }, { data: auth2 }] = await Promise.all([
    admin.auth.admin.getUserById(user1Id),
    admin.auth.admin.getUserById(user2Id),
  ]);

  const email1 = auth1?.user?.email;
  const email2 = auth2?.user?.email;

  if (!email1 && !email2) return;

  // Fetch both profiles for names
  const { data: profiles } = await admin
    .from("profiles")
    .select("user_id, name")
    .in("user_id", [user1Id, user2Id]);

  const getName = (uid: string) =>
    profiles?.find((p: { user_id: string; name: string }) => p.user_id === uid)?.name || "A Husky";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const buildHtml = (recipientName: string, matchName: string) => `
    <div style="font-family: 'Open Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9fafb;">
      <div style="background: #4B2E83; border-radius: 16px 16px 0 0; padding: 32px 24px; text-align: center;">
        <h1 style="color: #FFC700; font-size: 28px; margin: 0;">It's a Match!</h1>
      </div>
      <div style="background: white; border-radius: 0 0 16px 16px; padding: 32px 24px; text-align: center;">
        <p style="color: #374151; font-size: 16px; margin: 0 0 8px;">
          Hey ${recipientName}!
        </p>
        <p style="color: #6b7280; font-size: 15px; margin: 0 0 24px;">
          You and <strong style="color: #4B2E83;">${matchName}</strong> both expressed interest in being roommates.
          Head to your matches to start chatting!
        </p>
        <a href="${appUrl}/matches"
          style="display: inline-block; background: #4B2E83; color: white; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
          View Your Matches
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0;">
          Roomate - Find Your Husky Roommate
        </p>
      </div>
    </div>
  `;

  const resend = getResend();
  const fromAddress = process.env.RESEND_FROM_EMAIL || "Roomate <onboarding@resend.dev>";
  const sends = [];

  if (email1) {
    sends.push(
      resend.emails.send({
        from: fromAddress,
        to: email1,
        subject: `You matched with ${getName(user2Id)}!`,
        html: buildHtml(getName(user1Id), getName(user2Id)),
      })
    );
  }

  if (email2) {
    sends.push(
      resend.emails.send({
        from: fromAddress,
        to: email2,
        subject: `You matched with ${getName(user1Id)}!`,
        html: buildHtml(getName(user2Id), getName(user1Id)),
      })
    );
  }

  await Promise.allSettled(sends);
}
