# OpenAI API Test Results

**Test Date:** 2025-09-07T18:44:16.610Z
**Project ID:** 5cea9e82-8b17-44fa-91ac-273b474e55a5
**User ID:** 201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f

## Test Data Sent to API

```json
{
  "userId": "201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f",
  "projectId": "5cea9e82-8b17-44fa-91ac-273b474e55a5",
  "userProfile": {
    "diyPhaseIds": [
      "paint",
      "drywall",
      "insulation"
    ],
    "cityState": "Rice County, MN",
    "houseSize": "2000",
    "foundationType": "pier-and-beam",
    "numberOfStories": "2-story",
    "constructionMethod": "post-frame",
    "currentPhaseId": "just-starting",
    "role": "owner-builder",
    "experience": "beginner",
    "weeklyHourlyCommitment": 20,
    "targetStartDate": "2024-06-01"
  },
  "phases": [
    "paint",
    "drywall",
    "insulation",
    "foundation",
    "rough-framing"
  ]
}
```

## API Response

```json
{
  "success": true,
  "userId": "201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f",
  "projectId": "5cea9e82-8b17-44fa-91ac-273b474e55a5",
  "timelines": [
    {
      "phaseId": "just-starting",
      "phaseTitle": "Just Starting",
      "timeline": "🔨 DIY Phase  \n**Phase: Just Starting (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Just Starting (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Just Starting (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Just Starting (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS"
    },
    {
      "phaseId": "pre-construction",
      "phaseTitle": "Pre-Construction Planning",
      "timeline": "🔨 DIY Phase  \n**Phase: Pre-Construction Planning (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Pre-Construction Planning (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Pre-Construction Planning (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Pre-Construction Planning (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
    },
    {
      "phaseId": "site-prep-excavation",
      "phaseTitle": "Site Preparation & Excavation",
      "timeline": "🔨 DIY Phase  \n**Phase: Site Preparation & Excavation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Site Preparation & Excavation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Site Preparation & Excavation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Site Preparation & Excavation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "utilities-septic",
      "phaseTitle": "Utilities & Septic",
      "timeline": "🔨 DIY Phase  \n**Phase: Utilities & Septic (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Utilities & Septic (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Utilities & Septic (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Utilities & Septic (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "foundation",
      "phaseTitle": "Foundation",
      "timeline": "🔨 DIY Phase  \n**Phase: Foundation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Foundation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Foundation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Foundation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "rough-framing",
      "phaseTitle": "Rough Framing",
      "timeline": "🔨 DIY Phase  \n**Phase: Rough Framing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Rough Framing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Rough Framing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Rough Framing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "roofing",
      "phaseTitle": "Roofing",
      "timeline": "🔨 DIY Phase  \n**Phase: Roofing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Roofing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Roofing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Roofing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "exterior",
      "phaseTitle": "Exterior Finishes",
      "timeline": "🔨 DIY Phase  \n**Phase: Exterior Finishes (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Exterior Finishes (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Exterior Finishes (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Exterior Finishes (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "plumbing-rough",
      "phaseTitle": "Plumbing Rough-In",
      "timeline": "🔨 DIY Phase  \n**Phase: Plumbing Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Plumbing Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Plumbing Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Plumbing Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
    },
    {
      "phaseId": "electrical-rough",
      "phaseTitle": "Electrical Rough-In",
      "timeline": "🔨 DIY Phase  \n**Phase: Electrical Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Electrical Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS  \n\n**Calculation Methodology:**  \n1. Base hours for electrical rough-in for a 2000 sq ft house: [120] hours.  \n2. Experience multiplier for beginner: [2] → [240] hours.  \n3. Regional complexity multiplier for Northern climate: [1.3] → [312] hours.  \n4. DIY weeks: CEIL([312] hours / [20] hours/week) = [16] weeks.  \n5. Contractor duration based on industry standards: [4] weeks, adjusted for regional factors: [6] weeks.",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Electrical Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Electrical Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS  \n\n**Calculation Methodology:**  \n1. Base hours for electrical rough-in for a 2000 sq ft house: [120] hours.  \n2. Experience multiplier for beginner: [2] → [240] hours.  \n3. Regional complexity multiplier for Northern climate: [1.3] → [312] hours.  \n4. DIY weeks: CEIL([312] hours / [20] hours/week) = [16] weeks.  \n5. Contractor duration based on industry standards: [4] weeks, adjusted for regional factors: [6] weeks."
    },
    {
      "phaseId": "hvac-rough",
      "phaseTitle": "HVAC Rough-In",
      "timeline": "🔨 DIY Phase  \n**Phase: HVAC Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: HVAC Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: HVAC Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: HVAC Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS"
    },
    {
      "phaseId": "concrete-slabs",
      "phaseTitle": "Concrete Slabs & Flatwork",
      "timeline": "🔨 DIY Phase  \n**Phase: Concrete Slabs & Flatwork (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Concrete Slabs & Flatwork (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Concrete Slabs & Flatwork (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Concrete Slabs & Flatwork (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
    },
    {
      "phaseId": "insulation",
      "phaseTitle": "Insulation & Air Sealing",
      "timeline": "🔨 DIY Phase  \n**Phase: Insulation & Air Sealing (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Insulation & Air Sealing (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Insulation & Air Sealing (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Insulation & Air Sealing (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
    },
    {
      "phaseId": "drywall",
      "phaseTitle": "Drywall",
      "timeline": "🔨 DIY Phase  \n**Phase: Drywall (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Drywall (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS  \n\n### Calculation Methodology:\n1. **Base Hours**: Approximately [120] hours for a 2000 sq ft, 2-story house.\n2. **Experience Multiplier**: For a beginner, multiply by [2] → [240] hours.\n3. **Regional Complexity Multiplier**: Northern climate adds [1.1] → [264] hours.\n4. **Weather Multiplier**: Not applicable for interior work.\n5. **DIY Weeks**: CEIL([264] hours / [20] hours per week) = [12] weeks.\n\nContract",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Drywall (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Drywall (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS  \n\n### Calculation Methodology:\n1. **Base Hours**: Approximately [120] hours for a 2000 sq ft, 2-story house.\n2. **Experience Multiplier**: For a beginner, multiply by [2] → [240] hours.\n3. **Regional Complexity Multiplier**: Northern climate adds [1.1] → [264] hours.\n4. **Weather Multiplier**: Not applicable for interior work.\n5. **DIY Weeks**: CEIL([264] hours / [20] hours per week) = [12] weeks.\n\nContract"
    },
    {
      "phaseId": "paint",
      "phaseTitle": "Paint",
      "timeline": "🔨 DIY Phase  \n**Phase: Paint (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Paint (Contractor Phase)**  \n- **Contractor Duration**: [4] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Paint (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Paint (Contractor Phase)**  \n- **Contractor Duration**: [4] weeks"
    },
    {
      "phaseId": "trim-carpentry",
      "phaseTitle": "Trim Carpentry",
      "timeline": "🔨 DIY Phase  \n**Phase: Trim Carpentry (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Trim Carpentry (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Trim Carpentry (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Trim Carpentry (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "flooring",
      "phaseTitle": "Flooring",
      "timeline": "🔨 DIY Phase  \n**Phase: Flooring (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Flooring (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Flooring (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Flooring (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "kitchen-bath",
      "phaseTitle": "Kitchen & Bath",
      "timeline": "🔨 DIY Phase  \n**Phase: Kitchen & Bath (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Kitchen & Bath (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Kitchen & Bath (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Kitchen & Bath (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    {
      "phaseId": "final-touches",
      "phaseTitle": "Final Touches & Punch List",
      "timeline": "🔨 DIY Phase  \n**Phase: Final Touches & Punch List (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Final Touches & Punch List (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS",
      "rawOpenAIResponse": "🔨 DIY Phase  \n**Phase: Final Touches & Punch List (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Final Touches & Punch List (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS"
    }
  ],
  "rawOpenAIResponses": {
    "just-starting": "🔨 DIY Phase  \n**Phase: Just Starting (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Just Starting (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS",
    "pre-construction": "🔨 DIY Phase  \n**Phase: Pre-Construction Planning (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Pre-Construction Planning (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks",
    "site-prep-excavation": "🔨 DIY Phase  \n**Phase: Site Preparation & Excavation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Site Preparation & Excavation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "utilities-septic": "🔨 DIY Phase  \n**Phase: Utilities & Septic (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Utilities & Septic (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "foundation": "🔨 DIY Phase  \n**Phase: Foundation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Foundation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "rough-framing": "🔨 DIY Phase  \n**Phase: Rough Framing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Rough Framing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "roofing": "🔨 DIY Phase  \n**Phase: Roofing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Roofing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "exterior": "🔨 DIY Phase  \n**Phase: Exterior Finishes (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Exterior Finishes (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "plumbing-rough": "🔨 DIY Phase  \n**Phase: Plumbing Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Plumbing Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks",
    "electrical-rough": "🔨 DIY Phase  \n**Phase: Electrical Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Electrical Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS  \n\n**Calculation Methodology:**  \n1. Base hours for electrical rough-in for a 2000 sq ft house: [120] hours.  \n2. Experience multiplier for beginner: [2] → [240] hours.  \n3. Regional complexity multiplier for Northern climate: [1.3] → [312] hours.  \n4. DIY weeks: CEIL([312] hours / [20] hours/week) = [16] weeks.  \n5. Contractor duration based on industry standards: [4] weeks, adjusted for regional factors: [6] weeks.",
    "hvac-rough": "🔨 DIY Phase  \n**Phase: HVAC Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: HVAC Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS",
    "concrete-slabs": "🔨 DIY Phase  \n**Phase: Concrete Slabs & Flatwork (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Concrete Slabs & Flatwork (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks",
    "insulation": "🔨 DIY Phase  \n**Phase: Insulation & Air Sealing (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Insulation & Air Sealing (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks",
    "drywall": "🔨 DIY Phase  \n**Phase: Drywall (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Drywall (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS  \n\n### Calculation Methodology:\n1. **Base Hours**: Approximately [120] hours for a 2000 sq ft, 2-story house.\n2. **Experience Multiplier**: For a beginner, multiply by [2] → [240] hours.\n3. **Regional Complexity Multiplier**: Northern climate adds [1.1] → [264] hours.\n4. **Weather Multiplier**: Not applicable for interior work.\n5. **DIY Weeks**: CEIL([264] hours / [20] hours per week) = [12] weeks.\n\nContract",
    "paint": "🔨 DIY Phase  \n**Phase: Paint (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Paint (Contractor Phase)**  \n- **Contractor Duration**: [4] weeks",
    "trim-carpentry": "🔨 DIY Phase  \n**Phase: Trim Carpentry (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Trim Carpentry (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "flooring": "🔨 DIY Phase  \n**Phase: Flooring (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Flooring (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "kitchen-bath": "🔨 DIY Phase  \n**Phase: Kitchen & Bath (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Kitchen & Bath (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks",
    "final-touches": "🔨 DIY Phase  \n**Phase: Final Touches & Punch List (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Final Touches & Punch List (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS"
  },
  "parsedTimelineEstimates": {
    "just-starting": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Just Starting (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Just Starting (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS"
    },
    "pre-construction": {
      "diyDuration": "8 weeks",
      "contractorDuration": "6 weeks",
      "diyHours": "160 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Pre-Construction Planning (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Pre-Construction Planning (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
    },
    "site-prep-excavation": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Site Preparation & Excavation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Site Preparation & Excavation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "utilities-septic": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Utilities & Septic (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Utilities & Septic (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "foundation": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Foundation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Foundation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "rough-framing": {
      "diyDuration": "16 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "320 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Rough Framing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Rough Framing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "roofing": {
      "diyDuration": "16 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "320 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Roofing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Roofing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "exterior": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Exterior Finishes (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Exterior Finishes (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "plumbing-rough": {
      "diyDuration": "12 weeks",
      "contractorDuration": "6 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Plumbing Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Plumbing Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
    },
    "electrical-rough": {
      "diyDuration": "12 weeks",
      "contractorDuration": "6 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Electrical Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Electrical Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS  \n\n**Calculation Methodology:**  \n1. Base hours for electrical rough-in for a 2000 sq ft house: [120] hours.  \n2. Experience multiplier for beginner: [2] → [240] hours.  \n3. Regional complexity multiplier for Northern climate: [1.3] → [312] hours.  \n4. DIY weeks: CEIL([312] hours / [20] hours/week) = [16] weeks.  \n5. Contractor duration based on industry standards: [4] weeks, adjusted for regional factors: [6] weeks."
    },
    "hvac-rough": {
      "diyDuration": "12 weeks",
      "contractorDuration": "6 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: HVAC Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: HVAC Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS"
    },
    "concrete-slabs": {
      "diyDuration": "12 weeks",
      "contractorDuration": "6 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Concrete Slabs & Flatwork (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Concrete Slabs & Flatwork (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
    },
    "insulation": {
      "diyDuration": "12 weeks",
      "contractorDuration": "6 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Insulation & Air Sealing (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Insulation & Air Sealing (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
    },
    "drywall": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Drywall (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Drywall (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS  \n\n### Calculation Methodology:\n1. **Base Hours**: Approximately [120] hours for a 2000 sq ft, 2-story house.\n2. **Experience Multiplier**: For a beginner, multiply by [2] → [240] hours.\n3. **Regional Complexity Multiplier**: Northern climate adds [1.1] → [264] hours.\n4. **Weather Multiplier**: Not applicable for interior work.\n5. **DIY Weeks**: CEIL([264] hours / [20] hours per week) = [12] weeks.\n\nContract"
    },
    "paint": {
      "diyDuration": "8 weeks",
      "contractorDuration": "4 weeks",
      "diyHours": "160 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Paint (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Paint (Contractor Phase)**  \n- **Contractor Duration**: [4] weeks"
    },
    "trim-carpentry": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Trim Carpentry (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Trim Carpentry (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "flooring": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Flooring (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Flooring (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "kitchen-bath": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Kitchen & Bath (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Kitchen & Bath (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
    },
    "final-touches": {
      "diyDuration": "12 weeks",
      "contractorDuration": "8 weeks",
      "diyHours": "240 hours",
      "rawTimeline": "🔨 DIY Phase  \n**Phase: Final Touches & Punch List (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Final Touches & Punch List (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS"
    }
  }
}
```

