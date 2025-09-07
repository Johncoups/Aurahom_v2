/**
 * Regional Analysis Test Suite
 * 
 * Tests the regional analysis generation functionality
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { generateRegionalAnalysis } from '@/lib/regional-analysis'

describe('Regional Analysis', () => {
  describe('generateRegionalAnalysis', () => {
    it('should generate analysis for California locations', async () => {
      const result = await generateRegionalAnalysis('San Francisco, CA')
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toContain('California')
      expect(result.regulatoryEnvironment).toContain('High Regulation')
      expect(result.climateZone).toBeDefined()
      expect(result.seasonalFactors).toBeDefined()
      expect(result.marketConditions).toBeDefined()
      expect(result.buildingCodeComplexity).toBeDefined()
      expect(result.multipliers).toBeDefined()
      expect(typeof result.multipliers.cost).toBe('number')
      expect(typeof result.multipliers.timeline).toBe('number')
    })

    it('should generate analysis for Texas locations', async () => {
      const result = await generateRegionalAnalysis('Austin, TX')
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toContain('Texas')
      expect(result.regulatoryEnvironment).toContain('Moderate Regulation')
      expect(result.climateZone).toBeDefined()
      expect(result.seasonalFactors).toBeDefined()
    })

    it('should generate analysis for Florida locations', async () => {
      const result = await generateRegionalAnalysis('Miami, FL')
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toContain('Florida')
      expect(result.climateZone).toContain('Hot-Humid')
      expect(result.seasonalFactors).toContain('Hurricane season')
    })

    it('should generate analysis for New York locations', async () => {
      const result = await generateRegionalAnalysis('New York, NY')
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toContain('New York')
      expect(result.regulatoryEnvironment).toContain('High Regulation')
      expect(result.climateZone).toContain('Cold')
    })

    it('should handle invalid locations gracefully', async () => {
      const result = await generateRegionalAnalysis('Invalid Location')
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toBeDefined()
      expect(result.regulatoryEnvironment).toBeDefined()
      expect(result.climateZone).toBeDefined()
    })

    it('should handle empty location gracefully', async () => {
      const result = await generateRegionalAnalysis('')
      
      expect(result).toBeDefined()
      expect(result.primaryClassification).toBeDefined()
      expect(result.regulatoryEnvironment).toBeDefined()
    })

    it('should return consistent multipliers for same location', async () => {
      const result1 = await generateRegionalAnalysis('Austin, TX')
      const result2 = await generateRegionalAnalysis('Austin, TX')
      
      expect(result1.multipliers.cost).toBe(result2.multipliers.cost)
      expect(result1.multipliers.timeline).toBe(result2.multipliers.timeline)
    })

    it('should return different multipliers for different locations', async () => {
      const californiaResult = await generateRegionalAnalysis('San Francisco, CA')
      const texasResult = await generateRegionalAnalysis('Austin, TX')
      
      // California should generally have higher multipliers due to higher costs
      expect(californiaResult.multipliers.cost).toBeGreaterThanOrEqual(texasResult.multipliers.cost)
    })
  })
})
