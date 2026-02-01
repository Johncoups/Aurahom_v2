/**
 * Email sending for Aurahom (platform-sent bid requests and notifications).
 * Uses Resend when RESEND_API_KEY is set.
 */

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Aurahom <onboarding@resend.dev>"
const FROM_NAME = "Aurahom"

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  /** Optional plain-text fallback */
  text?: string
  /** Optional reply-to (e.g. user's email) */
  replyTo?: string
}

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send a single email via Resend (Aurahom send method).
 * Requires RESEND_API_KEY in env. Use RESEND_FROM_EMAIL for a verified domain (e.g. bids@aurahom.com).
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      success: false,
      error: "RESEND_API_KEY is not set. Add it to .env.local to enable Send via Aurahom.",
    }
  }

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      reply_to: params.replyTo,
    })

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, messageId: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email"
    return { success: false, error: message }
  }
}

// ============================================================================
// BID RECEIVED NOTIFICATION
// ============================================================================

/** Minimal bid shape for notification (avoids importing full Bid from bids.ts) */
export interface BidReceivedNotificationBid {
  id: string
  bid_request_id: string
  project_id: string
  vendor_id: string
  total_amount: number
  notes?: string | null
  submitted_at?: string | null
}

/** User who receives the notification (GC / project owner) */
export interface BidReceivedNotificationUser {
  id: string
  email: string
  full_name?: string | null
}

/** Context for building the notification content */
export interface BidReceivedNotificationContext {
  vendorName: string
  projectName?: string | null
  scopeTitle?: string | null
  /** Optional app URL to link to the bid (e.g. /dashboard?tab=bids) */
  viewBidUrl?: string | null
}

export interface BidReceivedNotificationResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Generate subject and HTML for "bid received" notification email.
 * Used by sendBidReceivedNotification and testable on its own.
 */
export function generateBidReceivedNotificationContent(
  bid: BidReceivedNotificationBid,
  context: BidReceivedNotificationContext
): { subject: string; html: string; text: string } {
  const amount = typeof bid.total_amount === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bid.total_amount)
    : `$${Number(bid.total_amount).toLocaleString()}`
  const scopeLabel = context.scopeTitle?.trim() || context.projectName?.trim() || "your request"
  const subject = `New bid received: ${context.vendorName} – ${amount} for ${scopeLabel}`

  const viewBidLink = context.viewBidUrl?.trim()
    ? `<p><a href="${context.viewBidUrl}" style="color: #2563eb; text-decoration: underline;">View bid in Aurahom</a></p>`
    : ""

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Bid Received</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #111827; margin-bottom: 16px;">New bid received</h2>
  <p><strong>${escapeHtml(context.vendorName)}</strong> submitted a bid for <strong>${amount}</strong> for ${escapeHtml(scopeLabel)}.</p>
  ${bid.notes?.trim() ? `<p><strong>Vendor notes:</strong></p><p style="background: #f3f4f6; padding: 12px; border-radius: 6px;">${escapeHtml(bid.notes)}</p>` : ""}
  ${viewBidLink}
  <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">This notification was sent by Aurahom. You can review and compare bids in your Bids dashboard.</p>
</body>
</html>
`.trim()

  const text = [
    `New bid received: ${context.vendorName} submitted a bid for ${amount} for ${scopeLabel}.`,
    bid.notes?.trim() ? `Vendor notes: ${bid.notes}` : "",
    viewBidLink ? `View bid: ${context.viewBidUrl}` : "",
  ].filter(Boolean).join("\n\n")

  return { subject, html, text }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Send "bid received" notification to the project owner (user) when a vendor submits a bid.
 * Uses Resend and optionally records the email in email_communications.
 * Call this after creating a bid (e.g. from submitBid flow or a server action).
 */
export async function sendBidReceivedNotification(
  bid: BidReceivedNotificationBid,
  user: BidReceivedNotificationUser,
  context: BidReceivedNotificationContext,
  options?: {
    /** If true, insert a row into email_communications (requires Supabase). Default true. */
    recordInDatabase?: boolean
  }
): Promise<BidReceivedNotificationResult> {
  if (!user.email?.trim()) {
    return { success: false, error: "User email is required for notification." }
  }

  const { subject, html, text } = generateBidReceivedNotificationContent(bid, context)

  const emailResult = await sendEmail({
    to: user.email.trim(),
    subject,
    html,
    text,
  })

  const recordInDb = options?.recordInDatabase !== false
  if (recordInDb && (emailResult.success || !emailResult.success)) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase-server")
      const supabase = await createServerSupabaseClient()
      const now = new Date().toISOString()
      await supabase.from("email_communications").insert({
        bid_request_id: bid.bid_request_id,
        project_id: bid.project_id,
        user_id: user.id,
        vendor_id: bid.vendor_id,
        email_type: "bid_received_notification",
        from_email: FROM_EMAIL,
        to_email: user.email.trim(),
        subject,
        body_html: html,
        body_text: text,
        send_method: "aurahom",
        status: emailResult.success ? "sent" : "failed",
        ...(emailResult.success ? { sent_at: now } : {}),
        ...(emailResult.success && emailResult.messageId ? { message_id: emailResult.messageId } : {}),
        ...(!emailResult.success && emailResult.error ? { error_message: emailResult.error } : {}),
      })
    } catch {
      // Non-fatal: notification send result is still returned
    }
  }

  if (!emailResult.success) {
    return { success: false, error: emailResult.error }
  }
  return { success: true, messageId: emailResult.messageId }
}
