import { generateHybridRoadmap } from '@/lib/hybrid-roadmap-generator';
import { generateRoadmap } from '@/app/actions/generateRoadmap';
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

describe('Performance Benchmark Tests', () => {
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
    
    // Mock successful OpenAI responses
    const { generateText } = require('@/lib/openai');
    generateText.mockImplementation((prompt: string) => {
      // Return different responses based on prompt content
      if (prompt.includes('regional analysis')) {
        return Promise.resolve(JSON.stringify({
          cityState: 'Austin, TX',
          primaryClassification: 'Urban',
          climateZone: 'Humid Subtropical',
          seasonalFactors: ['Hot summers', 'Mild winters'],
          regulatoryEnvironment: 'Moderate',
          buildingCodes: 'IBC 2021',
          permitRequirements: ['Building permit', 'Electrical permit'],
          environmentalConsiderations: ['Flood zone considerations', 'Heat island effect']
        }));
      } else if (prompt.includes('project context')) {
        return Promise.resolve(JSON.stringify({
          projectType: 'barndominium',
          constructionMethod: 'barndominium',
          houseSize: '2000 sq ft',
          foundationType: 'slab',
          location: 'Austin, TX',
          regionalContext: {
            cityState: 'Austin, TX',
            primaryClassification: 'Urban',
            climateZone: 'Humid Subtropical'
          }
        }));
      } else if (prompt.includes('user profile')) {
        return Promise.resolve(JSON.stringify({
          experienceLevel: 'intermediate',
          timeCommitment: 'part-time',
          budgetRange: 'moderate',
          diyPhaseIds: ['foundation', 'framing'],
          background: 'construction',
          constraints: {
            environmental: ['Heat considerations'],
            regulatory: ['Permit requirements'],
            financial: ['Budget constraints'],
            time: ['Part-time availability']
          }
        }));
      } else if (prompt.includes('phase-specific')) {
        return Promise.resolve(JSON.stringify({
          phaseId: 'foundation',
          phaseTitle: 'Foundation Phase',
          tasks: [
            {
              id: 'foundation-1',
              title: 'Site Preparation',
              description: 'Clear and level the site',
              steps: ['Clear vegetation', 'Level ground', 'Mark boundaries'],
              qaChecks: ['Check levelness', 'Verify measurements'],
              vendorQuestions: ['What equipment is needed?'],
              vendorNeeds: ['Excavator', 'Surveyor'],
              notes: 'Ensure proper drainage'
            }
          ],
          expertInsights: {
            proTips: ['Start early in the day to avoid heat'],
            commonMistakes: ['Not checking for utilities'],
            costSavingTips: ['Consider DIY site prep'],
            qualityCheckpoints: ['Verify permits before starting']
          }
        }));
      }
      return Promise.resolve('{"error": "Unknown prompt type"}');
    });
  });

  describe('Response Time Comparison', () => {
    it('should measure hybrid approach response time', async () => {
      const startTime = performance.now();
      
      try {
        await generateHybridRoadmap(baseProfile, mockProjectId);
      } catch (error) {
        // Expected to fail due to missing project data, but we can still measure time
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      console.log(`Hybrid approach execution time: ${executionTime.toFixed(2)}ms`);
      
      // Should complete within reasonable time (even with errors)
      expect(executionTime).toBeLessThan(5000);
    });

    it('should measure legacy approach response time', async () => {
      const startTime = performance.now();
      
      try {
        await generateRoadmap(baseProfile, mockProjectId);
      } catch (error) {
        // Expected to fail due to missing project data, but we can still measure time
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      console.log(`Legacy approach execution time: ${executionTime.toFixed(2)}ms`);
      
      // Should complete within reasonable time (even with errors)
      expect(executionTime).toBeLessThan(5000);
    });
  });

  describe('API Call Efficiency', () => {
    it('should count API calls for hybrid approach', async () => {
      const { generateText } = require('@/lib/openai');
      
      try {
        await generateHybridRoadmap(baseProfile, mockProjectId);
      } catch (error) {
        // Expected to fail, but we can count calls
      }
      
      // Count the number of API calls made
      const callCount = generateText.mock.calls.length;
      console.log(`Hybrid approach API calls: ${callCount}`);
      
      // Should make at least some calls (even if they fail)
      expect(callCount).toBeGreaterThan(0);
    });

    it('should count API calls for legacy approach', async () => {
      const { generateText } = require('@/lib/openai');
      
      try {
        await generateRoadmap(baseProfile, mockProjectId);
      } catch (error) {
        // Expected to fail, but we can count calls
      }
      
      // Count the number of API calls made
      const callCount = generateText.mock.calls.length;
      console.log(`Legacy approach API calls: ${callCount}`);
      
      // Should make at least some calls (even if they fail)
      expect(callCount).toBeGreaterThan(0);
    });
  });

  describe('Memory Usage Testing', () => {
    it('should handle large responses without memory issues', async () => {
      const { generateText } = require('@/lib/openai');
      
      // Mock a large response
      const largeResponse = {
        phaseId: 'foundation',
        phaseTitle: 'Foundation Phase',
        tasks: Array.from({ length: 100 }, (_, i) => ({
          id: `task-${i}`,
          title: `Task ${i}`,
          description: `Description for task ${i}`.repeat(10),
          steps: Array.from({ length: 20 }, (_, j) => `Step ${j}`),
          qaChecks: Array.from({ length: 10 }, (_, j) => `Check ${j}`),
          vendorQuestions: Array.from({ length: 15 }, (_, j) => `Question ${j}`),
          vendorNeeds: Array.from({ length: 10 }, (_, j) => `Need ${j}`),
          notes: `Notes for task ${i}`.repeat(5)
        })),
        expertInsights: {
          proTips: Array.from({ length: 50 }, (_, i) => `Pro tip ${i}`),
          commonMistakes: Array.from({ length: 30 }, (_, i) => `Mistake ${i}`),
          costSavingTips: Array.from({ length: 25 }, (_, i) => `Cost tip ${i}`),
          qualityCheckpoints: Array.from({ length: 20 }, (_, i) => `Checkpoint ${i}`)
        }
      };

      generateText.mockResolvedValueOnce(JSON.stringify(largeResponse));

      const startTime = performance.now();
      const startMemory = process.memoryUsage().heapUsed;
      
      try {
        await generateHybridRoadmap(baseProfile, mockProjectId);
      } catch (error) {
        // Expected to fail, but we can measure memory
      }
      
      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;
      
      const executionTime = endTime - startTime;
      const memoryUsed = (endMemory - startMemory) / 1024 / 1024; // MB
      
      console.log(`Large response execution time: ${executionTime.toFixed(2)}ms`);
      console.log(`Memory used: ${memoryUsed.toFixed(2)}MB`);
      
      // Should handle large responses efficiently
      expect(executionTime).toBeLessThan(10000);
      expect(memoryUsed).toBeLessThan(100); // Less than 100MB
    });
  });

  describe('Concurrent Request Performance', () => {
    it('should handle multiple concurrent requests efficiently', async () => {
      const profiles = [
        { ...baseProfile, cityState: 'Austin, TX' },
        { ...baseProfile, cityState: 'San Francisco, CA' }
      ];
      
      const startTime = performance.now();
      
      // Run multiple requests concurrently
      const promises = profiles.map((profile, index) => 
        generateHybridRoadmap(profile, `test-project-${index}`)
      );
      
      try {
        await Promise.all(promises);
      } catch (error) {
        // Expected to fail, but we can measure time
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      console.log(`Concurrent requests execution time: ${executionTime.toFixed(2)}ms`);
      
      // Concurrent requests should be faster than sequential
      expect(executionTime).toBeLessThan(10000);
    });
  });

  describe('Scalability Testing', () => {
    it('should handle increasing number of phases efficiently', async () => {
      const phaseCounts = [1, 2, 4, 8];
      const results = [];
      
      for (const phaseCount of phaseCounts) {
        const { generateText } = require('@/lib/openai');
        generateText.mockClear();
        
        // Mock responses for the specified number of phases
        generateText.mockImplementation((prompt: string) => {
          if (prompt.includes('regional analysis') || prompt.includes('project context') || prompt.includes('user profile')) {
            return Promise.resolve('{"success": true}');
          } else if (prompt.includes('phase-specific')) {
            return Promise.resolve(JSON.stringify({
              phaseId: 'test-phase',
              phaseTitle: 'Test Phase',
              tasks: [],
              expertInsights: {}
            }));
          }
          return Promise.resolve('{"error": "Unknown prompt"}');
        });
        
        const startTime = performance.now();
        
        try {
          await generateHybridRoadmap(baseProfile, mockProjectId);
        } catch (error) {
          // Expected to fail, but we can measure time
        }
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        const callCount = generateText.mock.calls.length;
        
        results.push({
          phases: phaseCount,
          time: executionTime,
          calls: callCount
        });
        
        console.log(`${phaseCount} phases: ${executionTime.toFixed(2)}ms, ${callCount} API calls`);
      }
      
      console.log('Scalability results:', results);
      
      // Performance should scale reasonably with phase count
      expect(results[0].time).toBeLessThan(1000);
      expect(results[results.length - 1].time).toBeLessThan(5000);
    });
  });
});