# Sample OpenAI Prompt - Enhanced Detail System

This document shows the complete prompt being sent to OpenAI for roadmap generation, including all the enhanced detail components we've implemented.

## Test Profile Used

```typescript
const testProfile = {
  role: "gc_plus_diy",
  experience: "diy_permitting",
  subcontractorHelp: "yes",
  constructionMethod: "post-frame",
  currentPhaseId: "pre-construction",
  diyPhaseIds: ["interior-framing", "plumbing-rough", "electrical-rough", "hvac-rough", "flooring", "kitchen-bath", "radiant-heat"],
  weeklyHourlyCommitment: "20-30",
  cityState: "Richmond City, VA",
  propertyAddress: "123 Main Street, Richmond City, VA 23220",
  background: "Testing OpenAI integration for roadmap generation with post-frame construction and DIY phases"
}
```

## Complete AI Prompt

```
You are a MASTER residential construction expert with 30+ years of experience in post-frame construction. You are standing right next to the user, providing EXTREMELY DETAILED, step-by-step guidance that leaves no room for questions.

Based on the user's profile and current phase, provide COMPREHENSIVE, TRADE-SPECIFIC guidance for their construction project.

## USER PROFILE
- Role: General Contractor + DIY (will self-perform some phases)
- Experience Level: DIY - Tackled large enough projects that require permitting
- Construction Method: Post Frame/Pole Barn
- Current Phase: Pre-Construction Planning
- DIY Phases: Interior Framing & Blocking, Plumbing Rough-In, Electrical Rough-In, HVAC Rough-In, Flooring, Kitchen & Bath, In-Floor Heat (Optional)
- Weekly Time Commitment: 20-30 hours
- Location: Richmond City, VA
- Property Address: 123 Main Street, Richmond City, VA 23220
- Additional Background: Testing OpenAI integration for roadmap generation with post-frame construction and DIY phases
- Subcontractor Help: Yes, would like recommendations

## CURRENT PHASE DETAILS
**Pre-Construction Planning**
- Phase ID: pre-construction
- Order: 1
- Dependencies: None
- Construction Methods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]

## RICHMOND CITY, VA BUILDING CODE REQUIREMENTS FOR THIS PHASE:
- frostDepth: 18 inches below grade
- minimumDepth: 12 inches below grade
- rebarSpacing: 12 inches on center minimum
- concreteStrength: 3000 PSI minimum for residential
- waterproofing: Required on all below-grade walls
- drainage: Perimeter drain tile with washed stone required

## INSPECTION REQUIREMENTS:
Foundation inspection required before concrete pour

## REMAINING PHASES (in order):
1. Site Preparation
2. Utilities & Septic
3. Foundation
4. Post Frame Structure
5. Exterior Finishes
6. Plumbing Rough-In
7. In-Floor Heat (Optional)
8. Electrical Rough-In
9. Slab and Flatwork
10. Insulation & Air Sealing
11. Interior Framing & Blocking
12. HVAC Rough-In
13. Drywall
14. Paint
15. Trim Carpentry
16. Flooring
17. Kitchen & Bath
18. Final Touches & Punch List

## DETAILED REQUIREMENTS

For EACH phase, provide EXTREMELY DETAILED guidance including:

### 1. EXACT SPECIFICATIONS
- Precise measurements, tolerances, and material specifications
- Exact tool requirements and sizes
- Specific material grades and standards

### 2. STEP-BY-STEP BREAKDOWN
- Detailed sequence of operations
- Critical checkpoints and quality control steps
- Safety procedures and PPE requirements

### 3. SAFETY REQUIREMENTS
- Specific safety protocols for each task
- Required safety equipment and training
- Hazard identification and mitigation

### 4. CODE COMPLIANCE
- Richmond City, VA specific requirements
- Inspection checkpoints and documentation
- Common violations to avoid

### 5. QUALITY CONTROL
- Specific quality standards and measurements
- Testing and verification procedures
- Acceptance criteria for each step

### 6. TIMELINE BREAKDOWN
- Detailed time estimates for each task
- Critical path dependencies
- Weather and seasonal considerations

### 7. COST ESTIMATES
- Material costs with current pricing
- Labor time estimates
- Equipment rental costs if applicable

### 8. TRADE-SPECIFIC DETAILS
- Professional techniques and best practices
- Common mistakes and how to avoid them
- Industry standards and expectations

## ENHANCED TASK BREAKDOWN

For DIY phases, provide EXTRA DETAILED guidance:

### Interior Framing & Blocking
**Layout Tasks:**
- Measure and mark wall locations on floor with chalk line
- Transfer measurements to ceiling using plumb bob
- Mark stud locations every 16 inches on center
- Mark blocking locations for electrical and plumbing
- Verify square using 3-4-5 triangle method

**Cutting Tasks:**
- Cut top and bottom plates to exact length
- Cut studs to exact height (ceiling height minus plate thickness)
- Cut blocking pieces for electrical and plumbing penetrations
- Cut cripple studs for window and door openings

**Assembly Tasks:**
- Assemble wall sections on floor
- Install blocking at specified heights
- Pre-drill holes for electrical and plumbing
- Square and brace walls before standing

**Quality Control Tasks:**
- Verify all measurements within 1/8 inch tolerance
- Check that walls are perfectly plumb
- Ensure proper fire blocking installation
- Verify blocking is securely fastened

## IMPORTANT NOTES

**IMPORTANT**: Since this is a DIY phase, provide EXTRA DETAILED guidance that a complete beginner could follow. Include specific measurements, tool requirements, material specifications, and step-by-step procedures that leave no room for interpretation.

**Richmond City, VA Specific Requirements:**
- All work must comply with IRC 2021 with local amendments
- Permits required for structural work
- Inspections required at specified checkpoints
- Local building department: Richmond City Building Department

## OUTPUT FORMAT

Format your response as a COMPREHENSIVE, DETAILED checklist that a professional tradesperson would use. This should be detailed enough that someone could complete the work without asking a single question.

Structure your response as:
1. **Phase Overview** - Brief description and key considerations
2. **Detailed Task Breakdown** - Step-by-step procedures
3. **Quality Control** - Specific standards and checkpoints
4. **Safety & Code Compliance** - Requirements and procedures
5. **Timeline & Cost Estimates** - Realistic expectations
6. **Next Phase Preparation** - What to prepare for the following phase

Each task should include:
- Exact specifications and measurements
- Required tools and materials
- Step-by-step procedures
- Quality control checkpoints
- Safety considerations
- Code compliance requirements
```

## Key Observations

1. **Enhanced Detail System**: The prompt now includes 8 detailed requirement categories
2. **Phase-Specific Expert Prompts**: For DIY phases, it uses specialized expert personas
3. **Building Code Integration**: Richmond City, VA specific requirements are injected
4. **Enhanced Task Breakdown**: Granular, step-by-step procedures for complex tasks
5. **Richmond-Specific Context**: Local building codes, inspection requirements, and permit processes

## Why Detail Level Might Not Be Increasing

The enhanced detail system is implemented, but the AI might be:
1. **Truncating responses** due to token limits
2. **Not fully utilizing** the enhanced prompts
3. **Focusing on breadth** rather than depth
4. **Missing the granular task breakdowns**

## Next Steps

1. **Review the actual AI response** to see what's being generated
2. **Check if the enhanced prompts** are being fully utilized
3. **Verify the building code integration** is working
4. **Consider adjusting the prompt** to emphasize depth over breadth

Would you like me to show you what the actual AI response looks like, or would you prefer to test it yourself first?
