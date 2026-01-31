"use server";

import { generateText } from "@/lib/openai";
import { OPENAI_MODELS } from "@/lib/openai";
import type { OnboardingProfile } from "@/lib/roadmap-types";

export interface EmailDraftContext {
  projectProfile?: OnboardingProfile;
  phaseTitle: string;
  subPhaseTitle: string;
  vendorName: string;
  vendorEmail: string;
  vendorContactName?: string;
  constructionMethod?: string;
  location?: string;
  houseSize?: number;
  foundationType?: string;
  numberOfStories?: number;
  targetStartDate?: string;
  budgetRange?: string;
}

interface Question {
  id: string;
  question: string;
  type: "text" | "date" | "number" | "select" | "multi-select";
  options?: string[];
  required: boolean;
  category: "timeline" | "scope" | "budget" | "requirements" | "preferences";
}

interface EmailDraftSession {
  questions: Question[];
  answers: Record<string, string | string[]>;
  currentQuestionIndex: number;
  isComplete: boolean;
  generatedDraft?: string;
  identifiedPitfalls?: string[];
}

/**
 * Generate initial questions for the email draft based on context
 */
export async function generateInitialQuestions(
  context: EmailDraftContext
): Promise<Question[]> {
  const prompt = `You are an expert construction project consultant helping a homeowner prepare a professional bid request email.

PROJECT CONTEXT:
- Phase: ${context.phaseTitle}
- Sub-Phase: ${context.subPhaseTitle}
- Vendor: ${context.vendorName}
- Construction Method: ${context.constructionMethod || "Not specified"}
- Location: ${context.location || "Not specified"}
- House Size: ${context.houseSize ? `${context.houseSize} sq ft` : "Not specified"}
- Foundation Type: ${context.foundationType || "Not specified"}
- Number of Stories: ${context.numberOfStories || "Not specified"}
- Target Start Date: ${context.targetStartDate || "Not specified"}
- Budget Range: ${context.budgetRange || "Not specified"}

YOUR TASK:
Generate 5-8 targeted questions that will help create a comprehensive, professional bid request email. Focus on:
1. Missing critical information that could cause problems
2. Phase-specific requirements
3. Timeline and scheduling needs
4. Budget expectations (OPTIONAL - see guidance below)
5. Special requirements or constraints
6. Common pitfalls for this phase/construction method

IMPORTANT BUDGET GUIDANCE:
- Budget questions should ALWAYS be optional (required: false)
- If you include a budget question, frame it as a "budget range" or "target budget range"
- Explain that budget disclosure is optional and helps ensure alignment
- Do NOT ask for exact budget amounts - use ranges instead
- Example: "What is your target budget range for this phase? (Optional - helps ensure we're aligned)"

QUESTION FORMAT:
Return a JSON array of question objects. Each question should have:
- id: unique identifier (e.g., "timeline_start", "scope_details", "budget_range")
- question: the question text (clear, concise, professional)
- type: "text" | "date" | "number" | "select" | "multi-select"
- options: array of options (only for select/multi-select types)
- required: boolean (MUST be false for budget questions, true only for critical non-budget questions)
- category: "timeline" | "scope" | "budget" | "requirements" | "preferences"
- helpText: optional string with guidance (especially important for budget questions)

PRIORITIZE:
- Questions that identify potential pitfalls or missing information
- Questions specific to ${context.subPhaseTitle} work
- Questions that help vendors provide accurate bids
- Questions that prevent common misunderstandings

Return ONLY valid JSON array, no additional text.`;

  try {
    const response = await generateText(
      prompt,
      OPENAI_MODELS.GPT4O, // Use gpt-4o for better reasoning
      { temperature: 0.3, maxTokens: 2048 }
    );

    // Parse the JSON response
    const questions = JSON.parse(response) as Question[];
    
    // Validate and return
    if (Array.isArray(questions) && questions.length > 0) {
      return questions;
    }
    
    // Fallback to default questions if parsing fails
    return getDefaultQuestions(context);
  } catch (error) {
    console.error("Error generating questions:", error);
    return getDefaultQuestions(context);
  }
}

