"use client"

import { useState } from "react"
import { ConstructionTimeline } from "@/components/construction-timeline"
import { DashboardHeader } from "@/components/dashboard-header"
import { FeatureNavigation } from "@/components/feature-navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ConstructionMethod } from "@/lib/roadmap-types"
import { useRouter } from "next/navigation"

export default function TimelineDemoPage() {
	const [constructionMethod, setConstructionMethod] = useState<ConstructionMethod>("traditional-frame")
	const router = useRouter()

	const constructionMethodOptions = [
		{ value: "traditional-frame", label: "Traditional Frame" },
		{ value: "post-frame", label: "Post Frame" },
		{ value: "icf", label: "ICF (Insulated Concrete Forms)" },
		{ value: "sip", label: "SIP (Structural Insulated Panels)" },
		{ value: "modular", label: "Modular" }
	]

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardHeader />
			<main className="pb-6">
				<FeatureNavigation onFeatureClick={(feature) => {
												if (feature === "roadmap") router.push("/dashboard");
					if (feature === "dashboard") router.push("/dashboard");
					// Add other feature routes as needed
				}} />
				
				<div className="max-w-4xl mx-auto p-6">
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Construction Timeline Demo</h1>
							<p className="text-gray-600">View the construction timeline for different building methods</p>
						</div>
						<div className="flex items-center gap-3">
							<label className="text-sm font-medium text-gray-700">Construction Method:</label>
							<Select value={constructionMethod} onValueChange={(value: ConstructionMethod) => setConstructionMethod(value)}>
								<SelectTrigger className="w-48">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{constructionMethodOptions.map(option => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<ConstructionTimeline 
					constructionMethod={constructionMethod}
					title={`${constructionMethodOptions.find(opt => opt.value === constructionMethod)?.label} Construction Timeline`}
					description="Standard construction phases in chronological order for this building method"
				/>
			</main>
		</div>
	)
}
