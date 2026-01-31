/**
 * Email sending for Aurahom (platform-sent bid requests).
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
