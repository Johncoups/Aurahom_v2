"use server";

import { sendEmail } from "@/lib/email";
import { ensureProjectVendor, findExistingBidRequest } from "@/lib/bids";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateBidRequestEmailContent } from "@/app/actions/prepareEmailDraft";
import type { EmailDraftContext } from "@/app/actions/prepareEmailDraft";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Aurahom <onboarding@resend.dev>";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ensure a vendor exists for the user (by email); create if missing. Returns vendor id. */
export async function ensureVendorForUser(
  userId: string,
  vendor: { name: string; email: string }
): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { name, email } = vendor;
  if (!email?.trim()) return { success: false, error: "Vendor email is required." };

  const { data: existing } = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", userId)
    .eq("email", email.trim())
    .limit(1)
    .maybeSingle();

  if (existing?.id) return { success: true, vendorId: existing.id };

  const { data: inserted, error } = await supabase
    .from("vendors")
    .insert({ user_id: userId, name: name || email, email: email.trim() })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, vendorId: inserted?.id };
}

export interface SendBidRequestViaAurahomParams {
  projectId: string;
  userId: string;
  vendorId: string;
  phaseIds: string[];
  scopeTitle?: string;
  scopeDescription?: string;
  /** When provided, subject and body are AI-generated (like Prepare Email Draft). Otherwise use subject + bodyHtml. */
  draftContext?: EmailDraftContext;
  subject: string;
  bodyHtml: string;
  /** Optional: trade_category_id from vendors or phase */
  tradeCategoryId?: string | null;
}

export interface SendBidRequestViaAurahomResult {
  success: boolean;
  bidRequestId?: string;
  error?: string;
}

/**
 * Send a single bid request via Aurahom (platform sends email).
 * Creates bid_request + email_communications rows and sends email via Resend.
 */
export async function sendBidRequestViaAurahom(
  params: SendBidRequestViaAurahomParams
): Promise<SendBidRequestViaAurahomResult> {
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
  } = params;

  let subject: string;
  let bodyHtml: string;
  if (draftContext) {
    const generated = await generateBidRequestEmailContent(draftContext);
    subject = generated.subject;
    bodyHtml = generated.bodyHtml;
  } else {
    subject = paramSubject;
    bodyHtml = paramBodyHtml;
  }

  const supabase = await createServerSupabaseClient();

  // 1. Fetch vendor (need email)
  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select("id, name, email")
    .eq("id", vendorId)
    .single();

  if (vendorError || !vendor) {
    return { success: false, error: "Vendor not found or not accessible." };
  }
  if (!vendor.email?.trim()) {
    return { success: false, error: "Vendor has no email address." };
  }

  // 2. Idempotency check: don't create duplicate bid requests for same scope
  const existingResult = await findExistingBidRequest({
    projectId,
    vendorId,
    phaseIds,
    scopeTitle: scopeTitle ?? undefined,
  });
  if (existingResult.bidRequest) {
    // Return existing request instead of creating duplicate
    return {
      success: true,
      bidRequestId: existingResult.bidRequest.id,
      error: undefined,
    };
  }

  // 3. Ensure vendor is on the project (project_vendors) — Workflow 2 A
  const ensured = await ensureProjectVendor(projectId, vendorId, userId);
  if (!ensured.success) {
    return { success: false, error: ensured.error ?? "Could not add vendor to project." };
  }

  // 4. Create bid_request (request_method = 'aurahom')
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
      status: "pending",
      request_method: "aurahom",
      message_sent: bodyHtml,
      email_subject: subject,
      requested_at: new Date().toISOString(),
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

  // 5. Send email via Resend
  const emailResult = await sendEmail({
    to: vendor.email,
    subject,
    html: bodyHtml,
  });

  // 6. Record email_communications (send_method = 'aurahom')
  const commStatus = emailResult.success ? "sent" : "failed";
  const now = new Date().toISOString();
  await supabase.from("email_communications").insert({
    bid_request_id: bidRequestId,
    project_id: projectId,
    user_id: userId,
    vendor_id: vendorId,
    email_type: "bid_request",
    from_email: FROM_EMAIL,
    to_email: vendor.email,
    subject,
    body_html: bodyHtml,
    send_method: "aurahom",
    status: commStatus,
    ...(emailResult.success ? { sent_at: now } : {}),
    ...(emailResult.success && emailResult.messageId ? { message_id: emailResult.messageId } : {}),
    ...(!emailResult.success && emailResult.error ? { error_message: emailResult.error } : {}),
  });

  if (!emailResult.success) {
    return {
      success: false,
      bidRequestId,
      error: emailResult.error || "Email failed to send.",
    };
  }

  return { success: true, bidRequestId };
}
