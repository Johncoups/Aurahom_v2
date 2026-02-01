"use server";

import { ensureProjectVendor, findExistingBidRequest } from "@/lib/bids";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateBidRequestEmailContent } from "@/app/actions/prepareEmailDraft";
import type { EmailDraftContext } from "@/app/actions/prepareEmailDraft";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Aurahom <onboarding@resend.dev>";

export interface CreateBidRequestManualParams {
  projectId: string;
  userId: string;
  vendorId: string;
  phaseIds: string[];
  scopeTitle?: string;
  scopeDescription?: string;
  /** When provided, subject and body are AI-generated (like Prepare Email Draft). */
  draftContext?: EmailDraftContext;
  /** Pre-generated subject (used if draftContext not provided). */
  subject?: string;
  /** Pre-generated body HTML (used if draftContext not provided). */
  bodyHtml?: string;
  /** Optional: trade_category_id from vendors or phase */
  tradeCategoryId?: string | null;
  /** Optional: due date for the bid request */
  dueDate?: string | null;
  /** If true, save draft to email_communications table (default: true) */
  saveDraft?: boolean;
}

export interface CreateBidRequestManualResult {
  success: boolean;
  bidRequestId?: string;
  /** The email subject for user to copy */
  subject?: string;
  /** The email body (HTML) for user to copy */
  bodyHtml?: string;
  /** Plain text version of the body */
  bodyText?: string;
  /** If an existing request was found (idempotent), this is true */
  existingRequest?: boolean;
  error?: string;
}

/**
 * Create a bid request for the "Manual" send method.
 * The user will copy the generated subject/body and send via their own email client.
 * Optionally stores the draft in email_communications.
 */
export async function createBidRequestManual(
  params: CreateBidRequestManualParams
): Promise<CreateBidRequestManualResult> {
  const {
    projectId,
    userId,
    vendorId,
    phaseIds,
    scopeTitle,
    scopeDescription,
    draftContext,
    subject: paramSubject,
    bodyHtml: paramBodyHtml,
    tradeCategoryId,
    dueDate,
    saveDraft = true,
  } = params;

  // Validate required fields
  if (!projectId?.trim()) {
    return { success: false, error: "Project ID is required." };
  }
  if (!userId?.trim()) {
    return { success: false, error: "User ID is required." };
  }
  if (!vendorId?.trim()) {
    return { success: false, error: "Vendor ID is required." };
  }
  if (!phaseIds?.length) {
    return { success: false, error: "At least one phase ID is required." };
  }

  // Generate email content
  let subject: string;
  let bodyHtml: string;
  if (draftContext) {
    const generated = await generateBidRequestEmailContent(draftContext);
    subject = generated.subject;
    bodyHtml = generated.bodyHtml;
  } else if (paramSubject && paramBodyHtml) {
    subject = paramSubject;
    bodyHtml = paramBodyHtml;
  } else {
    return { success: false, error: "Either draftContext or subject+bodyHtml is required." };
  }

  const supabase = await createServerSupabaseClient();

  // 1. Fetch vendor (need email for draft recipient)
  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select("id, name, email")
    .eq("id", vendorId)
    .single();

  if (vendorError || !vendor) {
    return { success: false, error: "Vendor not found or not accessible." };
  }

  // 2. Idempotency check: don't create duplicate bid requests for same scope
  const existingResult = await findExistingBidRequest({
    projectId,
    vendorId,
    phaseIds,
    scopeTitle: scopeTitle ?? undefined,
  });
  if (existingResult.bidRequest) {
    // Return existing request with the draft content
    return {
      success: true,
      bidRequestId: existingResult.bidRequest.id,
      subject,
      bodyHtml,
      bodyText: htmlToPlainText(bodyHtml),
      existingRequest: true,
    };
  }

  // 3. Ensure vendor is on the project (project_vendors) — Workflow 2 A
  const ensured = await ensureProjectVendor(projectId, vendorId, userId);
  if (!ensured.success) {
    return { success: false, error: ensured.error ?? "Could not add vendor to project." };
  }

  // 4. Create bid_request (request_method = 'manual', status = 'not_requested')
  const { data: bidRequest, error: insertRequestError } = await supabase
    .from("bid_requests")
    .insert({
      project_id: projectId,
      user_id: userId,
      vendor_id: vendorId,
      trade_category_id: tradeCategoryId ?? null,
      phase_ids: phaseIds,
      scope_title: scopeTitle ?? null,
      scope_description: scopeDescription ?? null,
      status: "not_requested", // Manual: user hasn't sent yet
      request_method: "manual",
      message_sent: bodyHtml,
      email_subject: subject,
      due_date: dueDate ?? null,
      // requested_at is null until user confirms they sent it
    })
    .select("id")
    .single();

  if (insertRequestError) {
    return {
      success: false,
      error: insertRequestError.message || "Failed to create bid request.",
    };
  }
  const bidRequestId = bidRequest?.id;
  if (!bidRequestId) {
    return { success: false, error: "Failed to create bid request." };
  }

  // 5. Optionally save draft to email_communications
  if (saveDraft) {
    await supabase.from("email_communications").insert({
      bid_request_id: bidRequestId,
      project_id: projectId,
      user_id: userId,
      vendor_id: vendorId,
      email_type: "bid_request",
      from_email: "user", // Placeholder: user will send from their own email
      to_email: vendor.email ?? "",
      subject,
      body_html: bodyHtml,
      body_text: htmlToPlainText(bodyHtml),
      send_method: "manual",
      status: "draft", // Draft status: user hasn't sent yet
    });
  }

  return {
    success: true,
    bidRequestId,
    subject,
    bodyHtml,
    bodyText: htmlToPlainText(bodyHtml),
    existingRequest: false,
  };
}

/**
 * Mark a manual bid request as sent (user confirmed they sent the email).
 * Updates status to 'pending' and sets requested_at timestamp.
 */
export async function markBidRequestAsSent(
  bidRequestId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (!bidRequestId?.trim()) {
    return { success: false, error: "Bid request ID is required." };
  }

  const supabase = await createServerSupabaseClient();

  // Verify ownership and that it's a manual request
  const { data: existing, error: fetchError } = await supabase
    .from("bid_requests")
    .select("id, user_id, request_method, status")
    .eq("id", bidRequestId.trim())
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "Bid request not found or access denied." };
  }

  if (existing.user_id !== userId) {
    return { success: false, error: "You do not have permission to update this bid request." };
  }

  if (existing.request_method !== "manual") {
    return { success: false, error: "This bid request is not a manual request." };
  }

  if (existing.status !== "not_requested") {
    // Already sent or in another state
    return { success: true };
  }

  const now = new Date().toISOString();

  // Update bid_request status and requested_at
  const { error: updateError } = await supabase
    .from("bid_requests")
    .update({
      status: "pending",
      requested_at: now,
      updated_at: now,
    })
    .eq("id", bidRequestId.trim());

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Update email_communications draft to 'sent'
  await supabase
    .from("email_communications")
    .update({
      status: "sent",
      sent_at: now,
      updated_at: now,
    })
    .eq("bid_request_id", bidRequestId.trim())
    .eq("status", "draft");

  return { success: true };
}

/**
 * Convert HTML to plain text (basic conversion for email body).
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
