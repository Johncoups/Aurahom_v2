# Sample OpenAI Prompt for Post-Frame Construction

This document shows the complete prompt that gets sent to OpenAI based on the test profile in `/app/test-openai/page.tsx`.

## Test Profile Summary

- **Role**: General Contractor + DIY
- **Experience Level**: DIY - Tackled large enough projects that require permitting
- **Construction Method**: Post Frame/Pole Barn
- **Current Phase**: Pre-Construction Planning (Phase 1)
- **DIY Phases**: 7 phases selected
- **Weekly Time Commitment**: 20-30 hours per week
- **Location**: Richmond City, VA
- **Property Address**: 123 Main Street, Richmond City, VA 23220
- **Background**: Testing OpenAI integration for roadmap generation with post-frame construction and DIY phases

## Complete OpenAI Prompt

```
System: You are a residential construction project management expert. Based on the user's profile and current phase, provide detailed guidance for their construction project.

User Profile:
- Role: General Contractor + DIY (will be performing some parts of the build)
- Experience Level: DIY - Tackled large enough projects that require permitting
- Construction Method: Post Frame/Pole Barn
- Current Phase: Pre-Construction Planning
- DIY Phases: Interior Framing & Blocking, Plumbing Rough-In, Electrical Rough-In, HVAC Rough-In, Flooring, Kitchen & Bath, In-Floor Heat (Optional)
- Weekly Time Commitment: 20-30 hours per week
- Location: Richmond City, VA
- Property Address: 123 Main Street, Richmond City, VA 23220
- Additional Background: Testing OpenAI integration for roadmap generation with post-frame construction and DIY phases

Remaining Phases:
1. Pre-Construction Planning
2. Site Preparation
3. Utilities & Septic
4. Foundation
5. Post Frame Structure
6. Exterior Finishes
7. Plumbing Rough-In
8. In-Floor Heat (Optional)
9. Electrical Rough-In
10. Slab and Flatwork
11. Insulation & Air Sealing
12. Interior Framing & Blocking
13. HVAC Rough-In
14. Drywall
15. Paint
16. Trim Carpentry
17. Flooring
18. Kitchen & Bath
19. Final Touches & Punch List

Please provide:
1. Detailed breakdown of remaining phases with specific tasks and considerations for post-frame construction
2. Recommended timeline for each phase based on Weekly Time Commitment (20-30 hours/week), Location (Richmond City, VA), skill level (DIY with permitting experience), and local building codes, permit processes, inspection timeline
3. Special considerations for the 7 DIY phases selected by the user
4. Post-frame specific tips and best practices
5. Richmond City, VA specific permitting and inspection requirements
6. Risk mitigation strategies for DIY phases

Format your response as a JSON object with phases, tasks, and detailed guidance suitable for someone with DIY experience who has tackled large projects requiring permitting.
```

## Key Prompt Features

### 1. **System Message**
- Establishes the AI as a "residential construction project management expert"
- Sets the context for construction guidance

### 2. **User Profile Section**
- **Role**: Indicates GC + DIY approach
- **Experience**: DIY with permitting experience (not complete novice)
- **Construction Method**: Post-frame specific guidance
- **Current Phase**: Starting from the beginning
- **DIY Phases**: 7 specific phases selected for self-performance
- **Time Commitment**: 20-30 hours/week (moderate commitment)
- **Location**: Richmond City, VA (specific jurisdiction)
- **Property Address**: Site-specific considerations

### 3. **Remaining Phases**
- **19 total phases** for post-frame construction
- **Dynamic generation** from `getPhasesForMethod("post-frame")`
- **Sequential order** with dependencies

### 4. **Specific Request Items**
- **Detailed breakdown** of remaining phases
- **Timeline recommendations** based on:
  - Weekly time commitment (20-30 hours)
  - Location (Richmond City, VA)
  - Skill level (DIY with permitting experience)
  - Local building codes and processes
- **DIY phase considerations** for the 7 selected phases
- **Post-frame specific tips**
- **Richmond City specific requirements**
- **Risk mitigation strategies**

### 5. **Response Format**
- **JSON structure** for structured output
- **Tailored guidance** for DIY experience level
- **Permitting-aware** recommendations

## Expected AI Response

The AI should provide:
- **Phase-specific timelines** considering 20-30 hours/week availability
- **Richmond City permitting** requirements and timelines
- **Post-frame construction** best practices
- **DIY phase guidance** for the 7 selected phases
- **Risk assessment** and mitigation strategies
- **Local code compliance** considerations
- **Inspection scheduling** recommendations

## Notes

- **Current Phase**: Since user is at "pre-construction", all 19 phases are "remaining"
- **DIY Phases**: The AI will provide enhanced detail for the 7 selected DIY phases
- **Location Context**: Richmond City, VA specific guidance for permits, codes, and inspections
- **Time Realism**: 20-30 hours/week should result in realistic timelines
- **Experience Level**: DIY with permitting experience means more technical detail than complete novice
