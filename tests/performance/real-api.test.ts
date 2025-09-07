import { generateHybridRoadmap } from '@/lib/hybrid-roadmap-generator';
import { generateRoadmap } from '@/app/actions/generateRoadmap';
import type { OnboardingProfile } from '@/lib/roadmap-types';

// This test uses REAL OpenAI API calls - make sure you have OPENAI_API_KEY set
// Run with: npm run test:performance:real

// Load real environment variables for this test
import { config } from 'dotenv';
config({ path: '.env.local' });

describe('Real API Performance Tests', () => {
  const mockProjectId = 'test-project-real-api';
  
  const baseProfile: OnboardingProfile = {
    role: 'owner-builder',
    experience: 'some',
    diyPhaseIds: ['foundation', 'framing'],
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
    currentPhaseId: 'foundation', // Add required field
    weeklyHourlyCommitment: '10-20', // Add required field
    background: {
      constructionExperience: 'some',
      projectManagement: 'some',
      timeAvailable: 'part-time',
      learningStyle: 'hands-on',
      riskTolerance: 'moderate'
    }
  };

  // Skip if no API key is available
  beforeAll(() => {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️  OPENAI_API_KEY not found. Skipping real API tests.');
      console.log('   Set OPENAI_API_KEY environment variable to run real API tests.');
    }
    
    // Verify we're using the real API key, not the test one
    if (process.env.OPENAI_API_KEY === 'test-openai-key') {
      console.log('⚠️  Using test API key instead of real one. Check jest.setup.js');
      throw new Error('Using test API key instead of real one');
    }
    
    console.log('✅ Using real OpenAI API key for performance tests');
  });

  describe('Real API Performance Comparison', () => {
    it('should measure hybrid approach with real OpenAI API calls', async () => {
      if (!process.env.OPENAI_API_KEY) {
        console.log('Skipping test - no API key');
        return;
      }

      console.log('🚀 Testing hybrid approach with REAL OpenAI API calls...');
      
      const startTime = performance.now();
      const startMemory = process.memoryUsage().heapUsed;
      
      try {
        const result = await generateHybridRoadmap(baseProfile, mockProjectId);
        
        const endTime = performance.now();
        const endMemory = process.memoryUsage().heapUsed;
        
        const executionTime = endTime - startTime;
        const memoryUsed = (endMemory - startMemory) / 1024 / 1024; // MB
        
        console.log(`✅ Hybrid approach completed:`);
        console.log(`   Execution time: ${executionTime.toFixed(2)}ms`);
        console.log(`   Memory used: ${memoryUsed.toFixed(2)}MB`);
        console.log(`   Phases generated: ${result.phaseResponses?.length || 0}`);
        
        // Verify we got a real response
        expect(result).toBeDefined();
        expect(result.phaseResponses).toBeDefined();
        expect(result.phaseResponses.length).toBeGreaterThan(0);
        
        // Performance expectations for real API calls
        expect(executionTime).toBeLessThan(30000); // Should complete within 30 seconds
        expect(memoryUsed).toBeLessThan(100); // Should use less than 100MB
        
      } catch (error) {
        console.error('❌ Hybrid approach failed:', error);
        throw error;
      }
    }, 60000); // 60 second timeout for real API calls

    it('should measure legacy approach with real OpenAI API calls', async () => {
      if (!process.env.OPENAI_API_KEY) {
        console.log('Skipping test - no API key');
        return;
      }

      console.log('🚀 Testing legacy approach with REAL OpenAI API calls...');
      
      const startTime = performance.now();
      const startMemory = process.memoryUsage().heapUsed;
      
      try {
        const result = await generateRoadmap(baseProfile, mockProjectId);
        
        const endTime = performance.now();
        const endMemory = process.memoryUsage().heapUsed;
        
        const executionTime = endTime - startTime;
        const memoryUsed = (endMemory - startMemory) / 1024 / 1024; // MB
        
        console.log(`✅ Legacy approach completed:`);
        console.log(`   Execution time: ${executionTime.toFixed(2)}ms`);
        console.log(`   Memory used: ${memoryUsed.toFixed(2)}MB`);
        console.log(`   Phases generated: ${result.phases?.length || 0}`);
        
        // Verify we got a real response
        expect(result).toBeDefined();
        expect(result.phases).toBeDefined();
        expect(result.phases.length).toBeGreaterThan(0);
        
        // Performance expectations for real API calls
        expect(executionTime).toBeLessThan(30000); // Should complete within 30 seconds
        expect(memoryUsed).toBeLessThan(100); // Should use less than 100MB
        
      } catch (error) {
        console.error('❌ Legacy approach failed:', error);
        throw error;
      }
    }, 60000); // 60 second timeout for real API calls
  });

  describe('Real API Scalability Test', () => {
    it('should test scalability with real API calls', async () => {
      if (!process.env.OPENAI_API_KEY) {
        console.log('Skipping test - no API key');
        return;
      }

      console.log('🚀 Testing scalability with REAL OpenAI API calls...');
      
      const profiles = [
        { ...baseProfile, cityState: 'Austin, TX' },
        { ...baseProfile, cityState: 'San Francisco, CA' },
        { ...baseProfile, cityState: 'Miami, FL' }
      ];
      
      const startTime = performance.now();
      
      try {
        // Test concurrent requests with real API calls
        const promises = profiles.map((profile, index) => 
          generateHybridRoadmap(profile, `test-project-${index}`)
        );
        
        const results = await Promise.all(promises);
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        console.log(`✅ Concurrent requests completed:`);
        console.log(`   Execution time: ${executionTime.toFixed(2)}ms`);
        console.log(`   Requests processed: ${results.length}`);
        console.log(`   Average time per request: ${(executionTime / results.length).toFixed(2)}ms`);
        
        // Verify all requests succeeded
        results.forEach((result, index) => {
          expect(result).toBeDefined();
          expect(result.phaseResponses).toBeDefined();
          console.log(`   Request ${index + 1}: ${result.phaseResponses.length} phases`);
        });
        
        // Performance expectations
        expect(executionTime).toBeLessThan(60000); // Should complete within 60 seconds
        expect(results.length).toBe(3);
        
      } catch (error) {
        console.error('❌ Scalability test failed:', error);
        throw error;
      }
    }, 120000); // 2 minute timeout for concurrent real API calls
  });

  describe('Real API Cost Analysis', () => {
    it('should analyze API costs with real calls', async () => {
      if (!process.env.OPENAI_API_KEY) {
        console.log('Skipping test - no API key');
        return;
      }

      console.log('💰 Analyzing API costs with REAL OpenAI API calls...');
      
      const startTime = performance.now();
      
      try {
        const result = await generateHybridRoadmap(baseProfile, mockProjectId);
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Count the number of API calls made
        // This is a rough estimate based on the hybrid approach structure
        const estimatedApiCalls = 3 + (result.phaseResponses?.length || 0); // 3 for shared context + 1 per phase
        
        console.log(`💰 Cost Analysis:`);
        console.log(`   Execution time: ${executionTime.toFixed(2)}ms`);
        console.log(`   Estimated API calls: ${estimatedApiCalls}`);
        console.log(`   Phases generated: ${result.phaseResponses?.length || 0}`);
        console.log(`   Average time per API call: ${(executionTime / estimatedApiCalls).toFixed(2)}ms`);
        
        // Rough cost estimation (this would need to be updated based on actual OpenAI pricing)
        const estimatedCost = estimatedApiCalls * 0.002; // Rough estimate: $0.002 per API call
        console.log(`   Estimated cost: $${estimatedCost.toFixed(4)}`);
        
        expect(result).toBeDefined();
        expect(estimatedApiCalls).toBeGreaterThan(0);
        
      } catch (error) {
        console.error('❌ Cost analysis failed:', error);
        throw error;
      }
    }, 60000); // 60 second timeout
  });
});
