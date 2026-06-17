import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Resend } from "resend";

admin.initializeApp();

const resend = new Resend(process.env.RESEND_API_KEY || "");

const APP_URL = process.env.APP_URL || "https://proseportal.vercel.app";
const FROM_EMAIL = process.env.FROM_EMAIL || "notifications@proseportal.vercel.app";

export const onInviteCreated = functions.firestore
  .document("invites/{inviteId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const { invitedEmail, ownerName, role } = data;

    if (!invitedEmail || !ownerName || !role) {
      functions.logger.warn("Missing required invite fields", { inviteId: context.params.inviteId });
      return;
    }

    try {
      const acceptUrl = `${APP_URL}/login?accept_invite=${context.params.inviteId}`;

      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
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
        functions.logger.error("Resend send error", error);
      } else {
        functions.logger.info("Invite email sent", { invitedEmail, inviteId: context.params.inviteId });
      }
    } catch (err) {
      functions.logger.error("Failed to send invite email", err);
    }

    return;
  });
