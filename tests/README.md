# Hybrid Roadmap Test Suite

This directory contains comprehensive tests for the hybrid roadmap system implementation.

## Test Files

- `hybrid-roadmap.test.ts` - Main test suite for the hybrid roadmap system
- `regional-analysis.test.ts` - Tests for regional analysis generation
- `project-context.test.ts` - Tests for project context building
- `phase-prompt-builder.test.ts` - Tests for phase-specific prompt generation

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests for CI
```bash
npm run test:ci
```

## Test Coverage

The test suite covers:

- ✅ Regional analysis generation for different locations
- ✅ Project context building for various construction methods
- ✅ User profile building and validation
- ✅ Phase-specific prompt generation
- ✅ Phase response parsing and validation
- ✅ Unified response assembly
- ✅ Hybrid roadmap generation
- ✅ Error handling and fallbacks
- ✅ Performance and integration testing

## Test Data

Tests use mock data that simulates real user profiles and scenarios:

- **User Profiles**: Owner-builders, contractors, different experience levels
- **Locations**: California, Texas, Florida, New York, and invalid locations
- **Construction Methods**: Barndominium, traditional, modular
- **Foundation Types**: Slab, basement, crawl-space, pier-beam
- **House Sizes**: Small, medium, large
- **Stories**: Single-story, two-story, multi-story

## Mocking

The test suite includes comprehensive mocking for:

- Supabase client and database operations
- OpenAI API calls
- Next.js router and navigation
- Environment variables
- External dependencies

## Coverage Thresholds

The test suite enforces minimum coverage thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Continuous Integration

Tests are designed to run in CI environments with:

- No watch mode
- Coverage reporting
- Fail on coverage threshold violations
- Parallel execution where possible

## Debugging Tests

To debug specific tests:

1. Use `npm run test:watch` for interactive mode
2. Add `--verbose` flag for detailed output
3. Use `--testNamePattern` to run specific tests
4. Check coverage reports in `coverage/` directory

## Adding New Tests

When adding new tests:

1. Follow the existing naming conventions
2. Use descriptive test names
3. Include both positive and negative test cases
4. Mock external dependencies
5. Update this README if adding new test files
