export type UserRole = "gc_only" | "gc_plus_diy" | "owner_plus_diy";

export type ExperienceLevel = "" | "gc_experienced" | "house_builder" | "trades_familiar" | "diy_permitting" | "diy_maintenance" | "complete_novice";

export type SubcontractorHelp = "yes" | "no" | "maybe";

export type WeeklyHourlyCommitment = string;

export type ConstructionMethod = "" | "traditional-frame" | "post-frame" | "icf" | "sip" | "modular" | "other";

export type FoundationType = "" | "slab-on-grade" | "crawlspace" | "full-basement" | "partial-basement" | "pier-and-beam" | "other";

export type NumberOfStories = "" | "1-story" | "1.5-story" | "2-story" | "2.5-story" | "3-story" | "other";

export interface OnboardingProfile {
  role: UserRole;
  experience: ExperienceLevel;
  subcontractorHelp: SubcontractorHelp;
  constructionMethod: ConstructionMethod;
  currentPhaseId: string;
  diyPhaseIds: string[];
  weeklyHourlyCommitment: WeeklyHourlyCommitment;
  cityState: string;
  propertyAddress?: string;
  	houseSize: string; // Actual or estimated size in sq ft
	foundationType: FoundationType;
	numberOfStories: NumberOfStories;
	targetStartDate?: string; // Optional target start date
	background?: string;
}

export interface RoadmapTaskStep {
	id: string;
	description: string;
}

export interface RoadmapTask {
	id: string;
	title: string;
	steps: RoadmapTaskStep[];
	qaChecks: string[];
	vendorQuestions: string[];
	vendorNeeds: string[];
	status: "todo" | "doing" | "done";
	notes?: string;
}

export interface RoadmapPhase {
	id: string;
	title: string;
	detailLevel: "low" | "standard" | "high";
	tasks: RoadmapTask[];
}

export interface RoadmapData {
	phases: RoadmapPhase[];
	timelineEstimates?: TimelineEstimate[];
	parsedTimelineEstimates?: Record<string, {
		diyDuration: string | null;
		contractorDuration: string | null;
		diyHours: string | null;
		rawTimeline: string;
	}>;
}

export interface TimelineEstimate {
	phaseId: string;
	phaseTitle: string;
	timeline: string;
	error?: string;
}

export interface BaselineTaskSpec {
	id: string;
	title: string;
	baseSteps: string[];
}

export interface BaselinePhaseSpec {
	id: string;
	title: string;
	tasks: BaselineTaskSpec[];
}

export interface BaselineDataSpec {
	phases: BaselinePhaseSpec[];
}


