"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, FileText, Shield, CheckCircle } from "lucide-react"

interface TermsOfServiceProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-cyan-800" />
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Legal Information
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'terms'
                ? 'text-cyan-800 border-b-2 border-cyan-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'text-cyan-800 border-b-2 border-cyan-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'terms' ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Terms of Service
                </h3>
                <p className="text-slate-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h4>
                  <p>
                    By accessing and using Aurahom, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">2. Description of Service</h4>
                  <p>
                    Aurahom provides home building project management tools, including planning, budgeting, and progress tracking features for individuals and small-scale builders.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">3. User Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account</li>
                    <li>Use the service in compliance with applicable laws</li>
                    <li>Not misuse or attempt to gain unauthorized access</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">4. Intellectual Property</h4>
                  <p>
                    All content, features, and functionality of Aurahom are owned by us and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">5. Limitation of Liability</h4>
                  <p>
                    Aurahom is provided "as is" without warranties of any kind. We shall not be liable for any damages arising from the use of our service.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">6. Changes to Terms</h4>
                  <p>
                    We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.
                  </p>
                </section>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Privacy Policy
                </h3>
                <p className="text-slate-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h4>
                  <p>
                    We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">2. How We Use Your Information</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide and maintain our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Improve our services and develop new features</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">3. Information Sharing</h4>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">4. Data Security</h4>
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">5. Your Rights</h4>
                  <p>
                    You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">6. Contact Us</h4>
                  <p>
                    If you have questions about this Privacy Policy, please contact us at privacy@aurahom.com
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>By using Aurahom, you agree to these terms</span>
          </div>
          <Button
            onClick={onClose}
            className="bg-violet-500 hover:bg-violet-600 text-white"
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  )
}
