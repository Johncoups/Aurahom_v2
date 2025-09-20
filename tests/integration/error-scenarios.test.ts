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

describe('Integration Tests - Error Scenarios', () => {
  const mockProjectId = 'test-project-123';
  const baseProfile: OnboardingProfile = {
    role: 'owner-builder',
    experience: 'some',
    diyPhaseIds: ['foundation'],
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

  describe('OpenAI API Errors', () => {
    test('should handle OpenAI API timeout', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockRejectedValue(new Error('Request timeout'));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Request timeout');
    });

    test('should handle OpenAI API rate limit', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockRejectedValue(new Error('Rate limit exceeded'));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Rate limit exceeded');
    });

    test('should handle OpenAI API authentication error', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockRejectedValue(new Error('Invalid API key'));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Invalid API key');
    });

    test('should handle OpenAI API quota exceeded', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockRejectedValue(new Error('Quota exceeded'));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Quota exceeded');
    });

    test('should handle partial OpenAI API failures', async () => {
      const { generateText } = require('@/lib/openai');
      
      // Mock successful regional analysis
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
        .mockRejectedValue(new Error('Phase processing failed'));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Phase processing failed');
    });
  });

  describe('Invalid Response Format', () => {
    test('should handle invalid JSON response', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockResolvedValueOnce('Invalid JSON response');

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow();
    });

    test('should handle malformed JSON response', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockResolvedValueOnce('{"incomplete": "json"');

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow();
    });

    test('should handle empty response', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockResolvedValueOnce('');

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow();
    });

    test('should handle null response', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockResolvedValueOnce(null);

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow();
    });

    test('should handle response with missing required fields', async () => {
      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          // Missing required fields
          primaryClassification: 'Texas - Moderate Regulation'
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
        }));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow();
    });
  });

  describe('Invalid Input Data', () => {
    test('should handle invalid profile data', async () => {
      const invalidProfile = {
        role: 'invalid-role',
        experience: 'invalid-experience',
        cityState: 'Invalid City, Invalid State'
      } as any;

      await expect(generateHybridRoadmap(invalidProfile, mockProjectId)).rejects.toThrow();
    });

    test('should handle missing required profile fields', async () => {
      const incompleteProfile = {
        role: 'owner-builder'
        // Missing other required fields
      } as any;

      await expect(generateHybridRoadmap(incompleteProfile, mockProjectId)).rejects.toThrow();
    });

    test('should handle invalid project ID', async () => {
      await expect(generateHybridRoadmap(baseProfile, '')).rejects.toThrow();
    });

    test('should handle null project ID', async () => {
      await expect(generateHybridRoadmap(baseProfile, null as any)).rejects.toThrow();
    });

    test('should handle undefined project ID', async () => {
      await expect(generateHybridRoadmap(baseProfile, undefined as any)).rejects.toThrow();
    });
  });

  describe('Database Errors', () => {
    test('should handle Supabase connection error', async () => {
      const { supabase } = require('@/lib/supabase');
      supabase.from.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Database connection failed');
    });

    test('should handle Supabase insert error', async () => {
      const { supabase } = require('@/lib/supabase');
      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        })),
        insert: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Insert failed' } }))
      });

      const { generateText } = require('@/lib/openai');
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
        }));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Insert failed');
    });
  });

  describe('Network Errors', () => {
    test('should handle network timeout', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockRejectedValue(new Error('Network timeout'));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Network timeout');
    });

    test('should handle network connection error', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockRejectedValue(new Error('Network connection failed'));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('Network connection failed');
    });

    test('should handle DNS resolution error', async () => {
      const { generateText } = require('@/lib/openai');
      generateText.mockRejectedValue(new Error('DNS resolution failed'));

      await expect(generateHybridRoadmap(baseProfile, mockProjectId)).rejects.toThrow('DNS resolution failed');
    });
  });

  describe('Concurrent Request Handling', () => {
    test('should handle multiple concurrent requests', async () => {
      const { generateText } = require('@/lib/openai');
      
      // Mock responses for multiple requests
      const mockResponses = [
        // Request 1 responses
        JSON.stringify({
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
        }),
        JSON.stringify({
          constructionMethod: 'Barndominium',
          foundationType: 'Slab',
          houseSize: '2000 sq ft',
          stories: '1',
          targetStartDate: '2024-06-01',
          specialRequirements: 'None'
        }),
        JSON.stringify({
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
        }),
        JSON.stringify({
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
        }),
        // Request 2 responses (same structure)
        JSON.stringify({
          primaryClassification: 'California - High Regulation',
          climateZone: 'Mediterranean',
          seasonalFactors: ['Fire season delays', 'Earthquake considerations'],
          regulatoryEnvironment: 'Very high regulation',
          marketConditions: 'Very competitive',
          buildingCodeComplexity: 'Very complex',
          regionalMultipliers: {
            timeline: 1.5,
            cost: 1.8,
            complexity: 2.0
          }
        }),
        JSON.stringify({
          constructionMethod: 'Traditional',
          foundationType: 'Basement',
          houseSize: '3000 sq ft',
          stories: '2',
          targetStartDate: '2024-06-01',
          specialRequirements: 'None'
        }),
        JSON.stringify({
          role: 'Contractor',
          experience: 'Extensive',
          diyPhases: ['foundation', 'framing'],
          timeCommitment: 'Full-time',
          location: 'San Francisco, CA',
          background: {
            constructionExperience: 'Extensive',
            projectManagement: 'Extensive',
            timeAvailable: 'Full-time',
            learningStyle: 'Technical',
            riskTolerance: 'Aggressive'
          }
        }),
        JSON.stringify({
          phaseId: 'foundation',
          phaseTitle: 'Foundation & Site Prep',
          timelineEstimate: {
            diy: { duration: '[12] weeks', hours: 180 },
            contractor: { duration: '[6] weeks', hours: 120 }
          },
          expertInsights: {
            proTips: ['California foundation tips'],
            commonMistakes: ['California foundation mistakes'],
            costSavingTips: ['California foundation savings'],
            qualityCheckpoints: ['California foundation checks']
          },
          regionalAdjustments: {
            timeline: 1.5,
            cost: 1.8,
            complexity: 2.0
          }
        })
      ];

      generateText.mockImplementation(() => Promise.resolve(mockResponses.shift()));

      // Start multiple concurrent requests
      const request1 = generateHybridRoadmap(baseProfile, mockProjectId);
      const request2 = generateHybridRoadmap({
        ...baseProfile,
        cityState: 'San Francisco, CA',
        constructionMethod: 'traditional',
        foundationType: 'basement',
        houseSize: '3000',
        stories: '2',
        role: 'contractor',
        experience: 'extensive',
        diyPhaseIds: ['foundation', 'framing'],
        timeCommitment: 'full-time'
      }, 'test-project-456');

      const [result1, result2] = await Promise.all([request1, request2]);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1.regionalAnalysis.primaryClassification).toBe('Texas - Moderate Regulation');
      expect(result2.regionalAnalysis.primaryClassification).toBe('California - High Regulation');
    });
  });

  describe('Resource Exhaustion', () => {
    test('should handle memory exhaustion gracefully', async () => {
      const { generateText } = require('@/lib/openai');
      
      // Mock very large responses that could cause memory issues
      const largeResponse = {
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
        },
        largeData: 'x'.repeat(1000000) // 1MB of data
      };

      generateText
        .mockResolvedValueOnce(JSON.stringify(largeResponse))
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
        }));

      const result = await generateHybridRoadmap(baseProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis).toBeDefined();
      expect(result.regionalAnalysis.largeData).toBeDefined();
    });
  });
});
