"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, signOutUser } = useAuth()
  const router = useRouter()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <svg 
                className="h-8 w-8 fill-cyan-800" 
                viewBox="0 0 277 265" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(0.000000,265.000000) scale(0.100000,-0.100000)">
                  <path d="M1345 2320 c-11 -4 -66 -53 -123 -109 l-102 -102 47 -20 c89 -38 168 -102 340 -272 l173 -172 60 63 c36 38 63 77 70 100 15 55 12 139 -6 175 -23 45 -281 305 -326 328 -38 20 -98 24 -133 9z"/>
                  <path d="M640 1915 c0 -87 4 -155 9 -155 11 0 291 291 291 302 0 5 -67 8 -150 8 l-150 0 0 -155z"/>
                  <path d="M1860 2065 c0 -4 7 -20 16 -36 25 -50 35 -137 23 -204 -14 -78 -27 -102 -101 -180 l-61 -66 114 -115 c62 -63 117 -114 121 -114 14 0 94 116 126 183 50 104 62 171 62 365 l0 172 -150 0 c-82 0 -150 -2 -150 -5z"/>
                  <path d="M736 1723 c-173 -175 -325 -331 -337 -347 -30 -38 -37 -121 -15 -165 9 -17 60 -76 113 -131 l96 -100 43 87 c53 110 128 193 472 529 l253 247 -33 34 c-38 40 -151 117 -199 137 -81 33 -52 54 -393 -291z"/>
                  <path d="M1171 1544 l-242 -237 3 -277 3 -277 43 -86 c46 -93 109 -167 277 -328 l94 -89 59 0 c70 0 97 17 210 133 l74 74 -65 31 c-100 46 -173 101 -272 201 l-89 91 -84 0 c-130 0 -122 -16 -122 238 l0 218 158 156 c86 85 167 161 180 167 21 11 30 6 107 -67 46 -43 124 -120 172 -171 75 -79 89 -99 93 -134 l5 -41 68 68 c38 38 67 70 65 71 -56 58 -401 405 -440 443 l-55 53 -242 -237z"/>
                  <path d="M2191 1526 c-41 -101 -102 -179 -262 -342 l-159 -160 0 -106 c0 -77 -4 -109 -14 -117 -8 -7 -81 -13 -187 -17 -95 -3 -175 -6 -177 -8 -1 -2 33 -37 77 -78 77 -72 172 -132 255 -158 l39 -12 318 318 c203 203 327 334 339 360 24 48 26 104 5 148 -8 17 -59 75 -113 129 l-98 98 -23 -55z"/>
                  <path d="M1272 1327 l-132 -132 0 -163 0 -162 69 0 69 0 4 126 c3 105 7 128 21 139 21 15 174 20 210 6 l27 -11 0 -130 0 -130 77 0 76 0 -7 168 -7 167 -127 128 c-70 70 -131 127 -137 127 -6 0 -70 -60 -143 -133z"/>
                  <path d="M794 1158 c-60 -79 -80 -115 -108 -198 -28 -83 -46 -233 -46 -376 l0 -94 170 0 c94 0 170 4 170 9 0 5 -7 14 -16 22 -17 14 -78 129 -101 194 -11 29 -17 103 -22 268 l-6 227 -41 -52z"/>
                  <path d="M1370 970 l0 -100 45 0 45 0 0 100 0 100 -45 0 -45 0 0 -100z"/>
                  <path d="M2007 650 c-76 -77 -135 -144 -132 -150 4 -6 63 -10 146 -10 l139 0 0 150 c0 83 -3 150 -7 150 -5 0 -70 -63 -146 -140z"/>
                </g>
              </svg>
              <h1 className="text-2xl font-serif font-bold text-cyan-800">Aurahom</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-cyan-800 transition-colors px-3 py-2 rounded-md">
              Features
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-cyan-800 transition-colors px-3 py-2 rounded-md">
              Testimonials
            </a>
            <a href="#about" className="text-slate-600 hover:text-cyan-800 transition-colors px-3 py-2 rounded-md">
              About
            </a>
            {isAuthenticated ? (
              <>
                <span className="text-slate-700 hidden lg:inline" aria-live="polite">{user?.email}</span>
                <Button
                  onClick={async () => {
                    await signOutUser()
                    router.push("/login")
                  }}
                  variant="outline"
                  className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white bg-transparent"
                  aria-label="Sign out"
                >
                  Sign Out
                </Button>
                <Button asChild className="bg-violet-500 hover:bg-violet-600 text-white">
                  <a href="/dashboard" aria-label="Go to dashboard">Dashboard</a>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white bg-transparent"
                >
                  <a href="/login" aria-label="Sign in">Sign In</a>
                </Button>
                <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
                  <a href="/register" aria-label="Create an account">Get Started</a>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
              <a href="#features" className="block px-4 py-3 text-slate-600 hover:text-cyan-800 rounded-md">
                Features
              </a>
              <a href="#testimonials" className="block px-4 py-3 text-slate-600 hover:text-cyan-800 rounded-md">
                Testimonials
              </a>
              <a href="#about" className="block px-4 py-3 text-slate-600 hover:text-cyan-800 rounded-md">
                About
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                {isAuthenticated ? (
                  <Button
                    onClick={async () => {
                      await signOutUser()
                      setIsMenuOpen(false)
                      router.push("/login")
                    }}
                    variant="outline"
                    className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white bg-transparent"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white bg-transparent"
                    >
                      <a href="/login">Sign In</a>
                    </Button>
                    <Button asChild className="bg-violet-500 hover:bg-violet-600 text-white">
                      <a href="/register">Get Started</a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
