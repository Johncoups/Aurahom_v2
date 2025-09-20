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

describe('Integration Tests - Different Locations', () => {
  const mockProjectId = 'test-project-123';
  const baseProfile: Partial<OnboardingProfile> = {
    role: 'owner-builder',
    experience: 'some',
    diyPhaseIds: ['foundation'],
    timeCommitment: 'part-time',
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

  describe('High Regulation States', () => {
    test('should handle California (high regulation)', async () => {
      const californiaProfile: OnboardingProfile = {
        ...baseProfile,
        cityState: 'San Francisco, CA'
      } as OnboardingProfile;

      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
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
          location: 'San Francisco, CA',
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
            diy: { duration: '[12] weeks', hours: 180 },
            contractor: { duration: '[6] weeks', hours: 120 }
          },
          expertInsights: {
            proTips: ['Early permit application', 'Seismic considerations'],
            commonMistakes: ['Skipping inspections', 'Code violations'],
            costSavingTips: ['Bulk permit applications', 'Efficient scheduling'],
            qualityCheckpoints: ['Seismic inspection', 'Code compliance review']
          },
          regionalAdjustments: {
            timeline: 1.5,
            cost: 1.8,
            complexity: 2.0
          }
        }));

      const result = await generateHybridRoadmap(californiaProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis.regulatoryEnvironment).toBe('Very high regulation');
      expect(result.regionalAnalysis.regionalMultipliers.timeline).toBe(1.5);
      expect(result.regionalAnalysis.regionalMultipliers.cost).toBe(1.8);
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Early permit application');
      expect(phaseResponse.expertInsights?.proTips).toContain('Seismic considerations');
    });

    test('should handle New York (high regulation)', async () => {
      const nyProfile: OnboardingProfile = {
        ...baseProfile,
        cityState: 'New York, NY'
      } as OnboardingProfile;

      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'New York - High Regulation',
          climateZone: 'Humid Continental',
          seasonalFactors: ['Winter delays', 'Hurricane season'],
          regulatoryEnvironment: 'Very high regulation',
          marketConditions: 'Very competitive',
          buildingCodeComplexity: 'Very complex',
          regionalMultipliers: {
            timeline: 1.4,
            cost: 1.7,
            complexity: 1.9
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
          location: 'New York, NY',
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
            diy: { duration: '[11] weeks', hours: 170 },
            contractor: { duration: '[5] weeks', hours: 110 }
          },
          expertInsights: {
            proTips: ['Zoning compliance', 'Environmental reviews'],
            commonMistakes: ['Zoning violations', 'Environmental issues'],
            costSavingTips: ['Bulk applications', 'Efficient scheduling'],
            qualityCheckpoints: ['Zoning inspection', 'Environmental compliance']
          },
          regionalAdjustments: {
            timeline: 1.4,
            cost: 1.7,
            complexity: 1.9
          }
        }));

      const result = await generateHybridRoadmap(nyProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis.regulatoryEnvironment).toBe('Very high regulation');
      expect(result.regionalAnalysis.regionalMultipliers.timeline).toBe(1.4);
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Zoning compliance');
      expect(phaseResponse.expertInsights?.proTips).toContain('Environmental reviews');
    });
  });

  describe('Moderate Regulation States', () => {
    test('should handle Texas (moderate regulation)', async () => {
      const texasProfile: OnboardingProfile = {
        ...baseProfile,
        cityState: 'Austin, TX'
      } as OnboardingProfile;

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
            proTips: ['Heat management', 'Storm preparation'],
            commonMistakes: ['Heat exhaustion', 'Storm damage'],
            costSavingTips: ['Bulk materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Foundation inspection', 'Weather protection']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(texasProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis.regulatoryEnvironment).toBe('Moderate regulation');
      expect(result.regionalAnalysis.regionalMultipliers.timeline).toBe(1.0);
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Heat management');
      expect(phaseResponse.expertInsights?.proTips).toContain('Storm preparation');
    });
  });

  describe('Low Regulation States', () => {
    test('should handle Wyoming (low regulation)', async () => {
      const wyomingProfile: OnboardingProfile = {
        ...baseProfile,
        cityState: 'Cheyenne, WY'
      } as OnboardingProfile;

      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Wyoming - Low Regulation',
          climateZone: 'Cold',
          seasonalFactors: ['Winter delays', 'High altitude'],
          regulatoryEnvironment: 'Low regulation',
          marketConditions: 'Moderate market',
          buildingCodeComplexity: 'Simple',
          regionalMultipliers: {
            timeline: 0.8,
            cost: 0.7,
            complexity: 0.6
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
          location: 'Cheyenne, WY',
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
            diy: { duration: '[6] weeks', hours: 90 },
            contractor: { duration: '[3] weeks', hours: 60 }
          },
          expertInsights: {
            proTips: ['Altitude considerations', 'Winter preparation'],
            commonMistakes: ['Altitude sickness', 'Winter delays'],
            costSavingTips: ['Local materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Foundation inspection', 'Weather protection']
          },
          regionalAdjustments: {
            timeline: 0.8,
            cost: 0.7,
            complexity: 0.6
          }
        }));

      const result = await generateHybridRoadmap(wyomingProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis.regulatoryEnvironment).toBe('Low regulation');
      expect(result.regionalAnalysis.regionalMultipliers.timeline).toBe(0.8);
      expect(result.regionalAnalysis.regionalMultipliers.cost).toBe(0.7);
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Altitude considerations');
      expect(phaseResponse.expertInsights?.proTips).toContain('Winter preparation');
    });
  });

  describe('Climate Zone Variations', () => {
    test('should handle hot-humid climate (Florida)', async () => {
      const floridaProfile: OnboardingProfile = {
        ...baseProfile,
        cityState: 'Miami, FL'
      } as OnboardingProfile;

      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Florida - Hot-Humid',
          climateZone: 'Hot-Humid',
          seasonalFactors: ['Hurricane season', 'High humidity'],
          regulatoryEnvironment: 'Moderate regulation',
          marketConditions: 'Active market',
          buildingCodeComplexity: 'Standard',
          regionalMultipliers: {
            timeline: 1.1,
            cost: 1.1,
            complexity: 1.2
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
          location: 'Miami, FL',
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
            diy: { duration: '[9] weeks', hours: 130 },
            contractor: { duration: '[4] weeks', hours: 85 }
          },
          expertInsights: {
            proTips: ['Hurricane preparation', 'Moisture management'],
            commonMistakes: ['Hurricane damage', 'Mold issues'],
            costSavingTips: ['Hurricane-resistant materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Hurricane inspection', 'Moisture testing']
          },
          regionalAdjustments: {
            timeline: 1.1,
            cost: 1.1,
            complexity: 1.2
          }
        }));

      const result = await generateHybridRoadmap(floridaProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis.climateZone).toBe('Hot-Humid');
      expect(result.regionalAnalysis.seasonalFactors).toContain('Hurricane season');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Hurricane preparation');
      expect(phaseResponse.expertInsights?.proTips).toContain('Moisture management');
    });

    test('should handle cold climate (Alaska)', async () => {
      const alaskaProfile: OnboardingProfile = {
        ...baseProfile,
        cityState: 'Anchorage, AK'
      } as OnboardingProfile;

      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Alaska - Cold',
          climateZone: 'Cold',
          seasonalFactors: ['Long winters', 'Permafrost considerations'],
          regulatoryEnvironment: 'Moderate regulation',
          marketConditions: 'Limited market',
          buildingCodeComplexity: 'Complex',
          regionalMultipliers: {
            timeline: 1.3,
            cost: 1.4,
            complexity: 1.5
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
          location: 'Anchorage, AK',
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
            diy: { duration: '[10] weeks', hours: 150 },
            contractor: { duration: '[5] weeks', hours: 100 }
          },
          expertInsights: {
            proTips: ['Permafrost considerations', 'Winter construction'],
            commonMistakes: ['Permafrost damage', 'Winter delays'],
            costSavingTips: ['Local materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Permafrost inspection', 'Winter protection']
          },
          regionalAdjustments: {
            timeline: 1.3,
            cost: 1.4,
            complexity: 1.5
          }
        }));

      const result = await generateHybridRoadmap(alaskaProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis.climateZone).toBe('Cold');
      expect(result.regionalAnalysis.seasonalFactors).toContain('Long winters');
      expect(result.regionalAnalysis.seasonalFactors).toContain('Permafrost considerations');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Permafrost considerations');
      expect(phaseResponse.expertInsights?.proTips).toContain('Winter construction');
    });
  });
});
