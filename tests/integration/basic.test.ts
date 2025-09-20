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

describe('Basic Integration Tests', () => {
  const mockProjectId = 'test-project-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Handling', () => {
    test('should handle OpenAI API errors gracefully', async () => {
      const profile: OnboardingProfile = {
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

    test('should handle missing required profile fields', async () => {
      const incompleteProfile = {
        role: 'owner-builder'
        // Missing other required fields
      } as any;

      await expect(generateHybridRoadmap(incompleteProfile, mockProjectId)).rejects.toThrow();
    });
  });

  describe('Input Validation', () => {
    test('should handle invalid project ID', async () => {
      const profile: OnboardingProfile = {
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

      await expect(generateHybridRoadmap(profile, '')).rejects.toThrow();
    });

    test('should handle null project ID', async () => {
      const profile: OnboardingProfile = {
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

      await expect(generateHybridRoadmap(profile, null as any)).rejects.toThrow();
    });
  });

  describe('Function Exports', () => {
    test('should export generateHybridRoadmap function', () => {
      expect(typeof generateHybridRoadmap).toBe('function');
    });
  });
});
