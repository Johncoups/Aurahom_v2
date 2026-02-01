/**
 * Email (bid received notification) tests.
 * Tests lib/email.ts: generateBidReceivedNotificationContent, sendBidReceivedNotification.
 */

import { describe, it, expect, beforeEach, beforeAll, jest } from '@jest/globals'

// So sendEmail() in lib/email runs: Resend is mocked and env has a key
beforeAll(() => {
  process.env.RESEND_API_KEY = 'test-resend-key'
})
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ data: { id: 'msg-123' }, error: null }),
    },
  })),
}))

// Mock supabase for recordInDatabase path
const mockFromInsert = jest.fn()
const mockFrom = jest.fn(() => ({ insert: mockFromInsert }))
jest.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: jest.fn(() =>
    Promise.resolve({
      from: mockFrom,
    })
  ),
}))

import {
  generateBidReceivedNotificationContent,
  sendBidReceivedNotification,
  type BidReceivedNotificationBid,
  type BidReceivedNotificationUser,
  type BidReceivedNotificationContext,
} from '@/lib/email'

describe('Bid Received Notification', () => {
  const mockBid: BidReceivedNotificationBid = {
    id: 'bid-1',
    bid_request_id: 'req-1',
    project_id: 'proj-1',
    vendor_id: 'vendor-1',
    total_amount: 15000,
    notes: 'Can start next week.',
    submitted_at: '2024-01-20T12:00:00Z',
  }

  const mockUser: BidReceivedNotificationUser = {
    id: 'user-1',
    email: 'gc@example.com',
    full_name: 'Jane GC',
  }

  const mockContext: BidReceivedNotificationContext = {
    vendorName: 'ABC Plumbing',
    projectName: '123 Main St',
    scopeTitle: 'Rough-in plumbing',
    viewBidUrl: 'https://app.aurahom.com/dashboard?tab=bids',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockFromInsert.mockResolvedValue({ error: null })
  })

  describe('generateBidReceivedNotificationContent', () => {
    it('should generate subject with vendor name, amount, and scope', () => {
      const { subject } = generateBidReceivedNotificationContent(mockBid, mockContext)
      expect(subject).toContain('ABC Plumbing')
      expect(subject).toContain('$15,000.00')
      expect(subject).toContain('Rough-in plumbing')
    })

    it('should use project name when scope title is missing', () => {
      const ctx: BidReceivedNotificationContext = {
        vendorName: 'XYZ Electric',
        projectName: 'My House',
      }
      const { subject } = generateBidReceivedNotificationContent(mockBid, ctx)
      expect(subject).toContain('XYZ Electric')
      expect(subject).toContain('My House')
    })

    it('should format amount as USD currency', () => {
      const { subject, html } = generateBidReceivedNotificationContent(
        { ...mockBid, total_amount: 25000.5 },
        mockContext
      )
      expect(subject).toMatch(/\$25,000\.50|\$25,000/)
      expect(html).toContain('ABC Plumbing')
      expect(html).toContain('25,000.50')
    })

    it('should include vendor notes in HTML when present', () => {
      const { html } = generateBidReceivedNotificationContent(mockBid, mockContext)
      expect(html).toContain('Vendor notes')
      expect(html).toContain('Can start next week')
    })

    it('should not include notes block when notes are empty', () => {
      const { html } = generateBidReceivedNotificationContent(
        { ...mockBid, notes: null },
        mockContext
      )
      expect(html).not.toContain('Vendor notes')
    })

    it('should include view bid link when viewBidUrl is provided', () => {
      const { html } = generateBidReceivedNotificationContent(mockBid, mockContext)
      expect(html).toContain('View bid in Aurahom')
      expect(html).toContain(mockContext.viewBidUrl!)
    })

    it('should escape HTML in vendor name and scope', () => {
      const ctx: BidReceivedNotificationContext = {
        vendorName: 'Vendor <script>alert(1)</script>',
        scopeTitle: 'Scope "with quotes"',
      }
      const { html } = generateBidReceivedNotificationContent(mockBid, ctx)
      expect(html).not.toContain('<script>')
      expect(html).toContain('&lt;script&gt;')
      expect(html).toContain('&quot;with quotes&quot;')
    })

    it('should produce plain text version', () => {
      const { text } = generateBidReceivedNotificationContent(mockBid, mockContext)
      expect(text).toContain('ABC Plumbing')
      expect(text).toContain('15,000')
      expect(text).toContain('Rough-in plumbing')
      expect(text).toContain('Can start next week')
    })
  })

  describe('sendBidReceivedNotification', () => {
    it('should send email to user and return success', async () => {
      const result = await sendBidReceivedNotification(mockBid, mockUser, mockContext)

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('msg-123')
    })

    it('should return error when user email is missing', async () => {
      const result = await sendBidReceivedNotification(
        mockBid,
        { ...mockUser, email: '' },
        mockContext
      )
      expect(result.success).toBe(false)
      expect(result.error).toContain('User email is required')
    })

    it('should return error when RESEND_API_KEY is unset', async () => {
      const orig = process.env.RESEND_API_KEY
      delete process.env.RESEND_API_KEY
      const result = await sendBidReceivedNotification(mockBid, mockUser, mockContext)
      process.env.RESEND_API_KEY = orig
      expect(result.success).toBe(false)
      expect(result.error).toContain('RESEND_API_KEY')
    })

    it('should record email in database when recordInDatabase is true (default)', async () => {
      await sendBidReceivedNotification(mockBid, mockUser, mockContext)

      expect(mockFromInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          bid_request_id: 'req-1',
          project_id: 'proj-1',
          user_id: 'user-1',
          vendor_id: 'vendor-1',
          email_type: 'bid_received_notification',
          to_email: 'gc@example.com',
          send_method: 'aurahom',
          status: 'sent',
        })
      )
    })

    it('should skip database record when recordInDatabase is false', async () => {
      const result = await sendBidReceivedNotification(mockBid, mockUser, mockContext, {
        recordInDatabase: false,
      })

      expect(result.success).toBe(true)
      expect(mockFromInsert).not.toHaveBeenCalled()
    })
  })
})
