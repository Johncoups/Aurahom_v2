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

describe('Integration Tests - Construction Methods', () => {
  const mockProjectId = 'test-project-123';
  const baseProfile: Partial<OnboardingProfile> = {
    role: 'owner-builder',
    experience: 'some',
    diyPhaseIds: ['foundation'],
    timeCommitment: 'part-time',
    cityState: 'Austin, TX',
    propertyType: 'residential',
    lotSize: '0.5 acres',
    hasExistingStructure: false,
    targetStartDate: '2024-06-01',
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

  describe('Barndominium Construction', () => {
    test('should handle barndominium with slab foundation', async () => {
      const barndoProfile: OnboardingProfile = {
        ...baseProfile,
        constructionMethod: 'barndominium',
        foundationType: 'slab',
        houseSize: '2000',
        stories: '1'
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
            proTips: ['Barndominium slab considerations', 'Steel frame preparation'],
            commonMistakes: ['Inadequate slab thickness', 'Poor drainage'],
            costSavingTips: ['Bulk concrete ordering', 'Efficient scheduling'],
            qualityCheckpoints: ['Slab thickness check', 'Drainage inspection']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(barndoProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.projectContext.constructionMethod).toBe('Barndominium');
      expect(result.projectContext.foundationType).toBe('Slab');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Barndominium slab considerations');
      expect(phaseResponse.expertInsights?.proTips).toContain('Steel frame preparation');
    });

    test('should handle barndominium with pier foundation', async () => {
      const barndoPierProfile: OnboardingProfile = {
        ...baseProfile,
        constructionMethod: 'barndominium',
        foundationType: 'pier',
        houseSize: '2500',
        stories: '1'
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
          foundationType: 'Pier',
          houseSize: '2500 sq ft',
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
            diy: { duration: '[10] weeks', hours: 150 },
            contractor: { duration: '[5] weeks', hours: 100 }
          },
          expertInsights: {
            proTips: ['Pier spacing calculations', 'Steel frame alignment'],
            commonMistakes: ['Incorrect pier spacing', 'Poor alignment'],
            costSavingTips: ['Bulk pier materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Pier alignment check', 'Steel frame inspection']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(barndoPierProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.projectContext.constructionMethod).toBe('Barndominium');
      expect(result.projectContext.foundationType).toBe('Pier');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Pier spacing calculations');
      expect(phaseResponse.expertInsights?.proTips).toContain('Steel frame alignment');
    });
  });

  describe('Traditional Construction', () => {
    test('should handle traditional with basement foundation', async () => {
      const traditionalProfile: OnboardingProfile = {
        ...baseProfile,
        constructionMethod: 'traditional',
        foundationType: 'basement',
        houseSize: '3000',
        stories: '2'
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
          constructionMethod: 'Traditional',
          foundationType: 'Basement',
          houseSize: '3000 sq ft',
          stories: '2',
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
            diy: { duration: '[12] weeks', hours: 200 },
            contractor: { duration: '[6] weeks', hours: 120 }
          },
          expertInsights: {
            proTips: ['Basement waterproofing', 'Concrete formwork'],
            commonMistakes: ['Poor waterproofing', 'Inadequate drainage'],
            costSavingTips: ['Bulk concrete ordering', 'Efficient scheduling'],
            qualityCheckpoints: ['Waterproofing inspection', 'Drainage test']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(traditionalProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.projectContext.constructionMethod).toBe('Traditional');
      expect(result.projectContext.foundationType).toBe('Basement');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Basement waterproofing');
      expect(phaseResponse.expertInsights?.proTips).toContain('Concrete formwork');
    });

    test('should handle traditional with crawl space foundation', async () => {
      const traditionalCrawlProfile: OnboardingProfile = {
        ...baseProfile,
        constructionMethod: 'traditional',
        foundationType: 'crawl-space',
        houseSize: '2500',
        stories: '1'
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
          constructionMethod: 'Traditional',
          foundationType: 'Crawl Space',
          houseSize: '2500 sq ft',
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
            diy: { duration: '[10] weeks', hours: 160 },
            contractor: { duration: '[5] weeks', hours: 100 }
          },
          expertInsights: {
            proTips: ['Crawl space ventilation', 'Moisture management'],
            commonMistakes: ['Poor ventilation', 'Moisture issues'],
            costSavingTips: ['Bulk materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Ventilation check', 'Moisture inspection']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(traditionalCrawlProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.projectContext.constructionMethod).toBe('Traditional');
      expect(result.projectContext.foundationType).toBe('Crawl Space');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Crawl space ventilation');
      expect(phaseResponse.expertInsights?.proTips).toContain('Moisture management');
    });
  });

  describe('Modular Construction', () => {
    test('should handle modular construction', async () => {
      const modularProfile: OnboardingProfile = {
        ...baseProfile,
        constructionMethod: 'modular',
        foundationType: 'slab',
        houseSize: '2200',
        stories: '1'
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
          constructionMethod: 'Modular',
          foundationType: 'Slab',
          houseSize: '2200 sq ft',
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
            diy: { duration: '[6] weeks', hours: 100 },
            contractor: { duration: '[3] weeks', hours: 60 }
          },
          expertInsights: {
            proTips: ['Modular connection points', 'Crane access planning'],
            commonMistakes: ['Poor connection points', 'Inadequate access'],
            costSavingTips: ['Bulk materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Connection point inspection', 'Access verification']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(modularProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.projectContext.constructionMethod).toBe('Modular');
      expect(result.projectContext.foundationType).toBe('Slab');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Modular connection points');
      expect(phaseResponse.expertInsights?.proTips).toContain('Crane access planning');
    });
  });

  describe('Size and Story Variations', () => {
    test('should handle large house (4000+ sq ft)', async () => {
      const largeHouseProfile: OnboardingProfile = {
        ...baseProfile,
        constructionMethod: 'traditional',
        foundationType: 'basement',
        houseSize: '4000',
        stories: '2'
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
          constructionMethod: 'Traditional',
          foundationType: 'Basement',
          houseSize: '4000 sq ft',
          stories: '2',
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
            diy: { duration: '[16] weeks', hours: 300 },
            contractor: { duration: '[8] weeks', hours: 200 }
          },
          expertInsights: {
            proTips: ['Large foundation planning', 'Crew management'],
            commonMistakes: ['Poor planning', 'Inadequate crew'],
            costSavingTips: ['Bulk materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Foundation inspection', 'Quality control']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(largeHouseProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.projectContext.houseSize).toBe('4000 sq ft');
      expect(result.projectContext.stories).toBe('2');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.timelineEstimate?.diy?.duration).toBe('[16] weeks');
      expect(phaseResponse.timelineEstimate?.diy?.hours).toBe(300);
      expect(phaseResponse.expertInsights?.proTips).toContain('Large foundation planning');
    });

    test('should handle small house (<1500 sq ft)', async () => {
      const smallHouseProfile: OnboardingProfile = {
        ...baseProfile,
        constructionMethod: 'barndominium',
        foundationType: 'slab',
        houseSize: '1200',
        stories: '1'
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
          houseSize: '1200 sq ft',
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
            diy: { duration: '[6] weeks', hours: 80 },
            contractor: { duration: '[3] weeks', hours: 50 }
          },
          expertInsights: {
            proTips: ['Small foundation efficiency', 'Compact planning'],
            commonMistakes: ['Over-engineering', 'Poor space utilization'],
            costSavingTips: ['Bulk materials', 'Efficient scheduling'],
            qualityCheckpoints: ['Foundation inspection', 'Space verification']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(smallHouseProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.projectContext.houseSize).toBe('1200 sq ft');
      expect(result.projectContext.stories).toBe('1');
      
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.timelineEstimate?.diy?.duration).toBe('[6] weeks');
      expect(phaseResponse.timelineEstimate?.diy?.hours).toBe(80);
      expect(phaseResponse.expertInsights?.proTips).toContain('Small foundation efficiency');
    });
  });
});
