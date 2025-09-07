# Integration Test Suite

This directory contains comprehensive integration tests for the hybrid roadmap system. These tests verify that the system works correctly with real-world scenarios, different user profiles, locations, construction methods, and various error conditions.

## Test Categories

### 1. User Profiles (`user-profiles.test.ts`)
Tests different user experience levels and time commitments:
- **Complete Beginner**: No construction experience, part-time availability
- **Experienced Contractor**: Extensive experience, full-time availability
- **Weekend Warrior**: Some experience, weekends-only availability
- **Error Handling**: Invalid profiles, missing data

### 2. Locations (`locations.test.ts`)
Tests different geographic locations and regulatory environments:
- **High Regulation States**: California, New York (complex permits, strict codes)
- **Moderate Regulation States**: Texas, Florida (standard regulations)
- **Low Regulation States**: Wyoming, Alaska (simplified processes)
- **Climate Zones**: Hot-humid, cold, marine, continental

### 3. Construction Methods (`construction-methods.test.ts`)
Tests different construction approaches and foundation types:
- **Barndominium**: Slab foundation, pier foundation
- **Traditional**: Basement, crawl space, slab
- **Modular**: Prefabricated construction
- **Size Variations**: Small (<1500 sq ft), large (4000+ sq ft)

### 4. Performance (`performance.test.ts`)
Tests system performance and efficiency:
- **Parallel Processing**: Multiple phases processed concurrently
- **API Call Efficiency**: Minimized calls with shared context
- **Memory Usage**: Large responses handled without issues
- **Scalability**: Performance with many phases

### 5. Error Scenarios (`error-scenarios.test.ts`)
Tests error handling and recovery:
- **OpenAI API Errors**: Timeouts, rate limits, authentication
- **Invalid Responses**: Malformed JSON, missing fields
- **Database Errors**: Connection failures, insert errors
- **Network Issues**: Timeouts, connection failures
- **Concurrent Requests**: Multiple simultaneous requests

## Running Tests

### Run All Integration Tests
```bash
npm run test:integration
```

### Run Specific Test Categories
```bash
# User profiles only
npm test tests/integration/user-profiles.test.ts

# Locations only
npm test tests/integration/locations.test.ts

# Construction methods only
npm test tests/integration/construction-methods.test.ts

# Performance only
npm test tests/integration/performance.test.ts

# Error scenarios only
npm test tests/integration/error-scenarios.test.ts
```

### Run with Coverage
```bash
npm run test:coverage
```

### Run in Watch Mode
```bash
npm run test:watch
```

## Test Data

### Mock Data Structure
All tests use consistent mock data structures:

```typescript
// User Profile
const profile: OnboardingProfile = {
  role: 'owner-builder',
  experience: 'some',
  diyPhaseIds: ['foundation'],
  timeCommitment: 'part-time',
  cityState: 'Austin, TX',
  // ... other fields
};

// Regional Analysis Response
const regionalAnalysis = {
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
};

// Phase Response
const phaseResponse = {
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
};
```

## Test Assertions

### Common Assertions
- **Response Structure**: Verify all required fields are present
- **Data Types**: Ensure correct data types for all fields
- **Regional Context**: Verify regional analysis is consistent
- **Phase Processing**: Confirm all phases are processed
- **Error Handling**: Ensure errors are handled gracefully

### Performance Assertions
- **Execution Time**: Tests complete within reasonable time
- **API Calls**: Minimized number of API calls
- **Memory Usage**: Large responses handled without issues
- **Parallel Processing**: Multiple phases processed concurrently

## Mocking Strategy

### OpenAI API Mocking
```typescript
jest.mock('@/lib/openai', () => ({
  generateText: jest.fn()
}));

// Mock responses
const { generateText } = require('@/lib/openai');
generateText
  .mockResolvedValueOnce(JSON.stringify(regionalAnalysis))
  .mockResolvedValueOnce(JSON.stringify(projectContext))
  .mockResolvedValueOnce(JSON.stringify(userProfile))
  .mockResolvedValue(JSON.stringify(phaseResponse));
```

### Supabase Mocking
```typescript
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
```

## Test Coverage

The integration tests aim for comprehensive coverage of:
- ✅ All user profile types
- ✅ All major geographic regions
- ✅ All construction methods
- ✅ All foundation types
- ✅ All error scenarios
- ✅ Performance characteristics
- ✅ Edge cases and boundary conditions

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- **Fast Execution**: Tests complete quickly with mocks
- **Deterministic**: Consistent results across runs
- **Isolated**: No external dependencies
- **Comprehensive**: Cover all critical paths

## Debugging

### Common Issues
1. **Mock Not Working**: Ensure mocks are set up before test execution
2. **Async Issues**: Use `await` for async operations
3. **Data Mismatch**: Verify mock data matches expected structure
4. **Timeout Issues**: Increase Jest timeout for slow tests

### Debug Commands
```bash
# Run with verbose output
npm test -- --verbose

# Run specific test with debug info
npm test -- --testNamePattern="should handle complete beginner profile"

# Run with coverage and debug
npm run test:coverage -- --verbose
```

## Contributing

When adding new integration tests:
1. Follow the existing naming conventions
2. Use consistent mock data structures
3. Include both positive and negative test cases
4. Add appropriate assertions
5. Update this documentation
6. Ensure tests are isolated and deterministic
