#!/usr/bin/env node

/**
 * Performance Test Runner
 * 
 * This script runs performance tests and generates detailed reports.
 * It can be used to benchmark the hybrid roadmap system against
 * the legacy approach and measure various performance metrics.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceTestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  /**
   * Run a specific performance test
   */
  async runTest(testName, testFile) {
    console.log(`\n🧪 Running ${testName}...`);
    
    try {
      const startTime = Date.now();
      
      // Run the test with Jest
      const command = `npx jest ${testFile} --verbose --no-coverage --testTimeout=30000`;
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.results.push({
        testName,
        testFile,
        duration,
        status: 'passed',
        output: output.toString()
      });
      
      console.log(`✅ ${testName} completed in ${duration}ms`);
      
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.results.push({
        testName,
        testFile,
        duration,
        status: 'failed',
        error: error.message,
        output: error.stdout?.toString() || ''
      });
      
      console.log(`❌ ${testName} failed in ${duration}ms`);
      console.log(`Error: ${error.message}`);
    }
  }

  /**
   * Run all performance tests
   */
  async runAllTests() {
    console.log('🚀 Starting Performance Test Suite...\n');
    
    const tests = [
      {
        name: 'Benchmark Tests',
        file: 'tests/performance/benchmark.test.ts'
      },
      {
        name: 'Comprehensive Performance Tests',
        file: 'tests/performance/comprehensive.test.ts'
      }
    ];

    for (const test of tests) {
      await this.runTest(test.name, test.file);
    }
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    const report = {
      summary: {
        totalTests: this.results.length,
        passed: this.results.filter(r => r.status === 'passed').length,
        failed: this.results.filter(r => r.status === 'failed').length,
        totalDuration: totalDuration,
        timestamp: new Date().toISOString()
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length;
    
    if (avgDuration > 10000) {
      recommendations.push('Consider optimizing test execution time - average duration is high');
    }
    
    const failedTests = this.results.filter(r => r.status === 'failed');
    if (failedTests.length > 0) {
      recommendations.push(`${failedTests.length} tests failed - review test setup and code issues`);
    }
    
    const longRunningTests = this.results.filter(r => r.duration > 15000);
    if (longRunningTests.length > 0) {
      recommendations.push(`${longRunningTests.length} tests took longer than 15 seconds - consider optimization`);
    }
    
    return recommendations;
  }

  /**
   * Save report to file
   */
  saveReport(report, filename = 'performance-report.json') {
    const reportPath = path.join(process.cwd(), filename);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📊 Performance report saved to: ${reportPath}`);
  }

  /**
   * Print summary to console
   */
  printSummary() {
    console.log('\n📈 Performance Test Summary');
    console.log('============================');
    
    const summary = this.results.reduce((acc, result) => {
      acc.total++;
      if (result.status === 'passed') acc.passed++;
      if (result.status === 'failed') acc.failed++;
      acc.totalDuration += result.duration;
      return acc;
    }, { total: 0, passed: 0, failed: 0, totalDuration: 0 });

    console.log(`Total Tests: ${summary.total}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Total Duration: ${summary.totalDuration}ms`);
    console.log(`Average Duration: ${(summary.totalDuration / summary.total).toFixed(2)}ms`);
    
    if (summary.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'failed')
        .forEach(r => console.log(`  - ${r.testName}: ${r.error}`));
    }
    
    console.log('\n✅ Performance tests completed!');
  }
}

// Main execution
async function main() {
  const runner = new PerformanceTestRunner();
  
  try {
    await runner.runAllTests();
    const report = runner.generateReport();
    runner.saveReport(report);
    runner.printSummary();
    
    // Exit with appropriate code
    const hasFailures = report.summary.failed > 0;
    process.exit(hasFailures ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Performance test runner failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = PerformanceTestRunner;
