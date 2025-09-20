/**
 * Hybrid Roadmap System Test Suite
 * 
 * This test suite validates the hybrid approach implementation including:
 * - Regional analysis generation
 * - Project context building
 * - Phase prompt generation
 * - Unified response assembly
 * - Error handling and fallbacks
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Mock external dependencies
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        }))
      }))
    }))
  }
}))

jest.mock('openai', () => ({
  OpenAI: jest.fn(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
}))

// Import modules to test
import { generateRegionalAnalysis } from '@/lib/regional-analysis'
import { buildProjectContext } from '@/lib/project-context'
import { buildUserProfile } from '@/lib/user-profile-builder'
import { buildPhasePrompt } from '@/lib/phase-prompt-builder'
import { parsePhaseResponse } from '@/lib/phase-response-parser'
import { assembleUnifiedResponse } from '@/lib/response-assembler'
import { generateHybridRoadmap } from '@/lib/hybrid-roadmap-generator'
import type { OnboardingProfile } from '@/lib/roadmap-types'
import type { CompleteProjectResponse } from '@/lib/unified-response-types'

describe('Hybrid Roadmap System', () => {
  let mockUserProfile: OnboardingProfile

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Create mock user profile
    mockUserProfile = {
      role: 'owner-builder',
      experience: 'intermediate',
      constructionMethod: 'barndominium',
      foundationType: 'slab',
      houseSize: 'medium',
      stories: 'single-story',
      targetStartDate: '2024-06-01',
      cityState: 'Austin, TX',
      propertyType: 'rural',
      lotSize: '2 acres',
      budget: 300000,
      timeline: 'flexible',
      diyPhaseIds: ['site-prep', 'framing', 'electrical'],
      timeCommitment: 'part-time',
      background: 'construction',
      goals: 'cost-savings',
      challenges: 'permits',
      preferences: 'sustainable'
    }
  })

  describe('Regional Analysis Generation', () => {
    it('should generate regional analysis for California location', async () => {
      const californiaProfile = {
        ...mockUserProfile,
        cityState: 'San Francisco, CA'
      }

      const result = await generateRegionalAnalysis(californiaProfile.cityState)
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toContain('California')
      expect(result.regulatoryEnvironment).toContain('High Regulation')
      expect(result.climateZone).toBeDefined()
      expect(result.seasonalFactors).toBeDefined()
      expect(result.marketConditions).toBeDefined()
      expect(result.buildingCodeComplexity).toBeDefined()
      expect(result.multipliers).toBeDefined()
    })

    it('should generate regional analysis for Texas location', async () => {
      const texasProfile = {
        ...mockUserProfile,
        cityState: 'Austin, TX'
      }

      const result = await generateRegionalAnalysis(texasProfile.cityState)
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toContain('Texas')
      expect(result.regulatoryEnvironment).toContain('Moderate Regulation')
      expect(result.climateZone).toBeDefined()
      expect(result.seasonalFactors).toBeDefined()
    })

    it('should handle invalid location gracefully', async () => {
      const result = await generateRegionalAnalysis('Invalid Location')
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toBeDefined()
      expect(result.regulatoryEnvironment).toBeDefined()
    })
  })

  describe('Project Context Building', () => {
    it('should build project context for barndominium', () => {
      const result = buildProjectContext(mockUserProfile)
      
      expect(result).toBeDefined()
      expect(result.constructionMethod).toBe('barndominium')
      expect(result.foundationType).toBe('slab')
      expect(result.houseSize).toBe('medium')
      expect(result.stories).toBe('single-story')
      expect(result.targetStartDate).toBe('2024-06-01')
      expect(result.constructionDetails).toBeDefined()
      expect(result.foundationDetails).toBeDefined()
      expect(result.sizeDetails).toBeDefined()
    })

    it('should build project context for traditional home', () => {
      const traditionalProfile = {
        ...mockUserProfile,
        constructionMethod: 'traditional',
        foundationType: 'basement',
        stories: 'two-story'
      }

      const result = buildProjectContext(traditionalProfile)
      
      expect(result).toBeDefined()
      expect(result.constructionMethod).toBe('traditional')
      expect(result.foundationType).toBe('basement')
      expect(result.stories).toBe('two-story')
    })
  })

  describe('User Profile Building', () => {
    it('should build user profile with all details', () => {
      const result = buildUserProfile(mockUserProfile)
      
      expect(result).toBeDefined()
      expect(result.role).toBe('owner-builder')
      expect(result.experience).toBe('intermediate')
      expect(result.diyPhaseIds).toEqual(['site-prep', 'framing', 'electrical'])
      expect(result.timeCommitment).toBe('part-time')
      expect(result.location).toBeDefined()
      expect(result.background).toBeDefined()
    })

    it('should handle minimal user profile', () => {
      const minimalProfile = {
        role: 'owner-builder' as const,
        experience: 'beginner' as const,
        constructionMethod: 'barndominium' as const,
        foundationType: 'slab' as const,
        houseSize: 'small' as const,
        stories: 'single-story' as const,
        targetStartDate: '2024-06-01',
        cityState: 'Austin, TX',
        propertyType: 'rural' as const,
        lotSize: '1 acre',
        budget: 200000,
        timeline: 'flexible' as const,
        diyPhaseIds: [],
        timeCommitment: 'minimal' as const,
        background: 'none' as const,
        goals: 'cost-savings' as const,
        challenges: 'permits' as const,
        preferences: 'simple' as const
      }

      const result = buildUserProfile(minimalProfile)
      
      expect(result).toBeDefined()
      expect(result.role).toBe('owner-builder')
      expect(result.diyPhaseIds).toEqual([])
    })
  })

  describe('Phase Prompt Generation', () => {
    it('should generate phase prompt for site prep', async () => {
      const regionalContext = {
        primaryClassification: 'Texas',
        climateZone: 'Hot-Humid',
        regulatoryEnvironment: 'Moderate Regulation',
        seasonalFactors: ['Summer heat', 'Spring storms'],
        marketConditions: 'Moderate costs',
        buildingCodeComplexity: 'Standard',
        multipliers: { cost: 1.0, timeline: 1.0 }
      }

      const projectContext = buildProjectContext(mockUserProfile)
      const userProfile = buildUserProfile(mockUserProfile)

      const result = await buildPhasePrompt(
        'site-prep',
        userProfile,
        regionalContext,
        projectContext
      )
      
      expect(result).toBeDefined()
      expect(result).toContain('Site Preparation')
      expect(result).toContain('Texas')
      expect(result).toContain('barndominium')
      expect(result).toContain('owner-builder')
    })

    it('should generate phase prompt for framing', async () => {
      const regionalContext = {
        primaryClassification: 'California',
        climateZone: 'Mediterranean',
        regulatoryEnvironment: 'High Regulation',
        seasonalFactors: ['Mild winters', 'Dry summers'],
        marketConditions: 'High costs',
        buildingCodeComplexity: 'Complex',
        multipliers: { cost: 1.2, timeline: 1.1 }
      }

      const projectContext = buildProjectContext(mockUserProfile)
      const userProfile = buildUserProfile(mockUserProfile)

      const result = await buildPhasePrompt(
        'framing',
        userProfile,
        regionalContext,
        projectContext
      )
      
      expect(result).toBeDefined()
      expect(result).toContain('Framing')
      expect(result).toContain('California')
      expect(result).toContain('High Regulation')
    })
  })

  describe('Phase Response Parsing', () => {
    it('should parse valid phase response', () => {
      const mockResponse = `
        **Timeline Estimate:**
        - DIY Duration: 4 weeks
        - Contractor Duration: 2 weeks
        - DIY Hours: 120 hours
        
        **Phase Guidance:**
        This phase involves preparing the site for construction...
        
        **Regional Adjustments:**
        - Consider Texas heat during summer months
        - Plan for potential spring storms
        
        **Expert Insights:**
        - Pro Tips: Start early in the morning to avoid heat
        - Common Mistakes: Not accounting for weather delays
        - Cost-Saving Tips: Rent equipment instead of buying
        - Quality Checkpoints: Verify soil compaction
      `

      const result = parsePhaseResponse(mockResponse, 'site-prep')
      
      expect(result).toBeDefined()
      expect(result.phaseId).toBe('site-prep')
      expect(result.timelineEstimate).toBeDefined()
      expect(result.timelineEstimate.diyDuration).toContain('4 weeks')
      expect(result.timelineEstimate.contractorDuration).toContain('2 weeks')
      expect(result.timelineEstimate.diyHours).toContain('120 hours')
      expect(result.phaseGuidance).toBeDefined()
      expect(result.regionalAdjustments).toBeDefined()
      expect(result.expertInsights).toBeDefined()
    })

    it('should handle malformed response gracefully', () => {
      const malformedResponse = 'Invalid response format'
      
      const result = parsePhaseResponse(malformedResponse, 'site-prep')
      
      expect(result).toBeDefined()
      expect(result.phaseId).toBe('site-prep')
      expect(result.timelineEstimate).toBeDefined()
      expect(result.phaseGuidance).toBeDefined()
    })
  })

  describe('Unified Response Assembly', () => {
    it('should assemble unified response from phase results', () => {
      const phaseResults = {
        'site-prep': {
          phaseId: 'site-prep',
          phaseTitle: 'Site Preparation',
          timelineEstimate: {
            diyDuration: '4 weeks',
            contractorDuration: '2 weeks',
            diyHours: '120 hours'
          },
          phaseGuidance: 'Site preparation guidance...',
          regionalAdjustments: 'Texas-specific adjustments...',
          expertInsights: {
            proTips: ['Start early in the morning'],
            commonMistakes: ['Not accounting for weather delays'],
            costSavingTips: ['Rent equipment instead of buying'],
            qualityCheckpoints: ['Verify soil compaction']
          }
        },
        'framing': {
          phaseId: 'framing',
          phaseTitle: 'Framing',
          timelineEstimate: {
            diyDuration: '8 weeks',
            contractorDuration: '4 weeks',
            diyHours: '240 hours'
          },
          phaseGuidance: 'Framing guidance...',
          regionalAdjustments: 'Texas-specific adjustments...',
          expertInsights: {
            proTips: ['Use proper safety equipment'],
            commonMistakes: ['Incorrect measurements'],
            costSavingTips: ['Buy materials in bulk'],
            qualityCheckpoints: ['Check for square corners']
          }
        }
      }

      const regionalContext = {
        primaryClassification: 'Texas',
        climateZone: 'Hot-Humid',
        regulatoryEnvironment: 'Moderate Regulation',
        seasonalFactors: ['Summer heat', 'Spring storms'],
        marketConditions: 'Moderate costs',
        buildingCodeComplexity: 'Standard',
        multipliers: { cost: 1.0, timeline: 1.0 }
      }

      const result = assembleUnifiedResponse(phaseResults, regionalContext)
      
      expect(result).toBeDefined()
      expect(result.regionalAnalysis).toEqual(regionalContext)
      expect(result.phaseResponses).toHaveLength(2)
      expect(result.phaseResponses[0].phaseId).toBe('site-prep')
      expect(result.phaseResponses[1].phaseId).toBe('framing')
      expect(result.totalTimeline).toBeDefined()
      expect(result.totalCost).toBeDefined()
    })
  })

  describe('Hybrid Roadmap Generation', () => {
    it('should generate complete hybrid roadmap', async () => {
      // Mock OpenAI response
      const mockOpenAI = require('openai').OpenAI
      const mockCreate = jest.fn()
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      // Mock successful API responses
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              primaryClassification: 'Texas',
              climateZone: 'Hot-Humid',
              regulatoryEnvironment: 'Moderate Regulation',
              seasonalFactors: ['Summer heat', 'Spring storms'],
              marketConditions: 'Moderate costs',
              buildingCodeComplexity: 'Standard',
              multipliers: { cost: 1.0, timeline: 1.0 }
            })
          }
        }]
      })

      const result = await generateHybridRoadmap(mockUserProfile, 'test-project-id')
      
      expect(result).toBeDefined()
      expect(result.regionalAnalysis).toBeDefined()
      expect(result.phaseResponses).toBeDefined()
      expect(Array.isArray(result.phaseResponses)).toBe(true)
      expect(result.totalTimeline).toBeDefined()
      expect(result.totalCost).toBeDefined()
    })

    it('should handle API errors gracefully', async () => {
      // Mock OpenAI error
      const mockOpenAI = require('openai').OpenAI
      const mockCreate = jest.fn()
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      mockCreate.mockRejectedValue(new Error('API Error'))

      const result = await generateHybridRoadmap(mockUserProfile, 'test-project-id')
      
      expect(result).toBeDefined()
      expect(result.regionalAnalysis).toBeDefined()
      expect(result.phaseResponses).toBeDefined()
      // Should still return a valid response even with API errors
    })
  })

  describe('Error Handling and Fallbacks', () => {
    it('should handle missing environment variables', async () => {
      const originalEnv = process.env.OPENAI_API_KEY
      delete process.env.OPENAI_API_KEY

      const result = await generateHybridRoadmap(mockUserProfile, 'test-project-id')
      
      expect(result).toBeDefined()
      expect(result.regionalAnalysis).toBeDefined()
      expect(result.phaseResponses).toBeDefined()

      // Restore environment variable
      process.env.OPENAI_API_KEY = originalEnv
    })

    it('should handle invalid user profile', async () => {
      const invalidProfile = {
        role: 'owner-builder' as const,
        experience: 'intermediate' as const,
        constructionMethod: 'barndominium' as const,
        foundationType: 'slab' as const,
        houseSize: 'medium' as const,
        stories: 'single-story' as const,
        targetStartDate: '2024-06-01',
        cityState: '', // Invalid empty city
        propertyType: 'rural' as const,
        lotSize: '2 acres',
        budget: 300000,
        timeline: 'flexible' as const,
        diyPhaseIds: ['site-prep'],
        timeCommitment: 'part-time' as const,
        background: 'construction' as const,
        goals: 'cost-savings' as const,
        challenges: 'permits' as const,
        preferences: 'sustainable' as const
      }

      const result = await generateHybridRoadmap(invalidProfile, 'test-project-id')
      
      expect(result).toBeDefined()
      expect(result.regionalAnalysis).toBeDefined()
      expect(result.phaseResponses).toBeDefined()
    })

    it('should handle database connection errors', async () => {
      // Mock Supabase error
      const mockSupabase = require('@/lib/supabase').supabase
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const result = await generateHybridRoadmap(mockUserProfile, 'test-project-id')
      
      expect(result).toBeDefined()
      expect(result.regionalAnalysis).toBeDefined()
      expect(result.phaseResponses).toBeDefined()
    })
  })

  describe('Performance and Integration', () => {
    it('should complete within reasonable time', async () => {
      const startTime = Date.now()
      
      const result = await generateHybridRoadmap(mockUserProfile, 'test-project-id')
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      expect(result).toBeDefined()
      expect(duration).toBeLessThan(30000) // Should complete within 30 seconds
    })

    it('should handle concurrent requests', async () => {
      const promises = Array(5).fill(null).map((_, index) => 
        generateHybridRoadmap(
          { ...mockUserProfile, cityState: `City ${index}, TX` }, 
          `test-project-${index}`
        )
      )

      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(result).toBeDefined()
        expect(result.regionalAnalysis).toBeDefined()
        expect(result.phaseResponses).toBeDefined()
      })
    })
  })
})
