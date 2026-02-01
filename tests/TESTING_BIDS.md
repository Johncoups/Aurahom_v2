# Testing Guide for `lib/bids.ts`

This guide explains how to test the Vendor CRUD functions in `lib/bids.ts`.

## Quick Start

### Run the Test Suite

```bash
# Run all tests
npm test

# Run only the bids tests
npm test -- tests/bids.test.ts

# Run in watch mode
npm test -- tests/bids.test.ts --watch

# Run with coverage
npm test -- tests/bids.test.ts --coverage
```

## Test File Location

The test file is located at: `tests/bids.test.ts`

## What's Being Tested

The test suite covers all Vendor CRUD operations:

1. **createVendor** - Creating new vendors
2. **updateVendor** - Updating existing vendors
3. **removeVendorFromUser** - Removing vendor associations from users
4. **removeVendorFromProject** - Removing vendor associations from projects
5. **getVendorsByUser** - Fetching vendors for a user
6. **getVendorsByProject** - Fetching vendors for a project
7. **searchVendors** - Searching vendors with filters

## Manual Testing (Without Jest)

If you want to test the functions manually in your application:

### 1. Create a Test Page

Create a test page at `app/test-vendors/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  createVendor,
  getVendorsByUser,
  searchVendors,
  type CreateVendorInput,
} from "@/lib/bids";

export default function TestVendorsPage() {
  const [result, setResult] = useState<any>(null);
  const [userId, setUserId] = useState("");

  const handleCreateVendor = async () => {
    const vendorData: CreateVendorInput = {
      name: "Test Vendor",
      email: "test@vendor.com",
      phone: "555-1234",
    };

    const response = await createVendor(vendorData, userId);
    setResult(response);
    console.log("Create Vendor Result:", response);
  };

  const handleGetVendors = async () => {
    const response = await getVendorsByUser(userId);
    setResult(response);
    console.log("Get Vendors Result:", response);
  };

  const handleSearchVendors = async () => {
    const response = await searchVendors("Test");
    setResult(response);
    console.log("Search Vendors Result:", response);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Vendor CRUD</h1>
      
      <div className="mb-4">
        <label className="block mb-2">User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter user ID"
        />
      </div>

      <div className="space-x-2 mb-4">
        <button
          onClick={handleCreateVendor}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Vendor
        </button>
        <button
          onClick={handleGetVendors}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Get My Vendors
        </button>
        <button
          onClick={handleSearchVendors}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Search Vendors
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### 2. Test in Supabase SQL Editor

You can also test the database queries directly in Supabase:

```sql
-- Test creating a vendor (via your app, then verify)
SELECT * FROM vendors WHERE name = 'Test Vendor';

-- Test getting vendors for a user
SELECT v.*, uv.* 
FROM vendors v
JOIN user_vendors uv ON v.id = uv.vendor_id
WHERE uv.user_id = 'your-user-id-here';

-- Test searching vendors
SELECT * FROM vendors 
WHERE name ILIKE '%plumbing%' 
   OR company_name ILIKE '%plumbing%'
   OR email ILIKE '%plumbing%';
```

## Integration Testing

For integration tests that hit the real database:

1. Set up a test Supabase project
2. Use environment variables to point to test database
3. Create test data fixtures
4. Clean up after tests

Example integration test structure:

```typescript
describe('Vendor CRUD Integration Tests', () => {
  const testUserId = 'test-user-id';
  let createdVendorId: string;

  beforeAll(async () => {
    // Set up test database connection
    // Create test user
  });

  afterAll(async () => {
    // Clean up test data
  });

  it('should create and retrieve a vendor', async () => {
    // Test with real database
  });
});
```

## Common Issues and Solutions

### Issue: "cookies() was called outside a request scope"

**Solution:** The test mocks need to properly handle the async `cookies()` function. The test file already includes mocks for this, but if you see this error:

1. Make sure mocks are set up before importing the module
2. Check that `jest.mock('next/headers')` is properly configured
3. Ensure `createServerSupabaseClient` is mocked

### Issue: Tests fail with RLS (Row Level Security) errors

**Solution:** RLS policies require authentication. In tests:
- Mock the Supabase client to bypass RLS
- Or use a service role key for testing (not recommended for unit tests)
- Test RLS separately in integration tests

## Test Coverage Goals

Aim for:
- ✅ All CRUD operations tested
- ✅ Error cases covered (missing IDs, validation errors)
- ✅ Edge cases (empty results, null values)
- ✅ Database error handling

## Next Steps

1. Run the test suite: `npm test -- tests/bids.test.ts`
2. Fix any failing tests
3. Add more test cases as needed
4. Consider adding integration tests for end-to-end validation
