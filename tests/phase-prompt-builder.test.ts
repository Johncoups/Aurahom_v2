/**
 * Phase Prompt Builder Test Suite
 * 
 * Tests the phase-specific prompt generation functionality
 */

import { describe, it, expect } from '@jest/globals'
import { buildPhasePrompt } from '@/lib/phase-prompt-builder'
import type { RegionalContext, ProjectContext, UserProfile } from '@/lib/unified-response-types'

describe('Phase Prompt Builder', () => {
  const mockRegionalContext: RegionalContext = {
    primaryClassification: 'Texas',
    climateZone: 'Hot-Humid',
    regulatoryEnvironment: 'Moderate Regulation',
    seasonalFactors: ['Summer heat', 'Spring storms'],
    marketConditions: 'Moderate costs',
    buildingCodeComplexity: 'Standard',
    multipliers: { cost: 1.0, timeline: 1.0 }
  }

  const mockProjectContext: ProjectContext = {
    constructionMethod: 'barndominium',
    foundationType: 'slab',
    houseSize: 'medium',
    stories: 'single-story',
    targetStartDate: '2024-06-01',
    constructionDetails: 'Barndominium construction details...',
    foundationDetails: 'Slab foundation details...',
    sizeDetails: 'Medium house size details...'
  }

  const mockUserProfile: UserProfile = {
    role: 'owner-builder',
    experience: 'intermediate',
    diyPhaseIds: ['site-prep', 'framing'],
    timeCommitment: 'part-time',
    location: {
      cityState: 'Austin, TX',
      propertyType: 'rural',
      lotSize: '2 acres'
    },
    background: {
      construction: 'construction',
      goals: 'cost-savings',
      challenges: 'permits',
      preferences: 'sustainable'
    }
  }

  describe('buildPhasePrompt', () => {
    it('should generate prompt for site preparation phase', async () => {
      const result = await buildPhasePrompt(
        'site-prep',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('Site Preparation')
      expect(result).toContain('Texas')
      expect(result).toContain('barndominium')
      expect(result).toContain('owner-builder')
      expect(result).toContain('Hot-Humid')
      expect(result).toContain('Summer heat')
    })

    it('should generate prompt for framing phase', async () => {
      const result = await buildPhasePrompt(
        'framing',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('Framing')
      expect(result).toContain('Texas')
      expect(result).toContain('barndominium')
      expect(result).toContain('owner-builder')
    })

    it('should generate prompt for electrical phase', async () => {
      const result = await buildPhasePrompt(
        'electrical',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('Electrical')
      expect(result).toContain('Texas')
      expect(result).toContain('barndominium')
    })

    it('should generate prompt for plumbing phase', async () => {
      const result = await buildPhasePrompt(
        'plumbing',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).toContain('Plumbing')
      expect(result).toContain('Texas')
      expect(result).toContain('barndominium')
    })

    it('should include regional context in prompt', async () => {
      const result = await buildPhasePrompt(
        'site-prep',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toContain('Texas')
      expect(result).toContain('Hot-Humid')
      expect(result).toContain('Moderate Regulation')
      expect(result).toContain('Summer heat')
      expect(result).toContain('Spring storms')
    })

    it('should include project context in prompt', async () => {
      const result = await buildPhasePrompt(
        'site-prep',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toContain('barndominium')
      expect(result).toContain('slab')
      expect(result).toContain('medium')
      expect(result).toContain('single-story')
    })

    it('should include user profile in prompt', async () => {
      const result = await buildPhasePrompt(
        'site-prep',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toContain('owner-builder')
      expect(result).toContain('intermediate')
      expect(result).toContain('part-time')
      expect(result).toContain('Austin, TX')
      expect(result).toContain('rural')
    })

    it('should handle different regional contexts', async () => {
      const californiaContext: RegionalContext = {
        ...mockRegionalContext,
        primaryClassification: 'California',
        climateZone: 'Mediterranean',
        regulatoryEnvironment: 'High Regulation',
        seasonalFactors: ['Mild winters', 'Dry summers'],
        multipliers: { cost: 1.2, timeline: 1.1 }
      }

      const result = await buildPhasePrompt(
        'site-prep',
        mockUserProfile,
        californiaContext,
        mockProjectContext
      )
      
      expect(result).toContain('California')
      expect(result).toContain('Mediterranean')
      expect(result).toContain('High Regulation')
      expect(result).toContain('Mild winters')
    })

    it('should handle different project contexts', async () => {
      const traditionalContext: ProjectContext = {
        ...mockProjectContext,
        constructionMethod: 'traditional',
        foundationType: 'basement',
        stories: 'two-story'
      }

      const result = await buildPhasePrompt(
        'site-prep',
        mockUserProfile,
        mockRegionalContext,
        traditionalContext
      )
      
      expect(result).toContain('traditional')
      expect(result).toContain('basement')
      expect(result).toContain('two-story')
    })

    it('should handle different user profiles', async () => {
      const contractorProfile: UserProfile = {
        ...mockUserProfile,
        role: 'contractor',
        experience: 'expert',
        diyPhaseIds: [],
        timeCommitment: 'full-time'
      }

      const result = await buildPhasePrompt(
        'site-prep',
        contractorProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toContain('contractor')
      expect(result).toContain('expert')
      expect(result).toContain('full-time')
    })

    it('should handle invalid phase ID gracefully', async () => {
      const result = await buildPhasePrompt(
        'invalid-phase',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should include phase-specific expert persona', async () => {
      const result = await buildPhasePrompt(
        'electrical',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toContain('electrical')
      expect(result).toContain('expert')
      expect(result).toContain('electrician')
    })

    it('should include timeline estimation requirements', async () => {
      const result = await buildPhasePrompt(
        'site-prep',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toContain('timeline')
      expect(result).toContain('duration')
      expect(result).toContain('weeks')
      expect(result).toContain('hours')
    })

    it('should include regional adjustment requirements', async () => {
      const result = await buildPhasePrompt(
        'site-prep',
        mockUserProfile,
        mockRegionalContext,
        mockProjectContext
      )
      
      expect(result).toContain('regional')
      expect(result).toContain('adjustment')
      expect(result).toContain('climate')
      expect(result).toContain('regulation')
    })
  })
})
