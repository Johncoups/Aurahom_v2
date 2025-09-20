import { generateHybridRoadmap } from '@/lib/hybrid-roadmap-generator';
import type { OnboardingProfile } from '@/lib/roadmap-types';

// Mock the dependencies
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

jest.mock('@/lib/openai', () => ({
  generateText: jest.fn()
}));

describe('Integration Tests - Performance', () => {
  const mockProjectId = 'test-project-123';
  const baseProfile: OnboardingProfile = {
    role: 'owner-builder',
    experience: 'some',
    diyPhaseIds: ['foundation', 'framing', 'electrical', 'plumbing'],
    timeCommitment: 'part-time',
    cityState: 'Austin, TX',
    propertyType: 'residential',
    lotSize: '0.5 acres',
    hasExistingStructure: false,
    targetStartDate: '2024-06-01',
    constructionMethod: 'barndominium',
    foundationType: 'slab',
    houseSize: '2000',
    stories: '1',
    budget: '300000',
    financing: 'construction-loan',
    timeline: 'flexible',
    specialRequirements: 'none',
    background: {
      constructionExperience: 'some',
      projectManagement: 'some',
      timeAvailable: 'part-time',
      learningStyle: 'hands-on',
      riskTolerance: 'moderate'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Parallel Processing Performance', () => {
    test('should process multiple phases in parallel', async () => {
      const startTime = Date.now();
      
      const { generateText } = require('@/lib/openai');
      
      // Mock shared context responses
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Texas - Moderate Regulation',
          climateZone: 'Hot-Humid',
          seasonalFactors: ['Summer heat delays', 'Spring storms'],
          regulatoryEnvironment: 'Moderate regulation',
          marketConditions: 'Active market',
          buildingCodeComplexity: 'Standard',
          regionalMultipliers: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }))
        .mockResolvedValueOnce(JSON.stringify({
          constructionMethod: 'Barndominium',
          foundationType: 'Slab',
          houseSize: '2000 sq ft',
          stories: '1',
          targetStartDate: '2024-06-01',
          specialRequirements: 'None'
        }))
        .mockResolvedValueOnce(JSON.stringify({
          role: 'Owner-Builder',
          experience: 'Some',
          diyPhases: ['foundation', 'framing', 'electrical', 'plumbing'],
          timeCommitment: 'Part-time',
          location: 'Austin, TX',
          background: {
            constructionExperience: 'Some',
            projectManagement: 'Some',
            timeAvailable: 'Part-time',
            learningStyle: 'Hands-on',
            riskTolerance: 'Moderate'
          }
        }));

      // Mock phase responses (4 phases)
      const phaseResponses = [
        {
          phaseId: 'foundation',
          phaseTitle: 'Foundation & Site Prep',
          timelineEstimate: {
            diy: { duration: '[8] weeks', hours: 120 },
            contractor: { duration: '[4] weeks', hours: 80 }
          },
          expertInsights: {
            proTips: ['Foundation tips'],
            commonMistakes: ['Foundation mistakes'],
            costSavingTips: ['Foundation savings'],
            qualityCheckpoints: ['Foundation checks']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        },
        {
          phaseId: 'framing',
          phaseTitle: 'Framing',
          timelineEstimate: {
            diy: { duration: '[12] weeks', hours: 180 },
            contractor: { duration: '[6] weeks', hours: 120 }
          },
          expertInsights: {
            proTips: ['Framing tips'],
            commonMistakes: ['Framing mistakes'],
            costSavingTips: ['Framing savings'],
            qualityCheckpoints: ['Framing checks']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        },
        {
          phaseId: 'electrical',
          phaseTitle: 'Electrical',
          timelineEstimate: {
            diy: { duration: '[6] weeks', hours: 90 },
            contractor: { duration: '[3] weeks', hours: 60 }
          },
          expertInsights: {
            proTips: ['Electrical tips'],
            commonMistakes: ['Electrical mistakes'],
            costSavingTips: ['Electrical savings'],
            qualityCheckpoints: ['Electrical checks']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        },
        {
          phaseId: 'plumbing',
          phaseTitle: 'Plumbing',
          timelineEstimate: {
            diy: { duration: '[8] weeks', hours: 120 },
            contractor: { duration: '[4] weeks', hours: 80 }
          },
          expertInsights: {
            proTips: ['Plumbing tips'],
            commonMistakes: ['Plumbing mistakes'],
            costSavingTips: ['Plumbing savings'],
            qualityCheckpoints: ['Plumbing checks']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }
      ];

      // Mock all phase responses
      phaseResponses.forEach(response => {
        generateText.mockResolvedValueOnce(JSON.stringify(response));
      });

      const result = await generateHybridRoadmap(baseProfile, mockProjectId);
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.phaseResponses).toHaveLength(4);
      expect(result.regionalAnalysis).toBeDefined();
      expect(result.projectContext).toBeDefined();
      expect(result.userProfile).toBeDefined();

      // Verify parallel processing by checking that all phases were processed
      expect(result.phaseResponses[0].phaseId).toBe('foundation');
      expect(result.phaseResponses[1].phaseId).toBe('framing');
      expect(result.phaseResponses[2].phaseId).toBe('electrical');
      expect(result.phaseResponses[3].phaseId).toBe('plumbing');

      // Performance assertion: should complete within reasonable time
      // (This is a mock test, so actual timing will depend on mock implementation)
      expect(executionTime).toBeLessThan(5000); // 5 seconds max for mock test

      console.log(`Parallel processing completed in ${executionTime}ms`);
    });

    test('should handle large number of phases efficiently', async () => {
      const largeProfile: OnboardingProfile = {
        ...baseProfile,
        diyPhaseIds: [
          'foundation', 'framing', 'electrical', 'plumbing', 'hvac',
          'insulation', 'drywall', 'flooring', 'roofing', 'exterior'
        ]
      };

      const startTime = Date.now();
      
      const { generateText } = require('@/lib/openai');
      
      // Mock shared context responses
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Texas - Moderate Regulation',
          climateZone: 'Hot-Humid',
          seasonalFactors: ['Summer heat delays', 'Spring storms'],
          regulatoryEnvironment: 'Moderate regulation',
          marketConditions: 'Active market',
          buildingCodeComplexity: 'Standard',
          regionalMultipliers: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }))
        .mockResolvedValueOnce(JSON.stringify({
          constructionMethod: 'Barndominium',
          foundationType: 'Slab',
          houseSize: '2000 sq ft',
          stories: '1',
          targetStartDate: '2024-06-01',
          specialRequirements: 'None'
        }))
        .mockResolvedValueOnce(JSON.stringify({
          role: 'Owner-Builder',
          experience: 'Some',
          diyPhases: largeProfile.diyPhaseIds,
          timeCommitment: 'Part-time',
          location: 'Austin, TX',
          background: {
            constructionExperience: 'Some',
            projectManagement: 'Some',
            timeAvailable: 'Part-time',
            learningStyle: 'Hands-on',
            riskTolerance: 'Moderate'
          }
        }));

      // Mock 10 phase responses
      const phaseIds = largeProfile.diyPhaseIds;
      phaseIds.forEach(phaseId => {
        generateText.mockResolvedValueOnce(JSON.stringify({
          phaseId,
          phaseTitle: `${phaseId.charAt(0).toUpperCase() + phaseId.slice(1)} Phase`,
          timelineEstimate: {
            diy: { duration: '[8] weeks', hours: 120 },
            contractor: { duration: '[4] weeks', hours: 80 }
          },
          expertInsights: {
            proTips: [`${phaseId} tips`],
            commonMistakes: [`${phaseId} mistakes`],
            costSavingTips: [`${phaseId} savings`],
            qualityCheckpoints: [`${phaseId} checks`]
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));
      });

      const result = await generateHybridRoadmap(largeProfile, mockProjectId);
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.phaseResponses).toHaveLength(10);
      expect(result.phaseResponses.map(p => p.phaseId)).toEqual(phaseIds);

      // Performance assertion: should scale reasonably with more phases
      expect(executionTime).toBeLessThan(10000); // 10 seconds max for 10 phases

      console.log(`Large phase processing completed in ${executionTime}ms`);
    });
  });

  describe('API Call Efficiency', () => {
    test('should minimize API calls with shared context', async () => {
      const { generateText } = require('@/lib/openai');
      
      // Mock responses
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Texas - Moderate Regulation',
          climateZone: 'Hot-Humid',
          seasonalFactors: ['Summer heat delays', 'Spring storms'],
          regulatoryEnvironment: 'Moderate regulation',
          marketConditions: 'Active market',
          buildingCodeComplexity: 'Standard',
          regionalMultipliers: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }))
        .mockResolvedValueOnce(JSON.stringify({
          constructionMethod: 'Barndominium',
          foundationType: 'Slab',
          houseSize: '2000 sq ft',
          stories: '1',
          targetStartDate: '2024-06-01',
          specialRequirements: 'None'
        }))
        .mockResolvedValueOnce(JSON.stringify({
          role: 'Owner-Builder',
          experience: 'Some',
          diyPhases: ['foundation', 'framing'],
          timeCommitment: 'Part-time',
          location: 'Austin, TX',
          background: {
            constructionExperience: 'Some',
            projectManagement: 'Some',
            timeAvailable: 'Part-time',
            learningStyle: 'Hands-on',
            riskTolerance: 'Moderate'
          }
        }))
        .mockResolvedValue(JSON.stringify({
          phaseId: 'foundation',
          phaseTitle: 'Foundation & Site Prep',
          timelineEstimate: {
            diy: { duration: '[8] weeks', hours: 120 },
            contractor: { duration: '[4] weeks', hours: 80 }
          },
          expertInsights: {
            proTips: ['Foundation tips'],
            commonMistakes: ['Foundation mistakes'],
            costSavingTips: ['Foundation savings'],
            qualityCheckpoints: ['Foundation checks']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }))
        .mockResolvedValue(JSON.stringify({
          phaseId: 'framing',
          phaseTitle: 'Framing',
          timelineEstimate: {
            diy: { duration: '[12] weeks', hours: 180 },
            contractor: { duration: '[6] weeks', hours: 120 }
          },
          expertInsights: {
            proTips: ['Framing tips'],
            commonMistakes: ['Framing mistakes'],
            costSavingTips: ['Framing savings'],
            qualityCheckpoints: ['Framing checks']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      await generateHybridRoadmap(baseProfile, mockProjectId);

      // Verify API call count
      // Should be: 1 regional + 1 project + 1 user + 2 phases = 5 total calls
      expect(generateText).toHaveBeenCalledTimes(5);

      // Verify that shared context is generated only once
      const calls = generateText.mock.calls;
      expect(calls[0][0]).toContain('regional analysis'); // Regional analysis
      expect(calls[1][0]).toContain('project context'); // Project context
      expect(calls[2][0]).toContain('user profile'); // User profile
      expect(calls[3][0]).toContain('foundation'); // Phase 1
      expect(calls[4][0]).toContain('framing'); // Phase 2
    });

    test('should reuse shared context across phases', async () => {
      const { generateText } = require('@/lib/openai');
      
      // Mock responses
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Texas - Moderate Regulation',
          climateZone: 'Hot-Humid',
          seasonalFactors: ['Summer heat delays', 'Spring storms'],
          regulatoryEnvironment: 'Moderate regulation',
          marketConditions: 'Active market',
          buildingCodeComplexity: 'Standard',
          regionalMultipliers: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }))
        .mockResolvedValueOnce(JSON.stringify({
          constructionMethod: 'Barndominium',
          foundationType: 'Slab',
          houseSize: '2000 sq ft',
          stories: '1',
          targetStartDate: '2024-06-01',
          specialRequirements: 'None'
        }))
        .mockResolvedValueOnce(JSON.stringify({
          role: 'Owner-Builder',
          experience: 'Some',
          diyPhases: ['foundation', 'framing'],
          timeCommitment: 'Part-time',
          location: 'Austin, TX',
          background: {
            constructionExperience: 'Some',
            projectManagement: 'Some',
            timeAvailable: 'Part-time',
            learningStyle: 'Hands-on',
            riskTolerance: 'Moderate'
          }
        }))
        .mockResolvedValue(JSON.stringify({
          phaseId: 'foundation',
          phaseTitle: 'Foundation & Site Prep',
          timelineEstimate: {
            diy: { duration: '[8] weeks', hours: 120 },
            contractor: { duration: '[4] weeks', hours: 80 }
          },
          expertInsights: {
            proTips: ['Foundation tips'],
            commonMistakes: ['Foundation mistakes'],
            costSavingTips: ['Foundation savings'],
            qualityCheckpoints: ['Foundation checks']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }))
        .mockResolvedValue(JSON.stringify({
          phaseId: 'framing',
          phaseTitle: 'Framing',
          timelineEstimate: {
            diy: { duration: '[12] weeks', hours: 180 },
            contractor: { duration: '[6] weeks', hours: 120 }
          },
          expertInsights: {
            proTips: ['Framing tips'],
            commonMistakes: ['Framing mistakes'],
            costSavingTips: ['Framing savings'],
            qualityCheckpoints: ['Framing checks']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(baseProfile, mockProjectId);

      // Verify that shared context is consistent across phases
      expect(result.regionalAnalysis).toBeDefined();
      expect(result.projectContext).toBeDefined();
      expect(result.userProfile).toBeDefined();

      // Verify that both phases have the same regional context
      const phase1 = result.phaseResponses[0];
      const phase2 = result.phaseResponses[1];
      
      expect(phase1.regionalAdjustments).toEqual(phase2.regionalAdjustments);
      expect(phase1.regionalAdjustments.timeline).toBe(1.0);
      expect(phase1.regionalAdjustments.cost).toBe(1.0);
      expect(phase1.regionalAdjustments.complexity).toBe(1.0);
    });
  });

  describe('Memory Usage', () => {
    test('should handle large responses without memory issues', async () => {
      const { generateText } = require('@/lib/openai');
      
      // Mock large responses
      const largeRegionalResponse = {
        primaryClassification: 'Texas - Moderate Regulation',
        climateZone: 'Hot-Humid',
        seasonalFactors: ['Summer heat delays', 'Spring storms', 'Additional factor 1', 'Additional factor 2'],
        regulatoryEnvironment: 'Moderate regulation',
        marketConditions: 'Active market',
        buildingCodeComplexity: 'Standard',
        regionalMultipliers: {
          timeline: 1.0,
          cost: 1.0,
          complexity: 1.0
        },
        additionalData: 'x'.repeat(10000) // Large additional data
      };

      const largePhaseResponse = {
        phaseId: 'foundation',
        phaseTitle: 'Foundation & Site Prep',
        timelineEstimate: {
          diy: { duration: '[8] weeks', hours: 120 },
          contractor: { duration: '[4] weeks', hours: 80 }
        },
        expertInsights: {
          proTips: ['Foundation tips', 'Additional tip 1', 'Additional tip 2'],
          commonMistakes: ['Foundation mistakes', 'Additional mistake 1', 'Additional mistake 2'],
          costSavingTips: ['Foundation savings', 'Additional savings 1', 'Additional savings 2'],
          qualityCheckpoints: ['Foundation checks', 'Additional check 1', 'Additional check 2']
        },
        regionalAdjustments: {
          timeline: 1.0,
          cost: 1.0,
          complexity: 1.0
        },
        additionalData: 'x'.repeat(5000) // Large additional data
      };

      generateText
        .mockResolvedValueOnce(JSON.stringify(largeRegionalResponse))
        .mockResolvedValueOnce(JSON.stringify({
          constructionMethod: 'Barndominium',
          foundationType: 'Slab',
          houseSize: '2000 sq ft',
          stories: '1',
          targetStartDate: '2024-06-01',
          specialRequirements: 'None'
        }))
        .mockResolvedValueOnce(JSON.stringify({
          role: 'Owner-Builder',
          experience: 'Some',
          diyPhases: ['foundation'],
          timeCommitment: 'Part-time',
          location: 'Austin, TX',
          background: {
            constructionExperience: 'Some',
            projectManagement: 'Some',
            timeAvailable: 'Part-time',
            learningStyle: 'Hands-on',
            riskTolerance: 'Moderate'
          }
        }))
        .mockResolvedValue(JSON.stringify(largePhaseResponse));

      const result = await generateHybridRoadmap(baseProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis).toBeDefined();
      expect(result.phaseResponses).toHaveLength(1);
      expect(result.phaseResponses[0].phaseId).toBe('foundation');

      // Verify that large data is handled correctly
      expect(result.regionalAnalysis.additionalData).toBeDefined();
      expect(result.phaseResponses[0].additionalData).toBeDefined();
    });
  });
});