## Parsed Timeline Estimates

### just-starting
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Just Starting (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Just Starting (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS"
}
```

### pre-construction
```json
{
  "diyDuration": "8 weeks",
  "contractorDuration": "6 weeks",
  "diyHours": "160 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Pre-Construction Planning (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Pre-Construction Planning (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
}
```

### site-prep-excavation
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Site Preparation & Excavation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Site Preparation & Excavation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### utilities-septic
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Utilities & Septic (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Utilities & Septic (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### foundation
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Foundation (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Foundation (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### rough-framing
```json
{
  "diyDuration": "16 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "320 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Rough Framing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Rough Framing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### roofing
```json
{
  "diyDuration": "16 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "320 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Roofing (DIY Phase)**  \n- **Duration**: [16] weeks  \n- **DIY Hours**: [320] hours  \n\n🏗 Contractor Phase  \n**Phase: Roofing (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### exterior
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Exterior Finishes (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Exterior Finishes (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### plumbing-rough
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "6 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Plumbing Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Plumbing Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
}
```

### electrical-rough
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "6 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Electrical Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Electrical Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS  \n\n**Calculation Methodology:**  \n1. Base hours for electrical rough-in for a 2000 sq ft house: [120] hours.  \n2. Experience multiplier for beginner: [2] → [240] hours.  \n3. Regional complexity multiplier for Northern climate: [1.3] → [312] hours.  \n4. DIY weeks: CEIL([312] hours / [20] hours/week) = [16] weeks.  \n5. Contractor duration based on industry standards: [4] weeks, adjusted for regional factors: [6] weeks."
}
```

### hvac-rough
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "6 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: HVAC Rough-In (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: HVAC Rough-In (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS"
}
```

### concrete-slabs
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "6 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Concrete Slabs & Flatwork (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Concrete Slabs & Flatwork (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
}
```

### insulation
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "6 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Insulation & Air Sealing (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Insulation & Air Sealing (Contractor Phase)**  \n- **Contractor Duration**: [6] weeks"
}
```

