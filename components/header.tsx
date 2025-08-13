"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-serif font-bold text-cyan-800">Aurahom</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-cyan-800 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-cyan-800 transition-colors">
              Testimonials
            </a>
            <a href="#about" className="text-slate-600 hover:text-cyan-800 transition-colors">
              About
            </a>
            <Button
              variant="outline"
              className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white bg-transparent"
            >
              Sign In
            </Button>
            <Button className="bg-violet-500 hover:bg-violet-600 text-white">Get Started</Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
              <a href="#features" className="block px-3 py-2 text-slate-600 hover:text-cyan-800">
                Features
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-slate-600 hover:text-cyan-800">
                Testimonials
              </a>
              <a href="#about" className="block px-3 py-2 text-slate-600 hover:text-cyan-800">
                About
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Button
                  variant="outline"
                  className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white bg-transparent"
                >
                  Sign In
                </Button>
                <Button className="bg-violet-500 hover:bg-violet-600 text-white">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
