"use client";

import { useState } from "react";
import { useRoadmap } from "@/contexts/roadmap-context";
import type { OnboardingProfile } from "@/lib/roadmap-types";
import { Button } from "@/components/ui/button";
import { getPhasesForDropdownByMethod, getPhasesForMethod } from "@/lib/roadmap-phases";

interface OnboardingWizardProps {
	onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
	const { setProfileAndGenerate, isLoading } = useRoadmap();
	
	const [role, setRole] = useState<"gc_only" | "gc_plus_diy" | "owner_plus_diy">("gc_only");
	const [experience, setExperience] = useState<"" | "gc_experienced" | "house_builder" | "trades_familiar" | "diy_permitting" | "diy_maintenance" | "complete_novice">("");
	const [subcontractorHelp, setSubcontractorHelp] = useState<"yes" | "no" | "maybe">("yes");
	const [constructionMethod, setConstructionMethod] = useState<"" | "traditional-frame" | "post-frame" | "icf" | "sip" | "modular" | "other">("");
	const [currentPhaseId, setCurrentPhaseId] = useState("");
	const [diyPhaseIds, setDiyPhaseIds] = useState<string[]>([]);
	const [weeklyHourlyCommitment, setWeeklyHourlyCommitment] = useState<string>("");
	const [cityState, setCityState] = useState("");
	const [propertyAddress, setPropertyAddress] = useState("");
	const [houseSize, setHouseSize] = useState("");
	const [foundationType, setFoundationType] = useState<"" | "slab-on-grade" | "crawlspace" | "full-basement" | "partial-basement" | "pier-and-beam" | "other">("");
	const [numberOfStories, setNumberOfStories] = useState<"" | "1-story" | "1.5-story" | "2-story" | "2.5-story" | "3-story" | "other">("");
	const [targetStartDate, setTargetStartDate] = useState("");
	const [background, setBackground] = useState("");

