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
    const emailjsServiceId = process.env.EMAILJS_SERVICE_ID;
    const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
    const emailjsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      return Response.json(
        { error: "EmailJS not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY env vars." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        accessToken: emailjsPrivateKey,
        template_params: {
          to_email: invitedEmail,
          to_name: invitedEmail.split("@")[0],
          from_name: ownerName,
          role: role,
          accept_url: acceptUrl,
          workspace_name: `${ownerName}'s Workspace`,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("EmailJS error:", response.status, text);
      return Response.json({ error: text || "Email sending failed" }, { status: 500 });
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
