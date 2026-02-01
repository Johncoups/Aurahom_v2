/**
 * Bids (Vendor CRUD + Bid Request) Test Suite
 *
 * Tests vendor CRUD and bid request operations in lib/bids.ts
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// next/headers and @/lib/supabase-server are mocked in jest.setup.js
// Get the mocked createServerSupabaseClient and the client it returns
const supabaseServerMock = jest.requireMock('@/lib/supabase-server')
const mockCreateServerSupabaseClientFn = supabaseServerMock.createServerSupabaseClient
// The mock returns a client with .from - we need to set up that chain in beforeEach
let mockSupabaseClient = { from: jest.fn() }
mockCreateServerSupabaseClientFn.mockImplementation(() => Promise.resolve(mockSupabaseClient))

// Mock sendBidReceivedNotification so submitBid doesn't actually send email (optional: assert it was called)
const mockSendBidReceivedNotification = jest.fn().mockResolvedValue(undefined)
jest.mock('@/lib/email', () => {
  const actual = jest.requireActual('@/lib/email') as typeof import('@/lib/email')
  return {
    ...actual,
    sendBidReceivedNotification: (...args: unknown[]) => mockSendBidReceivedNotification(...args),
  }
})

// Now import the functions after mocks are set up
import {
  createVendor,
  updateVendor,
  removeVendorFromUser,
  removeVendorFromProject,
  addVendorToProject,
  ensureProjectVendor,
  updateProjectVendor,
  getVendorsByUser,
  getVendorsByProject,
  searchVendors,
  createBidRequest,
  updateBidRequestStatus,
  getBidRequestsByProject,
  getBidRequestsByVendor,
  deleteBidRequest,
  findExistingBidRequest,
  submitBid,
  addBidItems,
  updateBid,
  getBidsByProject,
  getBidsByRequest,
  acceptBid,
  rejectBid,
  compareBids,
  importVendorsFromCSV,
  exportVendorsToCSV,
  generateBidRequestPDF,
  getBudgetItemsByProject,
  getBudgetItemsByPhase,
  findBudgetItem,
  pushBidItemsToBudget,
  getAcceptedBidForRequest,
  getAcceptedBidsByProject,
  getBidItemsWithBudgetLinks,
  type CreateVendorInput,
  type UpdateVendorInput,
  type VendorSearchFilters,
  type CreateBidRequestInput,
  type CreateBidInput,
  type CreateBidItemInput,
  type UpdateBidInput,
  type AddVendorToProjectInput,
  type UpdateProjectVendorInput,
  type FindExistingBidRequestOptions,
  type BudgetItem,
} from '@/lib/bids'

// Import pure utility functions
import { calculateBidComparison } from '@/lib/bids-utils'

describe('Vendor CRUD Operations', () => {
  const mockUserId = 'test-user-id-123'
  const mockVendorId = 'test-vendor-id-456'
  const mockProjectId = 'test-project-id-789'

  const mockVendor: any = {
    id: mockVendorId,
    created_by_user_id: mockUserId,
    name: 'Test Vendor',
    company_name: 'Test Company',
    email: 'test@vendor.com',
    phone: '555-1234',
    website: 'https://testvendor.com',
    address: '123 Test St',
    city: 'Austin',
    state: 'TX',
    zip_code: '78701',
    rating_platform: 'Google',
    rating_score: 4.5,
    rating_reviews: 100,
    social_media: [{ platform: 'facebook', handle: 'testvendor' }],
    services_offered: ['plumbing', 'electrical'],
    specialties: ['residential'],
    service_area: ['Austin', 'Round Rock'],
    licensed: true,
    insured: true,
    license_number: 'TX-12345',
    insurance_info: 'Covered',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }

  const mockUserVendor: any = {
    id: 'user-vendor-id',
    user_id: mockUserId,
    vendor_id: mockVendorId,
    trade_category_id: 'trade-cat-id',
    notes: 'User notes',
    tags: ['favorite'],
    preferred_contact_method: 'email',
    contact_hours: '9-5',
    found_via: ['referral'],
    is_favorite: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    vendor: mockVendor,
  }

  const mockProjectVendor: any = {
    id: 'project-vendor-id',
    project_id: mockProjectId,
    vendor_id: mockVendorId,
    trade_category_id: 'trade-cat-id',
    notes: 'Project notes',
    tags: ['urgent'],
    preferred_contact_method: 'phone',
    found_via: ['search'],
    is_favorite: false,
    is_active: true,
    added_by_user_id: mockUserId,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    vendor: mockVendor,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the mock to return our mock client
    mockCreateServerSupabaseClientFn.mockResolvedValue(mockSupabaseClient)
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      overlaps: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      single: jest.fn(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    })
  })

  describe('createVendor', () => {
    it('should create a vendor successfully', async () => {
      const vendorData: CreateVendorInput = {
        name: 'New Vendor',
        email: 'new@vendor.com',
        phone: '555-5678',
      }

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockVendor, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        insert: jest.fn().mockReturnValue(queryBuilder),
      })

      const result = await createVendor(vendorData, mockUserId)

      expect(result.success).toBe(true)
      expect(result.vendor).toBeDefined()
      expect(result.vendor?.id).toBe(mockVendorId)
      expect(result.vendor?.name).toBe('Test Vendor')
    })

    it('should return error if name is missing', async () => {
      const vendorData: CreateVendorInput = {
        name: '',
        email: 'test@vendor.com',
      }

      const result = await createVendor(vendorData, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('name is required')
    })

    it('should return error if vendor with same email exists', async () => {
      const vendorData: CreateVendorInput = {
        name: 'New Vendor',
        email: 'existing@vendor.com',
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { id: 'existing-id', name: 'Existing Vendor' },
              error: null,
            }),
          }),
        }),
      })

      const result = await createVendor(vendorData, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('already exists')
    })

    it('should handle database errors', async () => {
      const vendorData: CreateVendorInput = {
        name: 'New Vendor',
        email: 'new@vendor.com',
      }

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        insert: jest.fn().mockReturnValue(queryBuilder),
      })

      const result = await createVendor(vendorData, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })
  })

  describe('updateVendor', () => {
    it('should update a vendor successfully', async () => {
      const updateData: UpdateVendorInput = {
        name: 'Updated Vendor Name',
        phone: '555-9999',
      }

      const queryBuilder = {
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { ...mockVendor, ...updateData }, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue({
        update: jest.fn().mockReturnValue(queryBuilder),
      })

      const result = await updateVendor(mockVendorId, updateData)

      expect(result.success).toBe(true)
      expect(result.vendor).toBeDefined()
      expect(result.vendor?.name).toBe('Updated Vendor Name')
      expect(result.vendor?.phone).toBe('555-9999')
    })

    it('should return error if vendor ID is missing', async () => {
      const updateData: UpdateVendorInput = { name: 'Updated Name' }

      const result = await updateVendor('', updateData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Vendor ID is required')
    })

    it('should return error if no fields to update', async () => {
      const updateData: UpdateVendorInput = {}

      const result = await updateVendor(mockVendorId, updateData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('No fields to update')
    })

    it('should handle vendor not found', async () => {
      const updateData: UpdateVendorInput = { name: 'Updated Name' }

      const queryBuilder = {
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue({
        update: jest.fn().mockReturnValue(queryBuilder),
      })

      const result = await updateVendor(mockVendorId, updateData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })

  describe('removeVendorFromUser', () => {
    it('should remove vendor from user successfully', async () => {
      const queryBuilder = {
        eq: jest.fn(),
      }
      // Chain: .delete().eq('user_id', _).eq('vendor_id', _) — first .eq returns builder, second returns Promise
      queryBuilder.eq.mockReturnValueOnce(queryBuilder).mockResolvedValueOnce({ error: null })

      mockSupabaseClient.from.mockReturnValue({
        delete: jest.fn().mockReturnValue(queryBuilder),
      })

      const result = await removeVendorFromUser(mockUserId, mockVendorId)

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_vendors')
    })

    it('should return error if user ID is missing', async () => {
      const result = await removeVendorFromUser('', mockVendorId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should handle database errors', async () => {
      const queryBuilder = {
        eq: jest.fn(),
      }
      queryBuilder.eq.mockReturnValueOnce(queryBuilder).mockResolvedValueOnce({ error: { message: 'Delete failed' } })

      mockSupabaseClient.from.mockReturnValue({
        delete: jest.fn().mockReturnValue(queryBuilder),
      })

      const result = await removeVendorFromUser(mockUserId, mockVendorId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
    })
  })

  describe('removeVendorFromProject', () => {
    it('should remove vendor from project successfully', async () => {
      const queryBuilder = {
        eq: jest.fn(),
      }
      queryBuilder.eq.mockReturnValueOnce(queryBuilder).mockResolvedValueOnce({ error: null })

      mockSupabaseClient.from.mockReturnValue({
        delete: jest.fn().mockReturnValue(queryBuilder),
      })

      const result = await removeVendorFromProject(mockProjectId, mockVendorId)

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('project_vendors')
    })

    it('should return error if project ID is missing', async () => {
      const result = await removeVendorFromProject('', mockVendorId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('required')
    })
  })

  describe('addVendorToProject', () => {
    it('should add vendor to project successfully', async () => {
      const options: AddVendorToProjectInput = {
        trade_category_id: 'trade-1',
        notes: 'Foundation sub',
        is_favorite: true,
      }
      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'pv-1', project_id: mockProjectId, vendor_id: mockVendorId, ...options },
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(insertChain)

      const result = await addVendorToProject(mockProjectId, mockVendorId, mockUserId, options)

      expect(result.success).toBe(true)
      expect(result.projectVendor).toBeDefined()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('project_vendors')
    })

    it('should return success when link already exists (idempotent)', async () => {
      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: '23505', message: 'unique violation' },
        }),
      }
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'pv-1', project_id: mockProjectId, vendor_id: mockVendorId },
          error: null,
        }),
      }
      mockSupabaseClient.from
        .mockReturnValueOnce(insertChain)
        .mockReturnValueOnce(selectChain)

      const result = await addVendorToProject(mockProjectId, mockVendorId, mockUserId)

      expect(result.success).toBe(true)
      expect(result.projectVendor).toBeDefined()
    })

    it('should return error if project ID is missing', async () => {
      const result = await addVendorToProject('', mockVendorId, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should return error if added-by user ID is missing', async () => {
      const result = await addVendorToProject(mockProjectId, mockVendorId, '')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Added-by user ID is required')
    })
  })

  describe('ensureProjectVendor', () => {
    it('should create project_vendors row when missing', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      const insertChain = {
        insert: jest.fn().mockResolvedValue({ error: null }),
      }
      mockSupabaseClient.from
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(insertChain)

      const result = await ensureProjectVendor(mockProjectId, mockVendorId, mockUserId)

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('project_vendors')
    })

    it('should return success when row already exists', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: { id: 'pv-1' }, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(selectChain)

      const result = await ensureProjectVendor(mockProjectId, mockVendorId, mockUserId)

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(1)
    })

    it('should return error if project ID is missing', async () => {
      const result = await ensureProjectVendor('', mockVendorId, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })
  })

  describe('updateProjectVendor', () => {
    it('should update project–vendor link successfully', async () => {
      const updateData: UpdateProjectVendorInput = { notes: 'Updated notes', is_favorite: true }
      const chain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'pv-1', project_id: mockProjectId, vendor_id: mockVendorId, ...updateData },
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await updateProjectVendor(mockProjectId, mockVendorId, updateData)

      expect(result.success).toBe(true)
      expect(result.projectVendor?.notes).toBe('Updated notes')
      expect(result.projectVendor?.is_favorite).toBe(true)
    })

    it('should return error if no fields to update', async () => {
      const result = await updateProjectVendor(mockProjectId, mockVendorId, {})
      expect(result.success).toBe(false)
      expect(result.error).toContain('No fields to update')
    })

    it('should return error if project ID is missing', async () => {
      const result = await updateProjectVendor('', mockVendorId, { notes: 'x' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })
  })

  describe('getVendorsByUser', () => {
    it('should get vendors for a user successfully', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockUserVendor], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await getVendorsByUser(mockUserId)

      expect(result.success).toBe(true)
      expect(result.vendors).toBeDefined()
      expect(result.vendors?.length).toBe(1)
      expect(result.vendors?.[0].id).toBe(mockVendorId)
      expect(result.vendors?.[0].user_vendor).toBeDefined()
      expect(result.vendors?.[0].user_vendor?.user_id).toBe(mockUserId)
    })

    it('should return error if user ID is missing', async () => {
      const result = await getVendorsByUser('')

      expect(result.success).toBe(false)
      expect(result.error).toContain('User ID is required')
    })

    it('should handle empty results', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await getVendorsByUser(mockUserId)

      expect(result.success).toBe(true)
      expect(result.vendors).toEqual([])
    })
  })

  describe('getVendorsByProject', () => {
    it('should get vendors for a project successfully', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockProjectVendor], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await getVendorsByProject(mockProjectId)

      expect(result.success).toBe(true)
      expect(result.vendors).toBeDefined()
      expect(result.vendors?.length).toBe(1)
      expect(result.vendors?.[0].id).toBe(mockVendorId)
      expect(result.vendors?.[0].project_vendor).toBeDefined()
      expect(result.vendors?.[0].project_vendor?.project_id).toBe(mockProjectId)
    })

    it('should return error if project ID is missing', async () => {
      const result = await getVendorsByProject('')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })
  })

  describe('searchVendors', () => {
    it('should search vendors by query string', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockVendor], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue(chain),
      })

      const result = await searchVendors('Test Vendor')

      expect(result.success).toBe(true)
      expect(result.vendors).toBeDefined()
      expect(result.vendors?.length).toBe(1)
      expect(chain.or).toHaveBeenCalled()
    })

    it('should search vendors with filters', async () => {
      const filters: VendorSearchFilters = {
        licensed: true,
        insured: true,
        rating_min: 4.0,
        city: 'Austin',
        state: 'TX',
      }

      const chain = {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        ilike: jest.fn().mockReturnThis(),
        overlaps: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockVendor], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue(chain),
      })

      const result = await searchVendors('Test', filters)

      expect(result.success).toBe(true)
      expect(result.vendors).toBeDefined()
    })

    it('should filter by trade_category_id', async () => {
      const filters: VendorSearchFilters = {
        trade_category_id: 'trade-cat-id',
      }

      // Mock the user_vendors query for trade_category filter
      const userVendorsQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [{ vendor_id: mockVendorId }],
          error: null,
        }),
      }

      const vendorsQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockVendor], error: null }),
      }

      // Code calls from('vendors') first, then from('user_vendors') for trade_category filter
      mockSupabaseClient.from
        .mockReturnValueOnce(vendorsQueryBuilder) // First call: from('vendors')
        .mockReturnValueOnce(userVendorsQueryBuilder) // Second call: from('user_vendors')

      const result = await searchVendors(undefined, filters)

      expect(result.success).toBe(true)
      expect(result.vendors).toBeDefined()
    })

    it('should return empty array if no vendors match trade_category', async () => {
      const filters: VendorSearchFilters = {
        trade_category_id: 'non-existent-trade-cat',
      }

      const userVendorsQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue(userVendorsQueryBuilder)

      const result = await searchVendors(undefined, filters)

      expect(result.success).toBe(true)
      expect(result.vendors).toEqual([])
    })

    it('should handle database errors', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Search failed' },
        }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue(chain),
      })

      const result = await searchVendors('Test')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Search failed')
    })

    it('should search without query or filters', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockVendor], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue(chain),
      })

      const result = await searchVendors()

      expect(result.success).toBe(true)
      expect(result.vendors).toBeDefined()
    })
  })
})

describe('Bid Request Functions', () => {
  const mockUserId = 'test-user-id-123'
  const mockVendorId = 'test-vendor-id-456'
  const mockProjectId = 'test-project-id-789'
  const mockRequestId = 'bid-request-id-abc'

  const mockBidRequest: any = {
    id: mockRequestId,
    project_id: mockProjectId,
    user_id: mockUserId,
    vendor_id: mockVendorId,
    trade_category_id: 'trade-cat-id',
    phase_ids: ['phase-1', 'phase-2'],
    scope_title: 'Foundation work',
    scope_description: 'Excavation and pour',
    status: 'pending',
    request_method: 'aurahom',
    requested_at: '2024-01-15T00:00:00Z',
    due_date: '2024-02-01',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateServerSupabaseClientFn.mockResolvedValue(mockSupabaseClient)
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })
  })

  describe('createBidRequest', () => {
    it('should create a bid request successfully', async () => {
      const input: CreateBidRequestInput = {
        project_id: mockProjectId,
        vendor_id: mockVendorId,
        phase_ids: ['phase-1'],
        request_method: 'aurahom',
      }

      const queryBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockBidRequest, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await createBidRequest(input, mockUserId)

      expect(result.success).toBe(true)
      expect(result.bidRequest).toBeDefined()
      expect(result.bidRequest?.id).toBe(mockRequestId)
      expect(result.bidRequest?.status).toBe('pending')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('bid_requests')
    })

    it('should return error if project_id is missing', async () => {
      const input: CreateBidRequestInput = {
        project_id: '',
        vendor_id: mockVendorId,
        phase_ids: ['phase-1'],
        request_method: 'aurahom',
      }

      const result = await createBidRequest(input, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should return error if vendor_id is missing', async () => {
      const input: CreateBidRequestInput = {
        project_id: mockProjectId,
        vendor_id: '',
        phase_ids: ['phase-1'],
        request_method: 'aurahom',
      }

      const result = await createBidRequest(input, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Vendor ID is required')
    })

    it('should return error if phase_ids is empty', async () => {
      const input: CreateBidRequestInput = {
        project_id: mockProjectId,
        vendor_id: mockVendorId,
        phase_ids: [],
        request_method: 'aurahom',
      }

      const result = await createBidRequest(input, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('At least one phase ID is required')
    })

    it('should return error if request_method is missing', async () => {
      const input = {
        project_id: mockProjectId,
        vendor_id: mockVendorId,
        phase_ids: ['phase-1'],
        request_method: '',
      } as CreateBidRequestInput

      const result = await createBidRequest(input, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Request method is required')
    })

    it('should return error if request_method is invalid', async () => {
      const input = {
        project_id: mockProjectId,
        vendor_id: mockVendorId,
        phase_ids: ['phase-1'],
        request_method: 'invalid',
      } as CreateBidRequestInput

      const result = await createBidRequest(input, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid request method')
    })

    it('should handle database errors', async () => {
      const input: CreateBidRequestInput = {
        project_id: mockProjectId,
        vendor_id: mockVendorId,
        phase_ids: ['phase-1'],
        request_method: 'aurahom',
      }

      const queryBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Insert failed' },
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await createBidRequest(input, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
    })
  })

  describe('updateBidRequestStatus', () => {
    it('should update bid request status successfully', async () => {
      const queryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockBidRequest, status: 'bid_received' },
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await updateBidRequestStatus(mockRequestId, 'bid_received')

      expect(result.success).toBe(true)
      expect(result.bidRequest?.status).toBe('bid_received')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('bid_requests')
    })

    it('should return error if request ID is missing', async () => {
      const result = await updateBidRequestStatus('', 'pending')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid request ID is required')
    })

    it('should return error if status is invalid', async () => {
      const result = await updateBidRequestStatus(mockRequestId, 'invalid' as any)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid status')
    })

    it('should handle bid request not found', async () => {
      const queryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await updateBidRequestStatus(mockRequestId, 'pending')

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle database errors', async () => {
      const queryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Update failed' },
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await updateBidRequestStatus(mockRequestId, 'pending')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
    })
  })

  describe('getBidRequestsByProject', () => {
    it('should get bid requests for a project successfully', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockBidRequest], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await getBidRequestsByProject(mockProjectId)

      expect(result.success).toBe(true)
      expect(result.bidRequests).toBeDefined()
      expect(result.bidRequests?.length).toBe(1)
      expect(result.bidRequests?.[0].id).toBe(mockRequestId)
      expect(result.bidRequests?.[0].project_id).toBe(mockProjectId)
    })

    it('should return error if project ID is missing', async () => {
      const result = await getBidRequestsByProject('')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should handle empty results', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await getBidRequestsByProject(mockProjectId)

      expect(result.success).toBe(true)
      expect(result.bidRequests).toEqual([])
    })

    it('should handle database errors', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Query failed' },
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await getBidRequestsByProject(mockProjectId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Query failed')
    })
  })

  describe('getBidRequestsByVendor', () => {
    it('should get bid requests for a vendor successfully', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockBidRequest], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await getBidRequestsByVendor(mockVendorId)

      expect(result.success).toBe(true)
      expect(result.bidRequests).toBeDefined()
      expect(result.bidRequests?.length).toBe(1)
      expect(result.bidRequests?.[0].vendor_id).toBe(mockVendorId)
    })

    it('should return error if vendor ID is missing', async () => {
      const result = await getBidRequestsByVendor('')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Vendor ID is required')
    })

    it('should handle empty results', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await getBidRequestsByVendor(mockVendorId)

      expect(result.success).toBe(true)
      expect(result.bidRequests).toEqual([])
    })
  })

  describe('deleteBidRequest', () => {
    it('should delete a bid request successfully', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await deleteBidRequest(mockRequestId)

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('bid_requests')
    })

    it('should return error if request ID is missing', async () => {
      const result = await deleteBidRequest('')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid request ID is required')
    })

    it('should handle database errors', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const result = await deleteBidRequest(mockRequestId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
    })
  })

  describe('findExistingBidRequest', () => {
    it('should find an existing bid request by project and vendor', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: mockBidRequest, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const options: FindExistingBidRequestOptions = {
        projectId: mockProjectId,
        vendorId: mockVendorId,
      }

      const result = await findExistingBidRequest(options)

      expect(result.success).toBe(true)
      expect(result.bidRequest).toBeDefined()
      expect(result.bidRequest?.id).toBe(mockRequestId)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('bid_requests')
    })

    it('should return success with no bidRequest when no match found', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const options: FindExistingBidRequestOptions = {
        projectId: mockProjectId,
        vendorId: mockVendorId,
      }

      const result = await findExistingBidRequest(options)

      expect(result.success).toBe(true)
      expect(result.bidRequest).toBeUndefined()
    })

    it('should filter by phase_ids with overlap', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        overlaps: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: mockBidRequest, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const options: FindExistingBidRequestOptions = {
        projectId: mockProjectId,
        vendorId: mockVendorId,
        phaseIds: ['phase-1', 'phase-3'],
      }

      const result = await findExistingBidRequest(options)

      expect(result.success).toBe(true)
      expect(queryBuilder.overlaps).toHaveBeenCalledWith('phase_ids', ['phase-1', 'phase-3'])
    })

    it('should filter by scope title when provided', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: mockBidRequest, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const options: FindExistingBidRequestOptions = {
        projectId: mockProjectId,
        vendorId: mockVendorId,
        scopeTitle: 'Foundation work',
      }

      const result = await findExistingBidRequest(options)

      expect(result.success).toBe(true)
      // eq is called multiple times: for project_id, vendor_id, and scope_title
      expect(queryBuilder.eq).toHaveBeenCalledWith('scope_title', 'Foundation work')
    })

    it('should use custom statuses when provided', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: mockBidRequest, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const options: FindExistingBidRequestOptions = {
        projectId: mockProjectId,
        vendorId: mockVendorId,
        statuses: ['pending', 'bid_received'],
      }

      const result = await findExistingBidRequest(options)

      expect(result.success).toBe(true)
      expect(queryBuilder.in).toHaveBeenCalledWith('status', ['pending', 'bid_received'])
    })

    it('should return error if project ID is missing', async () => {
      const options: FindExistingBidRequestOptions = {
        projectId: '',
        vendorId: mockVendorId,
      }

      const result = await findExistingBidRequest(options)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should return error if vendor ID is missing', async () => {
      const options: FindExistingBidRequestOptions = {
        projectId: mockProjectId,
        vendorId: '',
      }

      const result = await findExistingBidRequest(options)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Vendor ID is required')
    })

    it('should handle database errors', async () => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Query failed' },
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryBuilder)

      const options: FindExistingBidRequestOptions = {
        projectId: mockProjectId,
        vendorId: mockVendorId,
      }

      const result = await findExistingBidRequest(options)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Query failed')
    })
  })
})

describe('Bid Submission Functions', () => {
  const mockUserId = 'test-user-id-123'
  const mockVendorId = 'test-vendor-id-456'
  const mockProjectId = 'test-project-id-789'
  const mockRequestId = 'bid-request-id-abc'
  const mockBidId = 'bid-id-xyz'

  const mockBid: any = {
    id: mockBidId,
    bid_request_id: mockRequestId,
    vendor_id: mockVendorId,
    project_id: mockProjectId,
    total_amount: 15000,
    materials_cost: 8000,
    labor_cost: 7000,
    status: 'submitted',
    submitted_at: '2024-01-20T00:00:00Z',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateServerSupabaseClientFn.mockResolvedValue(mockSupabaseClient)
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })
  })

  describe('submitBid', () => {
    beforeEach(() => {
      mockSendBidReceivedNotification.mockClear()
    })

    it('should submit a bid successfully', async () => {
      const input: CreateBidInput = {
        bid_request_id: mockRequestId,
        vendor_id: mockVendorId,
        project_id: mockProjectId,
        total_amount: 15000,
      }

      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockBid, error: null }),
      }
      const countChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ count: 1 }),
      }
      const updateRequestChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(insertChain)
        .mockReturnValueOnce(countChain)
        .mockReturnValueOnce(updateRequestChain)

      const result = await submitBid(input, mockUserId)

      expect(result.success).toBe(true)
      expect(result.bid).toBeDefined()
      expect(result.bid?.id).toBe(mockBidId)
      expect(result.bid?.total_amount).toBe(15000)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('bids')
    })

    it('succeeds when notification data is available (notification is best-effort)', async () => {
      const input: CreateBidInput = {
        bid_request_id: mockRequestId,
        vendor_id: mockVendorId,
        project_id: mockProjectId,
        total_amount: 15000,
      }
      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockBid, error: null }),
      }
      const countChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ count: 1 }),
      }
      const updateRequestChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      const brSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { user_id: mockUserId, scope_title: 'Rough-in plumbing' },
          error: null,
        }),
      }
      const vendorChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { name: 'ABC Plumbing' }, error: null }),
      }
      const userChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: mockUserId, email: 'gc@example.com', first_name: 'Jane', last_name: 'GC' },
          error: null,
        }),
      }
      const projectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { name: '123 Main St' }, error: null }),
      }

      let fromCallIndex = 0
      mockSupabaseClient.from.mockImplementation((table: string) => {
        fromCallIndex += 1
        if (table === 'bids') {
          if (fromCallIndex === 1) return insertChain
          if (fromCallIndex === 2) return countChain
        }
        if (table === 'bid_requests') {
          if (fromCallIndex === 3) return updateRequestChain
          if (fromCallIndex === 4) return brSelectChain
        }
        if (table === 'vendors' && fromCallIndex === 5) return vendorChain
        if (table === 'users' && fromCallIndex === 6) return userChain
        if (table === 'projects' && fromCallIndex === 7) return projectChain
        return {
          select: jest.fn().mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        }
      })

      const result = await submitBid(input, mockUserId)

      expect(result.success).toBe(true)
      expect(result.bid).toBeDefined()
      expect(result.bid?.id).toBe(mockBidId)
      // sendBidReceivedNotification is wired in submitBid; full notification behavior is covered in tests/email.test.ts
    })

    it('should return error if bid_request_id is missing', async () => {
      const input: CreateBidInput = {
        bid_request_id: '',
        vendor_id: mockVendorId,
        project_id: mockProjectId,
        total_amount: 10000,
      }
      const result = await submitBid(input, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid request ID is required')
    })

    it('should return error if vendor_id is missing', async () => {
      const input: CreateBidInput = {
        bid_request_id: mockRequestId,
        vendor_id: '',
        project_id: mockProjectId,
        total_amount: 10000,
      }
      const result = await submitBid(input, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Vendor ID is required')
    })

    it('should return error if project_id is missing', async () => {
      const input: CreateBidInput = {
        bid_request_id: mockRequestId,
        vendor_id: mockVendorId,
        project_id: '',
        total_amount: 10000,
      }
      const result = await submitBid(input, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should return error if total_amount is invalid', async () => {
      const input: CreateBidInput = {
        bid_request_id: mockRequestId,
        vendor_id: mockVendorId,
        project_id: mockProjectId,
        total_amount: -100,
      }
      const result = await submitBid(input, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Total amount')
    })

    it('should handle database errors on insert', async () => {
      const input: CreateBidInput = {
        bid_request_id: mockRequestId,
        vendor_id: mockVendorId,
        project_id: mockProjectId,
        total_amount: 10000,
      }
      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
      }
      mockSupabaseClient.from.mockReturnValueOnce(insertChain)

      const result = await submitBid(input, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
    })
  })

  describe('addBidItems', () => {
    it('should add bid items successfully', async () => {
      const items: CreateBidItemInput[] = [
        { description: 'Foundation work', phase_id: 'phase-1', total_cost: 5000 },
        { description: 'Framing', phase_id: 'phase-2', total_cost: 10000, budget_item_id: 'budget-item-1' },
      ]
      const inserted = [
        { id: 'item-1', bid_id: mockBidId, description: 'Foundation work', phase_id: 'phase-1', total_cost: 5000 },
        { id: 'item-2', bid_id: mockBidId, description: 'Framing', phase_id: 'phase-2', total_cost: 10000, budget_item_id: 'budget-item-1' },
      ]
      const chain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({ data: inserted, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await addBidItems(mockBidId, items)

      expect(result.success).toBe(true)
      expect(result.bidItems).toHaveLength(2)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('bid_items')
    })

    it('should return error if bid ID is missing', async () => {
      const result = await addBidItems('', [{ description: 'Work', phase_id: 'p1', total_cost: 1000 }])
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid ID is required')
    })

    it('should return error if items array is empty', async () => {
      const result = await addBidItems(mockBidId, [])
      expect(result.success).toBe(false)
      expect(result.error).toContain('At least one bid item')
    })

    it('should return error if item missing description', async () => {
      const result = await addBidItems(mockBidId, [{ description: '', phase_id: 'p1', total_cost: 1000 }])
      expect(result.success).toBe(false)
      expect(result.error).toContain('description')
    })

    it('should return error if item has invalid total_cost', async () => {
      const result = await addBidItems(mockBidId, [{ description: 'Work', phase_id: 'p1', total_cost: -1 }])
      expect(result.success).toBe(false)
      expect(result.error).toContain('total_cost')
    })
  })

  describe('updateBid', () => {
    it('should update a bid successfully', async () => {
      const updateData: UpdateBidInput = { total_amount: 18000, notes: 'Updated quote' }
      const chain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { ...mockBid, ...updateData }, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await updateBid(mockBidId, updateData)

      expect(result.success).toBe(true)
      expect(result.bid?.total_amount).toBe(18000)
      expect(result.bid?.notes).toBe('Updated quote')
    })

    it('should return error if bid ID is missing', async () => {
      const result = await updateBid('', { total_amount: 1000 })
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid ID is required')
    })

    it('should return error if no fields to update', async () => {
      const result = await updateBid(mockBidId, {})
      expect(result.success).toBe(false)
      expect(result.error).toContain('No fields to update')
    })

    it('should handle bid not found', async () => {
      const chain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)
      const result = await updateBid(mockBidId, { total_amount: 1000 })
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })

  describe('getBidsByProject', () => {
    it('should get bids for a project successfully', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockBid], error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBidsByProject(mockProjectId)

      expect(result.success).toBe(true)
      expect(result.bids).toHaveLength(1)
      expect(result.bids?.[0].project_id).toBe(mockProjectId)
    })

    it('should return error if project ID is missing', async () => {
      const result = await getBidsByProject('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should handle empty results', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)
      const result = await getBidsByProject(mockProjectId)
      expect(result.success).toBe(true)
      expect(result.bids).toEqual([])
    })
  })

  describe('getBidsByRequest', () => {
    it('should get bids for a bid request successfully', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockBid], error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBidsByRequest(mockRequestId)

      expect(result.success).toBe(true)
      expect(result.bids).toHaveLength(1)
      expect(result.bids?.[0].bid_request_id).toBe(mockRequestId)
    })

    it('should return error if bid request ID is missing', async () => {
      const result = await getBidsByRequest('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid request ID is required')
    })
  })

  describe('acceptBid', () => {
    it('should accept a bid and reject others for same request', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: mockBidId, bid_request_id: mockRequestId, project_id: mockProjectId, status: 'submitted' },
          error: null,
        }),
      }
      const updateBidChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      }
      const rejectOthersChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        neq: jest.fn().mockResolvedValue({ error: null }),
      }
      const getBidRequestChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      const getUpdatedBidChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { ...mockBid, status: 'accepted' }, error: null }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(updateBidChain)
        .mockReturnValueOnce(rejectOthersChain)
        .mockReturnValueOnce(getBidRequestChain)
        .mockReturnValueOnce(getUpdatedBidChain)

      const result = await acceptBid(mockBidId, mockUserId)

      expect(result.success).toBe(true)
      expect(result.bid?.status).toBe('accepted')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('bids')
    })

    it('should return error if bid ID is missing', async () => {
      const result = await acceptBid('', mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid ID is required')
    })

    it('should handle bid not found', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      }
      mockSupabaseClient.from.mockReturnValue(selectChain)
      const result = await acceptBid(mockBidId, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })

  describe('rejectBid', () => {
    it('should reject a bid successfully', async () => {
      const chain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockBid, status: 'rejected', rejection_reason: 'Too high' },
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await rejectBid(mockBidId, mockUserId, 'Too high')

      expect(result.success).toBe(true)
      expect(result.bid?.status).toBe('rejected')
      expect(result.bid?.rejection_reason).toBe('Too high')
    })

    it('should return error if bid ID is missing', async () => {
      const result = await rejectBid('', mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid ID is required')
    })
  })

  describe('compareBids', () => {
    it('should return bids sorted by total_amount with lowestBidId', async () => {
      const bids = [
        { ...mockBid, id: 'bid-1', total_amount: 20000 },
        { ...mockBid, id: 'bid-2', total_amount: 15000 },
      ]
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: bids, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await compareBids(mockRequestId)

      expect(result.success).toBe(true)
      expect(result.bidRequestId).toBe(mockRequestId)
      expect(result.bids).toHaveLength(2)
      expect(result.bids?.[0].total_amount).toBe(15000)
      expect(result.lowestBidId).toBe('bid-2')
    })

    it('should return error if bid request ID is missing', async () => {
      const result = await compareBids('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid request ID is required')
    })

    it('should handle empty bids list', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)
      const result = await compareBids(mockRequestId)
      expect(result.success).toBe(true)
      expect(result.bids).toEqual([])
      expect(result.lowestBidId).toBeNull()
    })
  })
})

describe('Utility Functions', () => {
  const mockUserId = 'test-user-id-123'
  const mockBidId1 = 'bid-1'
  const mockBidId2 = 'bid-2'

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateServerSupabaseClientFn.mockResolvedValue(mockSupabaseClient)
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })
  })

  describe('calculateBidComparison', () => {
    it('should return sorted bids with lowest/highest and average', () => {
      const bids = [
        { id: mockBidId1, total_amount: 20000 } as any,
        { id: mockBidId2, total_amount: 15000 } as any,
        { id: 'bid-3', total_amount: 18000 } as any,
      ]
      const result = calculateBidComparison(bids)
      expect(result.sorted).toHaveLength(3)
      expect(result.sorted[0].total_amount).toBe(15000)
      expect(result.sorted[2].total_amount).toBe(20000)
      expect(result.lowestBidId).toBe(mockBidId2)
      expect(result.highestBidId).toBe(mockBidId1)
      expect(result.averageAmount).toBe((15000 + 18000 + 20000) / 3)
      expect(result.count).toBe(3)
    })

    it('should handle empty array', () => {
      const result = calculateBidComparison([])
      expect(result.sorted).toEqual([])
      expect(result.lowestBidId).toBeNull()
      expect(result.highestBidId).toBeNull()
      expect(result.averageAmount).toBe(0)
      expect(result.count).toBe(0)
    })
  })

  describe('importVendorsFromCSV', () => {
    it('should return error if CSV data is empty', async () => {
      const result = await importVendorsFromCSV('', mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('CSV data is required')
    })

    it('should return error if CSV has no name column', async () => {
      const csv = 'foo,bar\nJohn,123'
      const result = await importVendorsFromCSV(csv, mockUserId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('name')
    })

    it('should import rows and call createVendor', async () => {
      const csv = 'name,email,phone\nVendor A,a@test.com,555-1111\nVendor B,b@test.com,555-2222'
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn()
          .mockResolvedValueOnce({ data: { id: 'v1', name: 'Vendor A' }, error: null })
          .mockResolvedValueOnce({ data: { id: 'v2', name: 'Vendor B' }, error: null }),
      }
      mockSupabaseClient.from
        .mockReturnValueOnce(queryBuilder)
        .mockReturnValueOnce(insertChain)
        .mockReturnValueOnce(queryBuilder)
        .mockReturnValueOnce(insertChain)

      const result = await importVendorsFromCSV(csv, mockUserId)
      expect(result.success).toBe(true)
      expect(result.imported).toBe(2)
    })
  })

  describe('exportVendorsToCSV', () => {
    it('should return error if user ID is missing', async () => {
      const result = await exportVendorsToCSV('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('User ID is required')
    })

    it('should return CSV with header and rows', async () => {
      // getVendorsByUser returns from user_vendors with vendor:vendors(*) – transformed to VendorWithUserData
      const mockUserVendorsRows = [
        {
          id: 'uv1',
          user_id: mockUserId,
          vendor_id: 'v1',
          vendor: { id: 'v1', name: 'Vendor A', email: 'a@test.com', company_name: null },
        },
      ]
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockUserVendorsRows, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await exportVendorsToCSV(mockUserId)
      expect(result.success).toBe(true)
      expect(result.csv).toBeDefined()
      expect(result.csv).toContain('name,company_name,email,phone')
      expect(result.csv).toContain('Vendor A')
      expect(result.csv).toContain('a@test.com')
    })
  })

  describe('generateBidRequestPDF', () => {
    const mockRequestId = 'bid-request-id-abc'

    it('should return error if bid request ID is missing', async () => {
      const result = await generateBidRequestPDF('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid request ID is required')
    })

    it('should return HTML when bid request and vendor exist', async () => {
      const br = {
        id: mockRequestId,
        project_id: 'proj-1',
        vendor_id: 'vendor-1',
        phase_ids: ['phase-1'],
        scope_title: 'Foundation work',
        scope_description: 'Excavation and pour',
        due_date: '2024-02-01',
      }
      const vendor = { name: 'ABC Plumbing', company_name: 'ABC', email: 'abc@test.com', phone: null, address: null, city: null, state: null, zip_code: null }
      const project = { name: '123 Main St' }
      mockSupabaseClient.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: br, error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: vendor, error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: project, error: null }),
        })

      const result = await generateBidRequestPDF(mockRequestId)
      expect(result.success).toBe(true)
      expect(result.html).toBeDefined()
      expect(result.html).toContain('Bid Request')
      expect(result.html).toContain('Foundation work')
      expect(result.html).toContain('ABC Plumbing')
      expect(result.html).toContain('123 Main St')
    })

    it('should return error when bid request not found', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      })
      const result = await generateBidRequestPDF(mockRequestId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })
})

describe('Budget Item Helper Functions', () => {
  const mockProjectId = 'test-project-id-789'
  const mockPhaseId = 'foundation'
  const mockBudgetItemId = 'budget-item-id-123'

  const mockBudgetItem: BudgetItem = {
    id: mockBudgetItemId,
    project_id: mockProjectId,
    phase_id: mockPhaseId,
    description: 'Concrete foundation',
    materials: 5000,
    labor: 3000,
    vendor: null,
    estimated_cost: 8000,
    actual_cost: null,
    sort_order: 1,
    is_custom: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
    })
  })

  describe('getBudgetItemsByProject', () => {
    it('should get all budget items for a project', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockBudgetItem], error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBudgetItemsByProject(mockProjectId)

      expect(result.success).toBe(true)
      expect(result.budgetItems).toBeDefined()
      expect(result.budgetItems?.length).toBe(1)
      expect(result.budgetItems?.[0].id).toBe(mockBudgetItemId)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('budget_items')
    })

    it('should return error if project ID is missing', async () => {
      const result = await getBudgetItemsByProject('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should handle empty results', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBudgetItemsByProject(mockProjectId)

      expect(result.success).toBe(true)
      expect(result.budgetItems).toEqual([])
    })

    it('should handle database errors', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBudgetItemsByProject(mockProjectId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Query failed')
    })
  })

  describe('getBudgetItemsByPhase', () => {
    it('should get budget items for a specific phase', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockBudgetItem], error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBudgetItemsByPhase(mockProjectId, mockPhaseId)

      expect(result.success).toBe(true)
      expect(result.budgetItems).toBeDefined()
      expect(result.budgetItems?.length).toBe(1)
      expect(result.budgetItems?.[0].phase_id).toBe(mockPhaseId)
    })

    it('should return error if project ID is missing', async () => {
      const result = await getBudgetItemsByPhase('', mockPhaseId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should return error if phase ID is missing', async () => {
      const result = await getBudgetItemsByPhase(mockProjectId, '')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Phase ID is required')
    })

    it('should handle empty results', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBudgetItemsByPhase(mockProjectId, mockPhaseId)

      expect(result.success).toBe(true)
      expect(result.budgetItems).toEqual([])
    })
  })

  describe('findBudgetItem', () => {
    it('should find a budget item by project and phase', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: mockBudgetItem, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await findBudgetItem(mockProjectId, mockPhaseId)

      expect(result.success).toBe(true)
      expect(result.budgetItem).toBeDefined()
      expect(result.budgetItem?.id).toBe(mockBudgetItemId)
    })

    it('should find budget item with description filter', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        ilike: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: mockBudgetItem, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await findBudgetItem(mockProjectId, mockPhaseId, 'Concrete')

      expect(result.success).toBe(true)
      expect(chain.ilike).toHaveBeenCalledWith('description', '%Concrete%')
    })

    it('should return success with no budgetItem when not found', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await findBudgetItem(mockProjectId, mockPhaseId)

      expect(result.success).toBe(true)
      // When maybeSingle returns null, budgetItem will be null (cast as undefined in type)
      expect(result.budgetItem).toBeFalsy()
    })

    it('should return error if project ID is missing', async () => {
      const result = await findBudgetItem('', mockPhaseId)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })

    it('should return error if phase ID is missing', async () => {
      const result = await findBudgetItem(mockProjectId, '')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Phase ID is required')
    })

    it('should handle database errors', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } }),
      }
      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await findBudgetItem(mockProjectId, mockPhaseId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Query failed')
    })
  })
})

describe('Accept Bid & Budget Integration Functions', () => {
  const mockUserId = 'test-user-id-123'
  const mockVendorId = 'test-vendor-id-456'
  const mockProjectId = 'test-project-id-789'
  const mockRequestId = 'bid-request-id-abc'
  const mockBidId = 'bid-id-xyz'
  const mockBudgetItemId = 'budget-item-id-123'

  const mockBid: any = {
    id: mockBidId,
    bid_request_id: mockRequestId,
    vendor_id: mockVendorId,
    project_id: mockProjectId,
    total_amount: 15000,
    materials_cost: 8000,
    labor_cost: 7000,
    status: 'accepted',
    reviewed_at: '2024-01-20T00:00:00Z',
    reviewed_by: mockUserId,
  }

  const mockBidItem: any = {
    id: 'bid-item-1',
    bid_id: mockBidId,
    budget_item_id: mockBudgetItemId,
    description: 'Foundation work',
    phase_id: 'foundation',
    materials_cost: 5000,
    labor_cost: 3000,
    total_cost: 8000,
  }

  const mockBudgetItem: BudgetItem = {
    id: mockBudgetItemId,
    project_id: mockProjectId,
    phase_id: 'foundation',
    description: 'Foundation',
    materials: 0,
    labor: 0,
    estimated_cost: 10000,
    actual_cost: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      single: jest.fn(),
    })
  })

  describe('pushBidItemsToBudget', () => {
    it('should update budget items from bid items', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [mockBidItem], error: null }),
      }
      const updateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(selectChain) // bid_items select
        .mockReturnValueOnce(updateChain) // budget_items update

      const result = await pushBidItemsToBudget(mockBidId, 'ABC Plumbing')

      expect(result.success).toBe(true)
      expect(result.updatedCount).toBe(1)
      expect(result.skippedCount).toBe(0)
    })

    it('should skip bid items without budget_item_id', async () => {
      const bidItemWithoutBudgetId = { ...mockBidItem, budget_item_id: null }
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [bidItemWithoutBudgetId], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(selectChain)

      const result = await pushBidItemsToBudget(mockBidId)

      expect(result.success).toBe(true)
      expect(result.updatedCount).toBe(0)
      expect(result.skippedCount).toBe(1)
    })

    it('should return success with zero counts when no bid items', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(selectChain)

      const result = await pushBidItemsToBudget(mockBidId)

      expect(result.success).toBe(true)
      expect(result.updatedCount).toBe(0)
      expect(result.skippedCount).toBe(0)
    })

    it('should return error if bid ID is missing', async () => {
      const result = await pushBidItemsToBudget('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid ID is required')
    })

    it('should handle database fetch errors', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Fetch failed' } }),
      }

      mockSupabaseClient.from.mockReturnValue(selectChain)

      const result = await pushBidItemsToBudget(mockBidId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Fetch failed')
    })
  })

  describe('getAcceptedBidForRequest', () => {
    it('should get the accepted bid for a request', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: mockBid, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getAcceptedBidForRequest(mockRequestId)

      expect(result.success).toBe(true)
      expect(result.bid).toBeDefined()
      expect(result.bid?.status).toBe('accepted')
    })

    it('should return success with no bid when none accepted', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getAcceptedBidForRequest(mockRequestId)

      expect(result.success).toBe(true)
      expect(result.bid).toBeFalsy()
    })

    it('should return error if bid request ID is missing', async () => {
      const result = await getAcceptedBidForRequest('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid request ID is required')
    })

    it('should handle database errors', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } }),
      }

      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getAcceptedBidForRequest(mockRequestId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Query failed')
    })
  })

  describe('getAcceptedBidsByProject', () => {
    it('should get all accepted bids for a project', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [mockBid], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getAcceptedBidsByProject(mockProjectId)

      expect(result.success).toBe(true)
      expect(result.bids).toBeDefined()
      expect(result.bids?.length).toBe(1)
      expect(result.bids?.[0].status).toBe('accepted')
    })

    it('should return empty array when no accepted bids', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getAcceptedBidsByProject(mockProjectId)

      expect(result.success).toBe(true)
      expect(result.bids).toEqual([])
    })

    it('should return error if project ID is missing', async () => {
      const result = await getAcceptedBidsByProject('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Project ID is required')
    })
  })

  describe('getBidItemsWithBudgetLinks', () => {
    it('should get bid items with their linked budget items', async () => {
      const bidItemWithBudget = {
        ...mockBidItem,
        budget_item: mockBudgetItem,
      }
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [bidItemWithBudget], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBidItemsWithBudgetLinks(mockBidId)

      expect(result.success).toBe(true)
      expect(result.items).toBeDefined()
      expect(result.items?.length).toBe(1)
      expect(result.items?.[0].budget_item).toBeDefined()
      expect(result.items?.[0].budget_item?.id).toBe(mockBudgetItemId)
    })

    it('should return items without budget_item when not linked', async () => {
      const bidItemWithoutBudget = {
        ...mockBidItem,
        budget_item_id: null,
        budget_item: null,
      }
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [bidItemWithoutBudget], error: null }),
      }

      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBidItemsWithBudgetLinks(mockBidId)

      expect(result.success).toBe(true)
      expect(result.items).toBeDefined()
      expect(result.items?.[0].budget_item).toBeFalsy()
    })

    it('should return error if bid ID is missing', async () => {
      const result = await getBidItemsWithBudgetLinks('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Bid ID is required')
    })

    it('should handle database errors', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } }),
      }

      mockSupabaseClient.from.mockReturnValue(chain)

      const result = await getBidItemsWithBudgetLinks(mockBidId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Query failed')
    })
  })
})