	async function handleSubmit() {
		const profile: OnboardingProfile = { role, experience, subcontractorHelp, constructionMethod, currentPhaseId, diyPhaseIds, weeklyHourlyCommitment, cityState, propertyAddress, houseSize, foundationType, numberOfStories, targetStartDate, background };
		
		try {
			await setProfileAndGenerate(profile);
			onComplete(); // Switch to roadmap view
		} catch (error) {
			console.error('Error in setProfileAndGenerate:', error);
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-4 space-y-6">
			<div className="text-center">
				<h1 className="text-2xl font-semibold">Project Onboarding</h1>
				<p className="text-gray-600 mt-2">Complete this questionnaire to generate your personalized construction roadmap</p>
			</div>
			
			<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<p className="text-sm text-blue-800">
					<strong>Note:</strong> This is the beginning of the construction process. This questionnaire may feel overwhelming, but these are questions you will need to find answers to during your project planning. Take your time and answer what you can - you can always update your profile later.
				</p>
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Your role</label>
				<div className="space-y-2">
					<label className="flex items-center gap-2"><input type="radio" checked={role==="gc_only"} onChange={() => setRole("gc_only")} /> I am a licensed general contractor and will hire all subcontractors</label>
					<label className="flex items-center gap-2"><input type="radio" checked={role==="gc_plus_diy"} onChange={() => setRole("gc_plus_diy")} /> I am a licensed general contractor and will self-perform some phases</label>
					<label className="flex items-center gap-2"><input type="radio" checked={role==="owner_plus_diy"} onChange={() => setRole("owner_plus_diy")} /> I am an owner-builder acting as general contractor and will self-perform some phases</label>
				</div>
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Experience level</label>
				<select className="border rounded p-2" value={experience} onChange={(e)=>setExperience(e.target.value as any)}>
					<option value="">Select your experience level</option>
					<option value="gc_experienced">I am a general contractor</option>
					<option value="house_builder">I've built a house before</option>
					<option value="trades_familiar">I am in the trades and am familiar with the process of building a house</option>
					<option value="diy_permitting">DIY - Tackled large enough projects that require permitting</option>
					<option value="diy_maintenance">DIY - I do a lot of my own maintenance tasks but never knowingly needed a permit</option>
					<option value="complete_novice">I am a novice at everything pertaining to building a house and using power tools</option>
				</select>
				{experience === "" && (
					<p className="text-sm text-red-600 mt-1">Please select your experience level</p>
				)}
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Foundation Type</label>
				<select className="border rounded p-2" value={foundationType} onChange={(e)=>setFoundationType(e.target.value as any)}>
					<option value="">Select foundation type</option>
					<option value="slab-on-grade">Slab on Grade</option>
					<option value="crawlspace">Crawlspace</option>
					<option value="full-basement">Full Basement</option>
					<option value="partial-basement">Partial Basement</option>
					<option value="pier-and-beam">Pier and Beam</option>
					<option value="other">Other</option>
				</select>
				{foundationType === "" && (
					<p className="text-sm text-red-600 mt-1">Please select your foundation type</p>
				)}
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Construction Method</label>
				<select className="border rounded p-2" value={constructionMethod} onChange={(e)=>setConstructionMethod(e.target.value as any)}>
					<option value="">Select construction method</option>
					<option value="traditional-frame">Traditional Wood Frame</option>
					<option value="post-frame">Post Frame/Pole Barn</option>
					<option value="icf">ICF (Insulated Concrete Forms)</option>
					<option value="sip">SIP (Structural Insulated Panels)</option>
					<option value="modular">Modular/Prefab</option>
					<option value="other">Other</option>
				</select>
				{constructionMethod === "" && (
					<p className="text-sm text-red-600 mt-1">Please select your construction method</p>
				)}
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Would you like help with a list of subcontractors?</label>
				<select className="border rounded p-2" value={subcontractorHelp} onChange={(e)=>setSubcontractorHelp(e.target.value as any)}>
					<option value="yes">Yes, please provide recommendations</option>
					<option value="no">No, I have my own contacts</option>
					<option value="maybe">Maybe, show me what's available</option>
				</select>
				<p className="text-sm text-gray-600 mt-1">
					* At the moment, recommendations are based on external reviews (i.e., Google, Facebook). 
					Since this is a new application, we would like to eventually recommend contractors based on 
					users who have utilized them in the application along with reviews from external sites.
				</p>
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Current phase</label>
				<select className="border rounded p-2" value={currentPhaseId} onChange={(e)=>setCurrentPhaseId(e.target.value)}>
					<option value="">Select your current phase</option>
					{constructionMethod ? getPhasesForDropdownByMethod(constructionMethod).map(p => <option key={p.id} value={p.id}>{p.title}</option>) : <option value="" disabled>Select construction method first</option>}
				</select>
				{currentPhaseId === "" && (
					<p className="text-sm text-red-600 mt-1">Please select your current phase</p>
				)}
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Weekly estimated hourly commitment</label>
				<input 
					type="number" 
					min="0" 
					max="168" 
					className="border rounded p-2 w-full" 
					placeholder="e.g., 15 (hours per week)"
					value={weeklyHourlyCommitment}
					onChange={(e) => {
						const value = e.target.value;
						const numValue = parseInt(value);
						
						// Only allow values between 0 and 168
						if (value === "" || (numValue >= 0 && numValue <= 168)) {
							setWeeklyHourlyCommitment(value);
						}
					}}
				/>
				<p className="text-sm text-gray-600 mt-1">
					Enter the number of hours you can commit per week (0-168 hours)
				</p>
				{weeklyHourlyCommitment === "" && (
					<p className="text-sm text-red-600 mt-1">Please enter your weekly time commitment</p>
				)}
				{weeklyHourlyCommitment !== "" && (parseInt(weeklyHourlyCommitment) < 0 || parseInt(weeklyHourlyCommitment) > 168) && (
					<p className="text-sm text-red-600 mt-1">Weekly commitment must be between 0 and 168 hours</p>
				)}
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Location: [County/City/Township], [State]</label>
				<input 
					type="text" 
					className="border rounded p-2 w-full" 
					placeholder="Richmond City, VA"
					value={cityState}
					onChange={(e) => setCityState(e.target.value)}
				/>
				<p className="text-sm text-gray-600 mt-1">
					If you know your city or county handles the permitting process, please list that. 
					If you are not sure, try to put County/City/Township, State
				</p>
				{cityState === "" && (
					<p className="text-sm text-red-600 mt-1">Please enter your location</p>
				)}
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">House Size (Square Feet)</label>
				<input 
					type="text" 
					className="border rounded p-2 w-full" 
					placeholder="e.g., 2,400 sq ft or 1,800-2,200 sq ft"
					value={houseSize}
					onChange={(e) => setHouseSize(e.target.value)}
				/>
				<p className="text-sm text-gray-600 mt-1">
					Enter the actual size if known, or provide an estimated range if still planning
				</p>
				{houseSize === "" && (
					<p className="text-sm text-red-600 mt-1">Please enter the house size</p>
				)}
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Number of Stories</label>
				<select className="border rounded p-2" value={numberOfStories} onChange={(e)=>setNumberOfStories(e.target.value as any)}>
					<option value="">Select number of stories</option>
					<option value="1-story">1 Story</option>
					<option value="1.5-story">1.5 Story (Split Level)</option>
					<option value="2-story">2 Story</option>
					<option value="2.5-story">2.5 Story</option>
					<option value="3-story">3 Story</option>
					<option value="other">Other</option>
				</select>
				{numberOfStories === "" && (
					<p className="text-sm text-red-600 mt-1">Please select the number of stories</p>
				)}
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Target Start Date (optional)</label>
				<input 
					type="date" 
					className="border rounded p-2 w-full" 
					value={targetStartDate}
					onChange={(e) => setTargetStartDate(e.target.value)}
				/>
				<p className="text-sm text-gray-600 mt-1">
					This helps us consider weather impacts and seasonal constraints on your timeline
				</p>
			</div>
			
			<div className="space-y-2">
				<label className="font-medium">Property Address (optional)</label>
				<input 
					type="text" 
					className="border rounded p-2 w-full" 
					placeholder="123 Main Street, Richmond City, VA 23220"
					value={propertyAddress}
					onChange={(e) => setPropertyAddress(e.target.value)}
				/>
				<p className="text-sm text-gray-600 mt-1">
					If you know your property address, please include it. This helps with zoning, flood zones, soil conditions, and other site-specific factors.
				</p>
			</div>
			
			{(role === "gc_plus_diy" || role === "owner_plus_diy") && constructionMethod && currentPhaseId && (
				<div className="space-y-2">
					<label className="font-medium">Phases you will self-perform</label>
					<p className="text-sm text-gray-600">
						Select phases you plan to handle yourself. Only phases that can be performed after your current phase are shown.
					</p>
					<div className="grid grid-cols-1 gap-2">
						{(() => {
							const allPhases = getPhasesForMethod(constructionMethod);
							const currentPhase = allPhases.find(p => p.id === currentPhaseId);
							const currentPhaseOrder = currentPhase?.order || 0;
							
							// Only show phases that come after the current phase
							const availablePhases = allPhases.filter(p => p.order > currentPhaseOrder);
							
							return availablePhases.map((p, index) => (
								<label key={`${constructionMethod}-${p.id}-${index}`} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
									<input 
										type="checkbox" 
										checked={diyPhaseIds.includes(p.id)} 
										onChange={(e) => {
											setDiyPhaseIds(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))
										}} 
									/>
									<div>
										<div className="font-medium">{p.title}</div>
										<div className="text-sm text-gray-600">
											Order: {p.order} • Dependencies: {p.dependencies?.length > 0 ? p.dependencies.join(", ") : "None"}
										</div>
									</div>
								</label>
							));
						})()}
					</div>
					{diyPhaseIds.length > 0 && (
						<div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
							<p className="text-sm text-blue-800">
								<strong>Selected phases:</strong> {diyPhaseIds.length} phase{diyPhaseIds.length !== 1 ? 's' : ''}
							</p>
						</div>
					)}
				</div>
			)}
			
			<div className="space-y-2">
				<label className="font-medium">Additional background information (optional)</label>
				<textarea 
					className="w-full border rounded p-2 min-h-[80px] resize-none"
					placeholder="i.e. I was a landscape foreman in college, I am comfortable with power tools, I've built a deck and shed. Any relevant experience or skills that might be helpful."
					value={background}
					onChange={(e) => setBackground(e.target.value)}
				/>
			</div>
			
			<div>
				<Button 
					onClick={handleSubmit} 
					disabled={
						isLoading || 
						experience === "" || 
						constructionMethod === "" || 
						currentPhaseId === "" || 
						weeklyHourlyCommitment === "" || 
						parseInt(weeklyHourlyCommitment) < 0 || 
						parseInt(weeklyHourlyCommitment) > 168 ||
						cityState === "" || 
						houseSize === "" || 
						foundationType === "" || 
						numberOfStories === ""
					}
					className={
						experience === "" || 
						constructionMethod === "" || 
						currentPhaseId === "" || 
						weeklyHourlyCommitment === "" || 
						parseInt(weeklyHourlyCommitment) < 0 || 
						parseInt(weeklyHourlyCommitment) > 168 ||
						cityState === "" || 
						houseSize === "" || 
						foundationType === "" || 
						numberOfStories === "" 
							? "opacity-50 cursor-not-allowed" 
							: ""
					}
				>
					{isLoading ? "Generating..." : "Generate Roadmap"}
				</Button>
				{(experience === "" || constructionMethod === "" || currentPhaseId === "" || weeklyHourlyCommitment === "" || parseInt(weeklyHourlyCommitment) < 0 || parseInt(weeklyHourlyCommitment) > 168 || cityState === "" || houseSize === "" || foundationType === "" || numberOfStories === "") && (
					<p className="text-sm text-red-600 mt-2">Please complete all required fields with valid values before continuing</p>
				)}
			</div>
		</div>
	);
}
