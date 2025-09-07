/**
 * Project Context Test Suite
 * 
 * Tests the project context building functionality
 */

import { describe, it, expect } from '@jest/globals'
import { buildProjectContext } from '@/lib/project-context'
import type { OnboardingProfile } from '@/lib/roadmap-types'

describe('Project Context', () => {
  const baseProfile: OnboardingProfile = {
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
    diyPhaseIds: ['site-prep', 'framing'],
    timeCommitment: 'part-time',
    background: 'construction',
    goals: 'cost-savings',
    challenges: 'permits',
    preferences: 'sustainable'
  }

  describe('buildProjectContext', () => {
    it('should build context for barndominium with slab foundation', () => {
      const result = buildProjectContext(baseProfile)
      
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

    it('should build context for traditional home with basement', () => {
      const traditionalProfile = {
        ...baseProfile,
        constructionMethod: 'traditional',
        foundationType: 'basement',
        stories: 'two-story'
      }

      const result = buildProjectContext(traditionalProfile)
      
      expect(result).toBeDefined()
      expect(result.constructionMethod).toBe('traditional')
      expect(result.foundationType).toBe('basement')
      expect(result.stories).toBe('two-story')
      expect(result.constructionDetails).toContain('traditional')
      expect(result.foundationDetails).toContain('basement')
    })

    it('should build context for modular home with crawl space', () => {
      const modularProfile = {
        ...baseProfile,
        constructionMethod: 'modular',
        foundationType: 'crawl-space',
        houseSize: 'large'
      }

      const result = buildProjectContext(modularProfile)
      
      expect(result).toBeDefined()
      expect(result.constructionMethod).toBe('modular')
      expect(result.foundationType).toBe('crawl-space')
      expect(result.houseSize).toBe('large')
      expect(result.constructionDetails).toContain('modular')
      expect(result.foundationDetails).toContain('crawl space')
    })

    it('should handle different house sizes', () => {
      const sizes = ['small', 'medium', 'large'] as const
      
      sizes.forEach(size => {
        const profile = { ...baseProfile, houseSize: size }
        const result = buildProjectContext(profile)
        
        expect(result).toBeDefined()
        expect(result.houseSize).toBe(size)
        expect(result.sizeDetails).toBeDefined()
      })
    })

    it('should handle different story counts', () => {
      const stories = ['single-story', 'two-story', 'multi-story'] as const
      
      stories.forEach(story => {
        const profile = { ...baseProfile, stories: story }
        const result = buildProjectContext(profile)
        
        expect(result).toBeDefined()
        expect(result.stories).toBe(story)
        expect(result.sizeDetails).toBeDefined()
      })
    })

    it('should handle different foundation types', () => {
      const foundations = ['slab', 'basement', 'crawl-space', 'pier-beam'] as const
      
      foundations.forEach(foundation => {
        const profile = { ...baseProfile, foundationType: foundation }
        const result = buildProjectContext(profile)
        
        expect(result).toBeDefined()
        expect(result.foundationType).toBe(foundation)
        expect(result.foundationDetails).toBeDefined()
      })
    })

    it('should include target start date in context', () => {
      const result = buildProjectContext(baseProfile)
      
      expect(result).toBeDefined()
      expect(result.targetStartDate).toBe('2024-06-01')
    })

    it('should handle missing optional fields gracefully', () => {
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

      const result = buildProjectContext(minimalProfile)
      
      expect(result).toBeDefined()
      expect(result.constructionMethod).toBe('barndominium')
      expect(result.foundationType).toBe('slab')
      expect(result.houseSize).toBe('small')
    })
  })
})
