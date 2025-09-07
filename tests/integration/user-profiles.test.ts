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

describe('Integration Tests - User Profiles', () => {
  const mockProjectId = 'test-project-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Different User Experience Levels', () => {
    test('should handle complete beginner profile', async () => {
      const beginnerProfile: OnboardingProfile = {
        role: 'owner-builder',
        experience: 'none',
        diyPhaseIds: [],
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
        specialRequirements: 'energy-efficient',
        background: {
          constructionExperience: 'none',
          projectManagement: 'none',
          timeAvailable: 'weekends-only',
          learningStyle: 'hands-on',
          riskTolerance: 'conservative'
        }
      };

      // Mock OpenAI responses for beginner
      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Texas - Central',
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
          specialRequirements: 'Energy-efficient'
        }))
        .mockResolvedValueOnce(JSON.stringify({
          role: 'Owner-Builder',
          experience: 'None',
          diyPhases: [],
          timeCommitment: 'Part-time',
          location: 'Austin, TX',
          background: {
            constructionExperience: 'None',
            projectManagement: 'None',
            timeAvailable: 'Weekends only',
            learningStyle: 'Hands-on',
            riskTolerance: 'Conservative'
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
            proTips: ['Start with soil testing', 'Consider weather delays'],
            commonMistakes: ['Skipping permits', 'Inadequate drainage'],
            costSavingTips: ['DIY site prep', 'Bulk material ordering'],
            qualityCheckpoints: ['Soil compaction test', 'Foundation inspection']
          },
          regionalAdjustments: {
            timeline: 1.0,
            cost: 1.0,
            complexity: 1.0
          }
        }));

      const result = await generateHybridRoadmap(beginnerProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis).toBeDefined();
      expect(result.projectContext).toBeDefined();
      expect(result.userProfile).toBeDefined();
      expect(result.phaseResponses).toHaveLength(1); // Assuming 1 phase for this test
      
      // Verify beginner-specific guidance
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Start with soil testing');
      expect(phaseResponse.expertInsights?.commonMistakes).toContain('Skipping permits');
    });

    test('should handle experienced contractor profile', async () => {
      const contractorProfile: OnboardingProfile = {
        role: 'contractor',
        experience: 'extensive',
        diyPhaseIds: ['foundation', 'framing', 'electrical', 'plumbing'],
        timeCommitment: 'full-time',
        cityState: 'Seattle, WA',
        propertyType: 'residential',
        lotSize: '0.25 acres',
        hasExistingStructure: false,
        targetStartDate: '2024-03-01',
        constructionMethod: 'traditional',
        foundationType: 'basement',
        houseSize: '3000',
        stories: '2',
        budget: '500000',
        financing: 'cash',
        timeline: 'aggressive',
        specialRequirements: 'high-end finishes',
        background: {
          constructionExperience: 'extensive',
          projectManagement: 'extensive',
          timeAvailable: 'full-time',
          learningStyle: 'technical',
          riskTolerance: 'aggressive'
        }
      };

      // Mock OpenAI responses for contractor
      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Washington - Pacific Northwest',
          climateZone: 'Marine',
          seasonalFactors: ['Winter delays', 'Rain management'],
          regulatoryEnvironment: 'High regulation',
          marketConditions: 'Competitive market',
          buildingCodeComplexity: 'Complex',
          regionalMultipliers: {
            timeline: 1.2,
            cost: 1.3,
            complexity: 1.4
          }
        }))
        .mockResolvedValueOnce(JSON.stringify({
          constructionMethod: 'Traditional',
          foundationType: 'Basement',
          houseSize: '3000 sq ft',
          stories: '2',
          targetStartDate: '2024-03-01',
          specialRequirements: 'High-end finishes'
        }))
        .mockResolvedValueOnce(JSON.stringify({
          role: 'Contractor',
          experience: 'Extensive',
          diyPhases: ['foundation', 'framing', 'electrical', 'plumbing'],
          timeCommitment: 'Full-time',
          location: 'Seattle, WA',
          background: {
            constructionExperience: 'Extensive',
            projectManagement: 'Extensive',
            timeAvailable: 'Full-time',
            learningStyle: 'Technical',
            riskTolerance: 'Aggressive'
          }
        }))
        .mockResolvedValue(JSON.stringify({
          phaseId: 'foundation',
          phaseTitle: 'Foundation & Site Prep',
          timelineEstimate: {
            diy: { duration: '[6] weeks', hours: 200 },
            contractor: { duration: '[3] weeks', hours: 120 }
          },
          expertInsights: {
            proTips: ['Advanced foundation techniques', 'Efficient project sequencing'],
            commonMistakes: ['Over-engineering', 'Skipping quality checks'],
            costSavingTips: ['Bulk purchasing', 'Efficient crew management'],
            qualityCheckpoints: ['Structural inspection', 'Code compliance']
          },
          regionalAdjustments: {
            timeline: 1.2,
            cost: 1.3,
            complexity: 1.4
          }
        }));

      const result = await generateHybridRoadmap(contractorProfile, mockProjectId);

      expect(result).toBeDefined();
      expect(result.regionalAnalysis).toBeDefined();
      expect(result.projectContext).toBeDefined();
      expect(result.userProfile).toBeDefined();
      
      // Verify contractor-specific guidance
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Advanced foundation techniques');
      expect(phaseResponse.timelineEstimate?.diy?.hours).toBeGreaterThan(120); // More hours for experienced user
    });
  });

  describe('Different Time Commitments', () => {
    test('should handle weekend-only commitment', async () => {
      const weekendProfile: OnboardingProfile = {
        role: 'owner-builder',
        experience: 'some',
        diyPhaseIds: ['framing'],
        timeCommitment: 'weekends-only',
        cityState: 'Denver, CO',
        propertyType: 'residential',
        lotSize: '0.75 acres',
        hasExistingStructure: false,
        targetStartDate: '2024-08-01',
        constructionMethod: 'barndominium',
        foundationType: 'slab',
        houseSize: '1800',
        stories: '1',
        budget: '250000',
        financing: 'construction-loan',
        timeline: 'flexible',
        specialRequirements: 'sustainable',
        background: {
          constructionExperience: 'some',
          projectManagement: 'some',
          timeAvailable: 'weekends-only',
          learningStyle: 'visual',
          riskTolerance: 'moderate'
        }
      };

      const { generateText } = require('@/lib/openai');
      generateText
        .mockResolvedValueOnce(JSON.stringify({
          primaryClassification: 'Colorado - Mountain',
          climateZone: 'Cold',
          seasonalFactors: ['Winter delays', 'Altitude considerations'],
          regulatoryEnvironment: 'Moderate regulation',
          marketConditions: 'Active market',
          buildingCodeComplexity: 'Standard',
          regionalMultipliers: {
            timeline: 1.1,
            cost: 1.1,
            complexity: 1.1
          }
        }))
        .mockResolvedValueOnce(JSON.stringify({
          constructionMethod: 'Barndominium',
          foundationType: 'Slab',
          houseSize: '1800 sq ft',
          stories: '1',
          targetStartDate: '2024-08-01',
          specialRequirements: 'Sustainable'
        }))
        .mockResolvedValueOnce(JSON.stringify({
          role: 'Owner-Builder',
          experience: 'Some',
          diyPhases: ['framing'],
          timeCommitment: 'Weekends only',
          location: 'Denver, CO',
          background: {
            constructionExperience: 'Some',
            projectManagement: 'Some',
            timeAvailable: 'Weekends only',
            learningStyle: 'Visual',
            riskTolerance: 'Moderate'
          }
        }))
        .mockResolvedValue(JSON.stringify({
          phaseId: 'framing',
          phaseTitle: 'Framing',
          timelineEstimate: {
            diy: { duration: '[12] weeks', hours: 160 },
            contractor: { duration: '[4] weeks', hours: 100 }
          },
          expertInsights: {
            proTips: ['Weekend project planning', 'Weather protection'],
            commonMistakes: ['Rushing weekend work', 'Inadequate planning'],
            costSavingTips: ['Material staging', 'Tool organization'],
            qualityCheckpoints: ['Weekly progress review', 'Safety checks']
          },
          regionalAdjustments: {
            timeline: 1.1,
            cost: 1.1,
            complexity: 1.1
          }
        }));

      const result = await generateHybridRoadmap(weekendProfile, mockProjectId);

      expect(result).toBeDefined();
      const phaseResponse = result.phaseResponses[0];
      expect(phaseResponse.expertInsights?.proTips).toContain('Weekend project planning');
      expect(phaseResponse.timelineEstimate?.diy?.duration).toBe('[12] weeks'); // Longer for weekend work
    });
  });

  describe('Error Handling', () => {
    test('should handle OpenAI API errors gracefully', async () => {
      const profile: OnboardingProfile = {
        role: 'owner-builder',
        experience: 'some',
        diyPhaseIds: ['foundation'],
        timeCommitment: 'part-time',
        cityState: 'Test City, TS',
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

      const { generateText } = require('@/lib/openai');
      generateText.mockRejectedValue(new Error('OpenAI API Error'));

      await expect(generateHybridRoadmap(profile, mockProjectId)).rejects.toThrow('OpenAI API Error');
    });

    test('should handle invalid profile data', async () => {
      const invalidProfile = {
        role: 'invalid-role',
        experience: 'invalid-experience'
      } as any;

      await expect(generateHybridRoadmap(invalidProfile, mockProjectId)).rejects.toThrow();
    });
  });
});
