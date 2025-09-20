# Performance Testing Suite

This directory contains comprehensive performance tests for the hybrid roadmap system. These tests measure and compare the performance of the new hybrid approach against the legacy system.

## Test Categories

### 1. Benchmark Tests (`benchmark.test.ts`)
Core performance measurements:
- **Response Time Comparison**: Measures execution time for hybrid vs legacy approaches
- **API Call Efficiency**: Counts and compares API calls between approaches
- **Memory Usage Testing**: Monitors memory consumption with large datasets
- **Concurrent Request Performance**: Tests handling of multiple simultaneous requests
- **Scalability Testing**: Measures performance with increasing phase counts

### 2. Comprehensive Performance Tests (`comprehensive.test.ts`)
Advanced performance analysis using the metrics collector:
- **Detailed Metrics Collection**: Tracks execution time, API calls, memory usage
- **Performance Comparison**: Side-by-side comparison of hybrid vs legacy
- **Memory Usage Analysis**: Deep dive into memory consumption patterns
- **Concurrent Request Analysis**: Detailed analysis of concurrent request handling
- **Scalability Analysis**: Comprehensive scalability testing with metrics

### 3. Metrics Collector (`metrics-collector.ts`)
Utility for collecting and analyzing performance data:
- **PerformanceMetrics Interface**: Standardized performance data structure
- **MetricsCollector Class**: Collects, stores, and analyzes performance data
- **Report Generation**: Generates detailed performance reports
- **Data Export**: Exports metrics to JSON and CSV formats

## Running Performance Tests

### Run All Performance Tests
```bash
npm run test:performance
```

### Run Specific Test Suites
```bash
# Benchmark tests only
npm run test:performance:benchmark

# Comprehensive tests only
npm run test:performance:comprehensive
```

### Run with Custom Runner
```bash
# Uses the custom performance test runner
npm run test:performance:run
```

### Run Individual Tests
```bash
# Run a specific test file
npx jest tests/performance/benchmark.test.ts --config=tests/performance/jest.config.js

# Run with verbose output
npx jest tests/performance/benchmark.test.ts --config=tests/performance/jest.config.js --verbose
```

## Performance Metrics

### Key Metrics Measured

1. **Execution Time**
   - Total time to complete roadmap generation
   - Measured in milliseconds
   - Includes all API calls and processing

2. **API Call Count**
   - Number of OpenAI API calls made
   - Hybrid approach should have fewer calls due to shared context
   - Measured per request and per phase

3. **Memory Usage**
   - Heap memory consumption during execution
   - Measured in bytes
   - Tracks memory efficiency

4. **Phases Processed**
   - Number of construction phases processed
   - Used for scalability analysis
   - Affects API call count and execution time

### Expected Performance Improvements

The hybrid approach should demonstrate:

- **50%+ reduction in API calls** due to shared context reuse
- **Faster response times** through parallel processing
- **Better memory efficiency** with optimized data structures
- **Improved scalability** with linear time complexity

## Test Data

### Mock Data Structure
All performance tests use consistent mock data:

```typescript
// Base profile for testing
const baseProfile: OnboardingProfile = {
  role: 'owner-builder',
  experience: 'some',
  diyPhaseIds: ['foundation', 'framing', 'electrical', 'plumbing'],
  timeCommitment: 'part-time',
  cityState: 'Austin, TX',
  // ... other fields
};

// Mock regional analysis response
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
```

## Performance Assertions

### Time-based Assertions
```typescript
// Execution time should be reasonable
expect(executionTime).toBeLessThan(10000); // 10 seconds max

// Concurrent requests should be efficient
expect(concurrentTime).toBeLessThan(20000); // 20 seconds for 2 requests
```

### API Call Assertions
```typescript
// Hybrid approach should have fewer API calls
expect(hybridApiCalls).toBeLessThan(legacyApiCalls);

// API calls should scale linearly with phases
expect(apiCalls).toBeLessThanOrEqual(phases + 3); // 3 shared + 1 per phase
```

### Memory Assertions
```typescript
// Memory usage should be reasonable
expect(memoryUsed).toBeLessThan(50 * 1024 * 1024); // Less than 50MB

// Memory should not grow exponentially
expect(memoryRatio).toBeLessThan(phaseRatio * 2);
```

## Performance Reports

### Automatic Report Generation
The test runner automatically generates performance reports:

- **JSON Report**: `performance-report.json` - Machine-readable performance data
- **HTML Report**: `performance-reports/performance-report.html` - Human-readable report
- **Console Output**: Real-time performance metrics during test execution

### Report Contents
- Test execution summary
- Performance metrics for each test
- Comparison between hybrid and legacy approaches
- Performance improvement percentages
- Recommendations for optimization

## Troubleshooting

### Common Issues

1. **Tests Timing Out**
   - Increase `testTimeout` in Jest configuration
   - Check for infinite loops or blocking operations
   - Verify mock responses are properly configured

2. **Memory Issues**
   - Reduce size of test data
   - Clear mocks between tests
   - Check for memory leaks in test code

3. **API Call Count Mismatches**
   - Verify mock setup is correct
   - Check that all expected API calls are mocked
   - Ensure test isolation (clear mocks between tests)

### Debug Commands
```bash
# Run with debug output
npm run test:performance -- --verbose

# Run specific test with debug
npx jest tests/performance/benchmark.test.ts --config=tests/performance/jest.config.js --verbose --no-cache

# Run with memory profiling
node --inspect-brk node_modules/.bin/jest tests/performance/benchmark.test.ts --config=tests/performance/jest.config.js
```

## Continuous Integration

### CI/CD Integration
Performance tests are designed to run in CI/CD pipelines:

- **Fast Execution**: Tests complete within reasonable time
- **Deterministic Results**: Consistent results across runs
- **Clear Reporting**: Easy to interpret results and failures
- **Performance Regression Detection**: Alerts when performance degrades

### Performance Thresholds
Set performance thresholds in CI:

```yaml
# Example GitHub Actions workflow
- name: Run Performance Tests
  run: |
    npm run test:performance
    # Fail if performance degrades by more than 20%
    node scripts/check-performance-thresholds.js --threshold=0.2
```

## Contributing

### Adding New Performance Tests

1. **Follow Naming Conventions**
   - Use descriptive test names
   - Group related tests in describe blocks
   - Use consistent mock data structures

2. **Include Performance Assertions**
   - Always include time-based assertions
   - Measure relevant metrics (API calls, memory)
   - Compare against expected performance

3. **Document Performance Expectations**
   - Add comments explaining expected performance
   - Include performance improvement targets
   - Document any performance trade-offs

4. **Update Documentation**
   - Update this README with new test descriptions
   - Add new metrics to the documentation
   - Update performance thresholds if needed

### Performance Test Best Practices

1. **Use Realistic Data**
   - Test with production-like data sizes
   - Include edge cases and boundary conditions
   - Test with various user profiles and scenarios

2. **Measure Consistently**
   - Use the same measurement methodology
   - Clear mocks and state between tests
   - Run tests multiple times for accuracy

3. **Focus on User Impact**
   - Measure metrics that affect user experience
   - Test realistic usage patterns
   - Consider both happy path and error scenarios

4. **Monitor Trends**
   - Track performance over time
   - Set up alerts for performance regressions
   - Document performance improvements