/**
 * Generate follow-up questions based on previous answers
 */
export async function generateFollowUpQuestions(
  context: EmailDraftContext,
  previousAnswers: Record<string, string | string[]>,
  currentQuestions: Question[]
): Promise<Question[]> {
  const answersSummary = Object.entries(previousAnswers)
    .map(([key, value]) => {
      const question = currentQuestions.find(q => q.id === key);
      return `Q: ${question?.question || key}\nA: ${Array.isArray(value) ? value.join(", ") : value}`;
    })
    .join("\n\n");

  const prompt = `You are an expert construction project consultant. Based on the user's answers, generate 2-4 follow-up questions to clarify important details or identify potential issues.

PROJECT CONTEXT:
- Work Scope: ${context.subPhaseTitle} (part of ${context.phaseTitle})
- Construction Method: ${context.constructionMethod || "Not specified"}

PREVIOUS ANSWERS:
${answersSummary}

YOUR TASK:
Generate follow-up questions that:
1. Clarify ambiguous answers
2. Identify potential problems or missing information
3. Help ensure the bid request is complete and accurate
4. Address phase-specific concerns

Return a JSON array of question objects with the same format as before. Return ONLY valid JSON array, no additional text.`;

  try {
    const response = await generateText(
      prompt,
      OPENAI_MODELS.GPT4O,
      { temperature: 0.3, maxTokens: 1024 }
    );

    const questions = JSON.parse(response) as Question[];
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return [];
  }
}

/**
 * Generate the final email draft based on all collected information
 */
