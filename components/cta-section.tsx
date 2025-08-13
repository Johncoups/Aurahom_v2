import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-cyan-800 to-cyan-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-white">Ready to Start Building?</h2>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Join thousands of builders and homeowners who trust Aurahom to bring their vision to life. Start your
              journey today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 text-lg font-medium transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-cyan-800 px-8 py-4 text-lg font-medium bg-transparent"
            >
              <Download className="mr-2 h-5 w-5" />
              Download App
            </Button>
          </div>

          <div className="pt-8 border-t border-cyan-700">
            <p className="text-cyan-200 text-sm">No credit card required • Free 30-day trial • Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}
