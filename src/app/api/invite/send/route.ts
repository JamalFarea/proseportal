import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { invitedEmail, ownerName, role, inviteId } = await request.json();

    if (!invitedEmail || !ownerName || !role || !inviteId) {
      return Response.json(
        { error: "Missing required fields: invitedEmail, ownerName, role, inviteId" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://proseportal.vercel.app";
    const acceptUrl = `${baseUrl}/login?accept_invite=${inviteId}`;

    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: invitedEmail,
      subject: `${ownerName} invited you to ProsePortal`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="background: #000; color: #fff; padding: 12px 16px; margin-bottom: 24px;">
            <span style="font-weight: 800; font-size: 18px; letter-spacing: -0.02em;">ProsePortal</span>
          </div>
          <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">
            You're invited to collaborate
          </h1>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            <strong>${ownerName}</strong> has invited you to their workspace as
            <strong style="text-transform: uppercase; font-size: 11px;">${role}</strong>.
          </p>
          <a href="${acceptUrl}"
             style="display: inline-block; background: #000; color: #fff; padding: 12px 32px;
                    text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.05em;
                    text-transform: uppercase;">
            Accept Invitation
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
            If you don't have an account, you'll be prompted to create one when you sign in.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Invite email error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