export async function generateEmailDraft(
  context: EmailDraftContext,
  answers: Record<string, string | string[]>,
  questions: Question[]
): Promise<{ draft: string; pitfalls: string[] }> {
  const answersSummary = questions
    .map(q => {
      const answer = answers[q.id];
      if (!answer) return null;
      return `Q: ${q.question}\nA: ${Array.isArray(answer) ? answer.join(", ") : answer}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const prompt = `You are an expert construction project consultant. Create a professional, comprehensive bid request email based on the collected information.

PROJECT CONTEXT:
- Specific Work Needed: ${context.subPhaseTitle}
- Vendor: ${context.vendorName} (${context.vendorEmail})
${context.vendorContactName ? `- Vendor Contact: ${context.vendorContactName}` : ''}
- Construction Method: ${context.constructionMethod || "Not specified"}
- Location: ${context.location || "Not specified"}
- House Size: ${context.houseSize ? `${context.houseSize} sq ft` : "Not specified"}
- Foundation Type: ${context.foundationType || "Not specified"}
- Number of Stories: ${context.numberOfStories || "Not specified"}

COLLECTED INFORMATION:
${answersSummary}

IMPORTANT DELIVERABLES GUIDANCE:
- If the user selected specific deliverables (like "Detailed Proposal", "Timeline Estimate", "References", "Portfolio/Examples", "Warranty Information", "Insurance Documentation"), you MUST reference those SPECIFIC items in the email
- List the selected deliverables clearly in a sentence (e.g., "We would appreciate a proposal that includes a detailed proposal, timeline estimate, and references from similar projects")
- CRITICAL: Do NOT use generic phrases like "please let us know if you require any additional information" or "if you need any additional information" or "please let us know if you need anything else"
- Instead, be specific about what was already requested: "Please include [list of selected deliverables] in your response" or "We would appreciate a proposal that includes [selected items]"
- If no deliverables were selected, you can still ask for a proposal, but do NOT ask for "additional information"
- The email should be complete and specific - don't leave it open-ended by asking for more information

YOUR TASK:
1. Create a professional, courteous email requesting a bid specifically for ${context.subPhaseTitle}
2. Focus the email on ${context.subPhaseTitle} - this is the specific work you need, NOT the generic phase
3. Do NOT mention "${context.phaseTitle}" in the email body - it's too generic
4. Instead, be specific about ${context.subPhaseTitle} work (e.g., if it's "Concrete Foundation", mention concrete foundation work, flat work if applicable, etc.)
5. Include all relevant project details
6. Include timeline expectations if provided
7. Handle budget information professionally (see BUDGET GUIDANCE below)
8. Reference the SPECIFIC deliverables that were requested in the collected information (e.g., if "Detailed Proposal" was selected, mention it specifically)
9. Do NOT use generic phrases like "please let us know if you require any additional information" - instead, be specific about what you've already requested
10. If specific deliverables were selected, list them clearly (e.g., "We would appreciate a proposal that includes [specific items selected]")
11. Make it easy for the vendor to respond

BUDGET GUIDANCE:
- If budget information was provided, frame it as a "target budget range" or "approximate budget range"
- Use language like "Our target budget range is approximately $X - $Y" or "We're working within a budget range of approximately $X - $Y"
- Emphasize that this is a guideline to ensure alignment, not a hard limit
- If no budget was provided, do NOT mention budget at all
- NEVER state an exact budget amount - always use ranges
- Professional contractors typically don't expect exact budgets, so be diplomatic

EMAIL REQUIREMENTS:
- Professional but friendly tone
- Clear subject line that mentions ${context.subPhaseTitle} specifically
${context.vendorContactName 
  ? `- Use personalized salutation: "Dear ${context.vendorContactName}," or "Dear ${context.vendorContactName} at ${context.vendorName},"`
  : `- Use company salutation: "Dear ${context.vendorName} Team," or "Dear ${context.vendorName},"`}
- Well-organized with proper sections
- Focus on the SPECIFIC work (${context.subPhaseTitle}), not generic phases
- Include a call to action
- Professional closing

IMPORTANT: The email should be about ${context.subPhaseTitle} work specifically. Do not use generic phase titles like "${context.phaseTitle}" in the email body.

PITFALLS IDENTIFICATION:
Also identify 2-4 potential pitfalls or concerns based on the information provided. These should be things the homeowner should be aware of or consider.

CRITICAL: You MUST return ONLY a valid JSON object with this exact structure:
{
  "draft": "the complete email text here",
  "pitfalls": ["pitfall 1", "pitfall 2", "pitfall 3"]
}

IMPORTANT:
- Do NOT include any markdown code blocks
- Do NOT include any explanatory text before or after the JSON
- Do NOT use markdown formatting
- Return ONLY the raw JSON object
- The "draft" field should contain the complete email text
- The "pitfalls" field should be an array of strings

Example of correct response format:
{"draft": "Subject: Bid Request for...\n\nDear [Vendor Name],\n\n...", "pitfalls": ["Consider timeline", "Budget expectations"]}`;

  try {
    console.log("📧 Starting email draft generation...");
    const response = await generateText(
      prompt,
      OPENAI_MODELS.GPT4O,
      { temperature: 0.4, maxTokens: 2048 }
    );

    console.log("📧 Raw AI response received, length:", response.length);
    console.log("📧 Raw response preview:", response.substring(0, 300));

    // Try to extract JSON from the response (handle markdown code blocks or plain JSON)
    let jsonResponse = response.trim();
    
    // Remove markdown code blocks if present
    const jsonMatch = jsonResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonResponse = jsonMatch[1].trim();
      console.log("📧 Extracted JSON from markdown code block");
    }
    
    // Try to find JSON object in the response
    const jsonObjectMatch = jsonResponse.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      jsonResponse = jsonObjectMatch[0];
      console.log("📧 Extracted JSON object from response");
    }

    console.log("📧 Attempting to parse JSON, length:", jsonResponse.length);
    console.log("📧 JSON preview:", jsonResponse.substring(0, 300));

    let result: { draft: string; pitfalls: string[] };
    
    try {
      result = JSON.parse(jsonResponse) as { draft: string; pitfalls: string[] };
      console.log("✅ Successfully parsed JSON response");
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      console.error("❌ Response that failed to parse:", jsonResponse.substring(0, 500));
      
      // If JSON parsing fails, check if the response is just the email text
      // Sometimes the AI might return just the email without JSON wrapper
      if (jsonResponse.includes("Subject:") || jsonResponse.includes("Dear") || jsonResponse.toLowerCase().includes("hello")) {
        console.log("📧 Detected email text without JSON wrapper, using as draft");
        // Looks like it returned just the email, wrap it
        return {
          draft: jsonResponse,
          pitfalls: []
        };
      }
      
      // Last resort: return error with more context
      const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
      console.error("❌ Failed to parse JSON. Full error:", errorMsg);
      throw new Error(`Failed to parse JSON response: ${errorMsg}`);
    }
    
    // Validate the result structure
    if (!result.draft || typeof result.draft !== 'string') {
      console.error("Invalid result structure - missing draft:", result);
      throw new Error("AI response missing email draft");
    }
    
    return {
      draft: result.draft,
      pitfalls: Array.isArray(result.pitfalls) ? result.pitfalls : []
    };
  } catch (error) {
    console.error("Error generating email draft:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Full error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return {
      draft: `I apologize, but I encountered an error generating your email draft: ${errorMessage}. Please try again.`,
      pitfalls: []
    };
  }
}

/**
 * Generate a professional bid request email from context only (no Q&A).
 * Used by "Send via Aurahom" to send draft-quality emails.
 */
export async function generateBidRequestEmailContent(
  context: EmailDraftContext
): Promise<{ subject: string; bodyHtml: string }> {
  const { draft } = await generateEmailDraft(context, {}, []);
  // Draft format: "Subject: ...\n\nBody text..."
  const subjectMatch = draft.match(/^Subject:\s*(.+?)(?:\n|$)/im);
  const subject = subjectMatch ? subjectMatch[1].trim() : "Bid request: " + context.subPhaseTitle;
  let body = draft
    .replace(/^Subject:\s*.+?(?=\n\n|\n$)/im, "")
    .trim()
    .replace(/^\s*\n+/, "");
  if (!body) body = draft.replace(/^Subject:\s*.+?(?=\n|\n\n)/im, "").trim();
  const bodyHtml = "<p>" + body.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>") + "</p>";
  return { subject, bodyHtml };
}

/**
 * Default questions fallback
 */
function getDefaultQuestions(context: EmailDraftContext): Question[] {
  return [
    {
      id: "timeline_start",
      question: "What is your target start date for this phase?",
      type: "date",
      required: true,
      category: "timeline"
    },
    {
      id: "timeline_completion",
      question: "When do you need this phase completed?",
      type: "date",
      required: false,
      category: "timeline"
    },
    {
      id: "scope_details",
      question: "Are there any specific requirements or special considerations for this phase?",
      type: "text",
      required: false,
      category: "scope"
    },
    {
      id: "budget_range",
      question: "What is your target budget range for this phase? (Optional)",
      type: "select",
      options: ["Under $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "$50,000 - $100,000", "$100,000+"],
      required: false,
      category: "budget",
      helpText: "Budget disclosure is optional. Providing a range helps ensure we're aligned, but many contractors prefer to provide their best price without budget influence. Use ranges rather than exact amounts."
    },
    {
      id: "deliverables",
      question: "What deliverables do you expect? (e.g., proposal, timeline, references, portfolio)",
      type: "multi-select",
      options: ["Detailed Proposal", "Timeline Estimate", "References", "Portfolio/Examples", "Warranty Information", "Insurance Documentation"],
      required: false,
      category: "requirements"
    }
  ];
}
