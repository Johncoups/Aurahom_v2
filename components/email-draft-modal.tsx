"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  Loader2, 
  Copy, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Mail,
  HelpCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { 
  generateInitialQuestions, 
  generateFollowUpQuestions, 
  generateEmailDraft 
} from "@/app/actions/prepareEmailDraft";
import type { OnboardingProfile } from "@/lib/roadmap-types";

interface Question {
  id: string;
  question: string;
  type: "text" | "date" | "number" | "select" | "multi-select";
  options?: string[];
  required: boolean;
  category: "timeline" | "scope" | "budget" | "requirements" | "preferences";
  helpText?: string;
}

interface EmailDraftContext {
  projectProfile?: OnboardingProfile;
  phaseTitle: string;
  subPhaseTitle: string;
  vendorId?: string;
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

interface EmailDraftModalProps {
  open: boolean;
  onClose: () => void;
  contexts: EmailDraftContext[];
  onCopyLetter?: (vendorId: string) => void;
}

type Step = "loading-questions" | "answering" | "generating" | "review";

export function EmailDraftModal({ open, onClose, contexts, onCopyLetter }: EmailDraftModalProps) {
  const context = contexts[0];
  const [step, setStep] = useState<Step>("loading-questions");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [emailDrafts, setEmailDrafts] = useState<string[]>([]);
  const [pitfallsPerDraft, setPitfallsPerDraft] = useState<string[][]>([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<Question[]>([]);
  const [copyReminderPending, setCopyReminderPending] = useState<{ vendorId: string; vendorName: string } | null>(null);

  // Load initial questions when modal opens
  useEffect(() => {
    if (open && step === "loading-questions") {
      loadInitialQuestions();
    }
  }, [open]);

  async function loadInitialQuestions() {
    try {
      const initialQuestions = await generateInitialQuestions(context);
      setQuestions(initialQuestions);
      setStep("answering");
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error loading questions:", error);
      // Fallback to empty state or show error
      setStep("answering");
    }
  }

  function handleAnswer(questionId: string, value: string | string[]) {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }

  function handleNext() {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Check if required question is answered
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      return; // Don't advance if required question isn't answered
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, check if we should generate follow-ups
      handleAllQuestionsAnswered();
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }

  async function handleAllQuestionsAnswered() {
    // First, ask if user wants to answer follow-up questions
    try {
      const followUps = await generateFollowUpQuestions(context, answers, questions);
      if (followUps.length > 0) {
        setFollowUpQuestions(followUps);
        setShowFollowUps(true);
      } else {
        // No follow-ups, generate draft directly
        generateDraft();
      }
    } catch (error) {
      console.error("Error generating follow-ups:", error);
      generateDraft();
    }
  }

  async function handleFollowUpNext() {
    const currentQuestion = followUpQuestions[currentQuestionIndex - questions.length];
    
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      return;
    }

    const totalQuestions = questions.length + followUpQuestions.length;
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      generateDraft();
    }
  }

  async function skipFollowUps() {
    setShowFollowUps(false);
    generateDraft();
  }

  async function generateDraft() {
    setStep("generating");
    try {
      const allQuestions = [...questions, ...followUpQuestions];
      const results = await Promise.all(
        contexts.map((ctx) => generateEmailDraft(ctx, answers, allQuestions))
      );
      setEmailDrafts(results.map((r) => r.draft));
      setPitfallsPerDraft(results.map((r) => r.pitfalls));
      setCurrentLetterIndex(0);
      setStep("review");
    } catch (error) {
      console.error("Error generating draft:", error);
      setEmailDrafts(["Error generating email draft. Please try again."]);
      setPitfallsPerDraft([[]]);
      setCurrentLetterIndex(0);
      setStep("review");
    }
  }

  const currentDraft = emailDrafts[currentLetterIndex] ?? "";
  const currentPitfalls = pitfallsPerDraft[currentLetterIndex] ?? [];
  const currentContext = contexts[currentLetterIndex];

  function handleCopyClick() {
    if (currentContext?.vendorId && onCopyLetter) {
      setCopyReminderPending({ vendorId: currentContext.vendorId, vendorName: currentContext.vendorName });
      return;
    }
    doCopy();
  }

  function doCopy() {
    navigator.clipboard.writeText(currentDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyConfirm() {
    if (!copyReminderPending) return;
    doCopy();
    onCopyLetter?.(copyReminderPending.vendorId);
    setCopyReminderPending(null);
  }

  function handleClose() {
    setStep("loading-questions");
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setEmailDrafts([]);
    setPitfallsPerDraft([]);
    setCurrentLetterIndex(0);
    setCopied(false);
    setShowFollowUps(false);
    setFollowUpQuestions([]);
    setCopyReminderPending(null);
    onClose();
  }

  function getCurrentQuestion(): Question | null {
    if (showFollowUps && currentQuestionIndex >= questions.length) {
      return followUpQuestions[currentQuestionIndex - questions.length];
    }
    return questions[currentQuestionIndex] || null;
  }

  function validateDateLogic(): { isValid: boolean; error?: string } {
    // Find start date and completion date questions
    const startDateQuestion = [...questions, ...followUpQuestions].find(
      q => q.id.includes("start") || q.id.includes("timeline_start") || 
           (q.category === "timeline" && q.question.toLowerCase().includes("start"))
    );
    const completionDateQuestion = [...questions, ...followUpQuestions].find(
      q => q.id.includes("completion") || q.id.includes("timeline_completion") || 
           (q.category === "timeline" && (q.question.toLowerCase().includes("completion") || q.question.toLowerCase().includes("complete")))
    );

    if (startDateQuestion && completionDateQuestion) {
      const startDate = answers[startDateQuestion.id] as string;
      const completionDate = answers[completionDateQuestion.id] as string;

      if (startDate && completionDate) {
        const start = new Date(startDate);
        const completion = new Date(completionDate);

        if (completion <= start) {
          return {
            isValid: false,
            error: "The completion date must be after the start date."
          };
        }
      }
    }

    return { isValid: true };
  }

  function canProceed(): boolean {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return false;
    
    // Check date validation
    const dateValidation = validateDateLogic();
    if (!dateValidation.isValid) {
      return false;
    }
    
    if (!currentQuestion.required) return true;
    
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "multi-select") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  }

  function getProgress(): number {
    const totalQuestions = questions.length + (showFollowUps ? followUpQuestions.length : 0);
    if (totalQuestions === 0) return 0;
    return ((currentQuestionIndex + 1) / totalQuestions) * 100;
  }

  function renderQuestionInput(question: Question) {
    const value = answers[question.id];
    const categoryColors: Record<string, string> = {
      timeline: "bg-blue-100 text-blue-800",
      scope: "bg-purple-100 text-purple-800",
      budget: "bg-green-100 text-green-800",
      requirements: "bg-orange-100 text-orange-800",
      preferences: "bg-pink-100 text-pink-800"
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={categoryColors[question.category] || "bg-gray-100 text-gray-800"}>
            {question.category}
          </Badge>
          {question.required && (
            <span className="text-sm text-red-500">* Required</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor={question.id} className="text-base font-semibold">
            {question.question}
          </Label>
          {question.helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{question.helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* Budget-specific guidance */}
        {question.category === "budget" && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">💡 Budget Disclosure Guidance:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Budget disclosure is optional - many contractors prefer to provide their best price without budget influence</li>
              <li>If you choose to share, use a range (e.g., "$50k - $75k") rather than an exact amount</li>
              <li>This helps ensure alignment but shouldn't limit competitive pricing</li>
            </ul>
          </div>
        )}

        {question.type === "text" && (
          <Textarea
            id={question.id}
            value={(value as string) || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Enter your answer..."
            rows={4}
          />
        )}

        {question.type === "date" && (() => {
          // Check if this is a completion date that needs validation
          const isCompletionDate = question.id.includes("completion") || 
                                   question.id.includes("timeline_completion") ||
                                   (question.category === "timeline" && 
                                    (question.question.toLowerCase().includes("completion") || 
                                     question.question.toLowerCase().includes("complete")));
          
          const startDateQuestion = [...questions, ...followUpQuestions].find(
            q => q.id.includes("start") || q.id.includes("timeline_start") || 
                 (q.category === "timeline" && q.question.toLowerCase().includes("start"))
          );
          
          const startDate = startDateQuestion ? (answers[startDateQuestion.id] as string) : null;
          const currentDate = (value as string) || "";
          
          // Calculate min date (start date + 1 day if start date exists)
          let minDate = "";
          if (startDate && isCompletionDate) {
            const start = new Date(startDate);
            start.setDate(start.getDate() + 1);
            minDate = start.toISOString().split('T')[0];
          }
          
          // Check if current value is invalid
          const dateValidation = validateDateLogic();
          const isInvalid = isCompletionDate && currentDate && startDate && 
                           new Date(currentDate) <= new Date(startDate);

          return (
            <div className="space-y-2">
              <Input
                id={question.id}
                type="date"
                value={currentDate}
                min={minDate}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className={isInvalid ? "border-red-500" : ""}
              />
              {isInvalid && (
                <p className="text-sm text-red-500">
                  The completion date must be after the start date.
                </p>
              )}
            </div>
          );
        })()}

        {question.type === "number" && (
          <Input
            id={question.id}
            type="number"
            value={(value as string) || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Enter a number..."
          />
        )}

        {question.type === "select" && (
          <Select
            value={(value as string) || ""}
            onValueChange={(val) => handleAnswer(question.id, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {question.type === "multi-select" && (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option);
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const current = (value as string[]) || [];
                      if (checked) {
                        handleAnswer(question.id, [...current, option]);
                      } else {
                        handleAnswer(question.id, current.filter(v => v !== option));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`${question.id}-${option}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:!max-w-[min(92vw,1600px)] max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-600" />
            Prepare Email Draft
          </DialogTitle>
        </DialogHeader>

        {step === "loading-questions" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600 mb-4" />
            <p className="text-gray-600">Preparing personalized questions...</p>
          </div>
        )}

        {step === "answering" && (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length + (showFollowUps ? followUpQuestions.length : 0)}
                </span>
                <span>{Math.round(getProgress())}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-cyan-600 h-2 rounded-full transition-all"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>

            {/* Question */}
            {getCurrentQuestion() && renderQuestionInput(getCurrentQuestion()!)}

            {/* Date validation error message */}
            {!validateDateLogic().isValid && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {validateDateLogic().error}
                </AlertDescription>
              </Alert>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              {showFollowUps && currentQuestionIndex >= questions.length ? (
                <>
                  <Button variant="ghost" onClick={skipFollowUps}>
                    Skip Follow-ups
                  </Button>
                  <Button
                    onClick={handleFollowUpNext}
                    disabled={!canProceed()}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {currentQuestionIndex === questions.length - 1 ? "Generate Draft" : "Next"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600 mb-4" />
            <p className="text-gray-600">
              {contexts.length > 1
                ? `Generating ${contexts.length} personalized email drafts...`
                : "Generating your personalized email draft..."}
            </p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            {/* Letter navigation (when multiple vendors) */}
            {contexts.length > 1 && (
              <div className="flex items-center justify-between gap-6 py-3 px-4 w-full min-w-0 bg-cyan-50/80 rounded-lg border border-cyan-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentLetterIndex((i) => Math.max(0, i - 1))}
                  disabled={currentLetterIndex === 0}
                  className="shrink-0 whitespace-nowrap gap-1.5 border-cyan-600 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-800 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous letter
                </Button>
                <span className="text-sm font-medium text-gray-700 shrink-0">
                  Letter {currentLetterIndex + 1} of {contexts.length}
                  {contexts[currentLetterIndex] && (
                    <span className="text-gray-500 font-normal ml-1">
                      — {contexts[currentLetterIndex].vendorName}
                    </span>
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentLetterIndex((i) => Math.min(contexts.length - 1, i + 1))}
                  disabled={currentLetterIndex === contexts.length - 1}
                  className="shrink-0 whitespace-nowrap gap-1.5 border-cyan-600 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-800 disabled:opacity-50"
                >
                  Next letter
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Pitfalls Alert */}
            {currentPitfalls.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Important Considerations:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {currentPitfalls.map((pitfall, idx) => (
                      <li key={idx} className="text-sm">{pitfall}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Email Draft */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Email Draft</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyClick}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <pre className="whitespace-pre-wrap text-sm font-sans">{currentDraft}</pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                onClick={handleCopyClick}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Copy reminder: attach documents + status will change to Pending */}
      <AlertDialog open={!!copyReminderPending} onOpenChange={(open) => !open && setCopyReminderPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Before you send</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>Remember to attach any necessary documents (e.g. plans, specs) before sending your email.</p>
                <p>
                  The status for <strong>{copyReminderPending?.vendorName}</strong> will be set to <strong>Pending</strong>.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCopyConfirm} className="bg-cyan-600 hover:bg-cyan-700">
              Copy &amp; Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
