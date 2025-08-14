import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-cyan-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
                Build Your Dream Home with <span className="text-cyan-800">Ease</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Empowering individuals and small-scale builders with the tools they need to create their perfect home.
                From planning to completion, we're with you every step of the way.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 text-lg font-medium transition-all hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white px-8 py-4 text-lg font-medium bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-serif font-bold text-cyan-800">10K+</div>
                <div className="text-sm text-slate-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-serif font-bold text-cyan-800">500+</div>
                <div className="text-sm text-slate-600">Builders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-serif font-bold text-cyan-800">4.9★</div>
                <div className="text-sm text-slate-600">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/residentia_home_construction.jpg"
                alt="Residential home construction with wooden framing and blue sky"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-800/20 to-transparent"></div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Project On Track</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
              <div className="text-sm text-slate-600">Next milestone</div>
              <div className="font-semibold text-gray-900">Foundation Complete</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
