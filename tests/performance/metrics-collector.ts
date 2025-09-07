/**
 * Performance Metrics Collector
 * 
 * This module collects and analyzes performance metrics for the hybrid roadmap system.
 * It provides utilities for measuring response times, API call counts, memory usage,
 * and other performance indicators.
 */

export interface PerformanceMetrics {
  executionTime: number;
  apiCalls: number;
  memoryUsed: number;
  phasesProcessed: number;
  timestamp: Date;
  testName: string;
  approach: 'hybrid' | 'legacy';
}

export interface PerformanceComparison {
  hybrid: PerformanceMetrics;
  legacy: PerformanceMetrics;
  improvement: {
    timeReduction: number;
    apiCallReduction: number;
    memoryEfficiency: number;
  };
}

export class MetricsCollector {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;
  private startMemory: NodeJS.MemoryUsage = { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 };
  private apiCallCount: number = 0;

  /**
   * Start collecting metrics for a test
   */
  start(testName: string): void {
    this.startTime = performance.now();
    this.startMemory = process.memoryUsage();
    this.apiCallCount = 0;
    console.log(`🚀 Starting performance test: ${testName}`);
  }

  /**
   * Record an API call
   */
  recordApiCall(): void {
    this.apiCallCount++;
  }

  /**
   * Stop collecting metrics and return the results
   */
  stop(testName: string, approach: 'hybrid' | 'legacy', phasesProcessed: number = 1): PerformanceMetrics {
    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    
    const executionTime = endTime - this.startTime;
    const memoryUsed = endMemory.heapUsed - this.startMemory.heapUsed;
    
    const metrics: PerformanceMetrics = {
      executionTime,
      apiCalls: this.apiCallCount,
      memoryUsed,
      phasesProcessed,
      timestamp: new Date(),
      testName,
      approach
    };

    this.metrics.push(metrics);
    
    console.log(`✅ Performance test completed: ${testName}`);
    console.log(`   Execution time: ${executionTime.toFixed(2)}ms`);
    console.log(`   API calls: ${this.apiCallCount}`);
    console.log(`   Memory used: ${(memoryUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Phases processed: ${phasesProcessed}`);
    
    return metrics;
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get metrics for a specific test
   */
  getMetricsForTest(testName: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.testName === testName);
  }

  /**
   * Compare hybrid vs legacy performance
   */
  compareApproaches(testName: string): PerformanceComparison | null {
    const testMetrics = this.getMetricsForTest(testName);
    const hybridMetrics = testMetrics.find(m => m.approach === 'hybrid');
    const legacyMetrics = testMetrics.find(m => m.approach === 'legacy');

    if (!hybridMetrics || !legacyMetrics) {
      return null;
    }

    const timeReduction = ((legacyMetrics.executionTime - hybridMetrics.executionTime) / legacyMetrics.executionTime) * 100;
    const apiCallReduction = ((legacyMetrics.apiCalls - hybridMetrics.apiCalls) / legacyMetrics.apiCalls) * 100;
    const memoryEfficiency = ((legacyMetrics.memoryUsed - hybridMetrics.memoryUsed) / legacyMetrics.memoryUsed) * 100;

    return {
      hybrid: hybridMetrics,
      legacy: legacyMetrics,
      improvement: {
        timeReduction,
        apiCallReduction,
        memoryEfficiency
      }
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const report = ['# Performance Test Report\n'];
    
    // Group metrics by test name
    const testGroups = this.metrics.reduce((groups, metric) => {
      if (!groups[metric.testName]) {
        groups[metric.testName] = [];
      }
      groups[metric.testName].push(metric);
      return groups;
    }, {} as Record<string, PerformanceMetrics[]>);

    // Generate report for each test
    Object.entries(testGroups).forEach(([testName, metrics]) => {
      report.push(`## ${testName}\n`);
      
      const hybridMetrics = metrics.find(m => m.approach === 'hybrid');
      const legacyMetrics = metrics.find(m => m.approach === 'legacy');
      
      if (hybridMetrics) {
        report.push(`### Hybrid Approach`);
        report.push(`- Execution Time: ${hybridMetrics.executionTime.toFixed(2)}ms`);
        report.push(`- API Calls: ${hybridMetrics.apiCalls}`);
        report.push(`- Memory Used: ${(hybridMetrics.memoryUsed / 1024 / 1024).toFixed(2)}MB`);
        report.push(`- Phases Processed: ${hybridMetrics.phasesProcessed}\n`);
      }
      
      if (legacyMetrics) {
        report.push(`### Legacy Approach`);
        report.push(`- Execution Time: ${legacyMetrics.executionTime.toFixed(2)}ms`);
        report.push(`- API Calls: ${legacyMetrics.apiCalls}`);
        report.push(`- Memory Used: ${(legacyMetrics.memoryUsed / 1024 / 1024).toFixed(2)}MB`);
        report.push(`- Phases Processed: ${legacyMetrics.phasesProcessed}\n`);
      }
      
      if (hybridMetrics && legacyMetrics) {
        const comparison = this.compareApproaches(testName);
        if (comparison) {
          report.push(`### Performance Improvement`);
          report.push(`- Time Reduction: ${comparison.improvement.timeReduction.toFixed(2)}%`);
          report.push(`- API Call Reduction: ${comparison.improvement.apiCallReduction.toFixed(2)}%`);
          report.push(`- Memory Efficiency: ${comparison.improvement.memoryEfficiency.toFixed(2)}%\n`);
        }
      }
    });

    // Overall statistics
    report.push(`## Overall Statistics\n`);
    report.push(`- Total Tests: ${this.metrics.length}`);
    report.push(`- Average Execution Time: ${(this.metrics.reduce((sum, m) => sum + m.executionTime, 0) / this.metrics.length).toFixed(2)}ms`);
    report.push(`- Average API Calls: ${(this.metrics.reduce((sum, m) => sum + m.apiCalls, 0) / this.metrics.length).toFixed(2)}`);
    report.push(`- Average Memory Used: ${(this.metrics.reduce((sum, m) => sum + m.memoryUsed, 0) / this.metrics.length / 1024 / 1024).toFixed(2)}MB\n`);

    return report.join('\n');
  }

  /**
   * Clear all collected metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Export metrics to JSON
   */
  exportToJson(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Export metrics to CSV
   */
  exportToCsv(): string {
    if (this.metrics.length === 0) {
      return '';
    }

    const headers = Object.keys(this.metrics[0]).join(',');
    const rows = this.metrics.map(metric => 
      Object.values(metric).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  }
}

// Global metrics collector instance
export const globalMetricsCollector = new MetricsCollector();