### drywall
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Drywall (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Drywall (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS  \n\n### Calculation Methodology:\n1. **Base Hours**: Approximately [120] hours for a 2000 sq ft, 2-story house.\n2. **Experience Multiplier**: For a beginner, multiply by [2] → [240] hours.\n3. **Regional Complexity Multiplier**: Northern climate adds [1.1] → [264] hours.\n4. **Weather Multiplier**: Not applicable for interior work.\n5. **DIY Weeks**: CEIL([264] hours / [20] hours per week) = [12] weeks.\n\nContract"
}
```

### paint
```json
{
  "diyDuration": "8 weeks",
  "contractorDuration": "4 weeks",
  "diyHours": "160 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Paint (DIY Phase)**  \n- **Duration**: [8] weeks  \n- **DIY Hours**: [160] hours  \n\n🏗 Contractor Phase  \n**Phase: Paint (Contractor Phase)**  \n- **Contractor Duration**: [4] weeks"
}
```

### trim-carpentry
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Trim Carpentry (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Trim Carpentry (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### flooring
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Flooring (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Flooring (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### kitchen-bath
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Kitchen & Bath (DIY Phase)**  \n- **Duration**: [12] weeks  \n- **DIY Hours**: [240] hours  \n\n🏗 Contractor Phase  \n**Phase: Kitchen & Bath (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks"
}
```

### final-touches
```json
{
  "diyDuration": "12 weeks",
  "contractorDuration": "8 weeks",
  "diyHours": "240 hours",
  "rawTimeline": "🔨 DIY Phase  \n**Phase: Final Touches & Punch List (DIY Phase)**  \n- **Duration**: [12] weeks ← MUST USE BRACKETS  \n- **DIY Hours**: [240] hours ← MUST USE BRACKETS  \n\n🏗 Contractor Phase  \n**Phase: Final Touches & Punch List (Contractor Phase)**  \n- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS"
}
```

## Raw OpenAI Responses

### just-starting
```
🔨 DIY Phase  
**Phase: Just Starting (DIY Phase)**  
- **Duration**: [12] weeks ← MUST USE BRACKETS  
- **DIY Hours**: [240] hours ← MUST USE BRACKETS  

🏗 Contractor Phase  
**Phase: Just Starting (Contractor Phase)**  
- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS
```

### pre-construction
```
🔨 DIY Phase  
**Phase: Pre-Construction Planning (DIY Phase)**  
- **Duration**: [8] weeks  
- **DIY Hours**: [160] hours  

🏗 Contractor Phase  
**Phase: Pre-Construction Planning (Contractor Phase)**  
- **Contractor Duration**: [6] weeks
```

### site-prep-excavation
```
🔨 DIY Phase  
**Phase: Site Preparation & Excavation (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Site Preparation & Excavation (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### utilities-septic
```
🔨 DIY Phase  
**Phase: Utilities & Septic (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Utilities & Septic (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### foundation
```
🔨 DIY Phase  
**Phase: Foundation (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Foundation (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### rough-framing
```
🔨 DIY Phase  
**Phase: Rough Framing (DIY Phase)**  
- **Duration**: [16] weeks  
- **DIY Hours**: [320] hours  

🏗 Contractor Phase  
**Phase: Rough Framing (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### roofing
```
🔨 DIY Phase  
**Phase: Roofing (DIY Phase)**  
- **Duration**: [16] weeks  
- **DIY Hours**: [320] hours  

🏗 Contractor Phase  
**Phase: Roofing (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### exterior
```
🔨 DIY Phase  
**Phase: Exterior Finishes (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Exterior Finishes (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### plumbing-rough
```
🔨 DIY Phase  
**Phase: Plumbing Rough-In (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Plumbing Rough-In (Contractor Phase)**  
- **Contractor Duration**: [6] weeks
```

### electrical-rough
```
🔨 DIY Phase  
**Phase: Electrical Rough-In (DIY Phase)**  
- **Duration**: [12] weeks ← MUST USE BRACKETS  
- **DIY Hours**: [240] hours ← MUST USE BRACKETS  

🏗 Contractor Phase  
**Phase: Electrical Rough-In (Contractor Phase)**  
- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS  

**Calculation Methodology:**  
1. Base hours for electrical rough-in for a 2000 sq ft house: [120] hours.  
2. Experience multiplier for beginner: [2] → [240] hours.  
3. Regional complexity multiplier for Northern climate: [1.3] → [312] hours.  
4. DIY weeks: CEIL([312] hours / [20] hours/week) = [16] weeks.  
5. Contractor duration based on industry standards: [4] weeks, adjusted for regional factors: [6] weeks.
```

### hvac-rough
```
🔨 DIY Phase  
**Phase: HVAC Rough-In (DIY Phase)**  
- **Duration**: [12] weeks ← MUST USE BRACKETS  
- **DIY Hours**: [240] hours ← MUST USE BRACKETS  

🏗 Contractor Phase  
**Phase: HVAC Rough-In (Contractor Phase)**  
- **Contractor Duration**: [6] weeks ← MUST USE BRACKETS
```

### concrete-slabs
```
🔨 DIY Phase  
**Phase: Concrete Slabs & Flatwork (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Concrete Slabs & Flatwork (Contractor Phase)**  
- **Contractor Duration**: [6] weeks
```

### insulation
```
🔨 DIY Phase  
**Phase: Insulation & Air Sealing (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Insulation & Air Sealing (Contractor Phase)**  
- **Contractor Duration**: [6] weeks
```

### drywall
```
🔨 DIY Phase  
**Phase: Drywall (DIY Phase)**  
- **Duration**: [12] weeks ← MUST USE BRACKETS  
- **DIY Hours**: [240] hours ← MUST USE BRACKETS  

🏗 Contractor Phase  
**Phase: Drywall (Contractor Phase)**  
- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS  

### Calculation Methodology:
1. **Base Hours**: Approximately [120] hours for a 2000 sq ft, 2-story house.
2. **Experience Multiplier**: For a beginner, multiply by [2] → [240] hours.
3. **Regional Complexity Multiplier**: Northern climate adds [1.1] → [264] hours.
4. **Weather Multiplier**: Not applicable for interior work.
5. **DIY Weeks**: CEIL([264] hours / [20] hours per week) = [12] weeks.

Contract
```

### paint
```
🔨 DIY Phase  
**Phase: Paint (DIY Phase)**  
- **Duration**: [8] weeks  
- **DIY Hours**: [160] hours  

🏗 Contractor Phase  
**Phase: Paint (Contractor Phase)**  
- **Contractor Duration**: [4] weeks
```

### trim-carpentry
```
🔨 DIY Phase  
**Phase: Trim Carpentry (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Trim Carpentry (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### flooring
```
🔨 DIY Phase  
**Phase: Flooring (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Flooring (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### kitchen-bath
```
🔨 DIY Phase  
**Phase: Kitchen & Bath (DIY Phase)**  
- **Duration**: [12] weeks  
- **DIY Hours**: [240] hours  

🏗 Contractor Phase  
**Phase: Kitchen & Bath (Contractor Phase)**  
- **Contractor Duration**: [8] weeks
```

### final-touches
```
🔨 DIY Phase  
**Phase: Final Touches & Punch List (DIY Phase)**  
- **Duration**: [12] weeks ← MUST USE BRACKETS  
- **DIY Hours**: [240] hours ← MUST USE BRACKETS  

🏗 Contractor Phase  
**Phase: Final Touches & Punch List (Contractor Phase)**  
- **Contractor Duration**: [8] weeks ← MUST USE BRACKETS
```

---
*Generated on 2025-09-07T18:44:16.614Z*
