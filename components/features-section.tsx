import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, Lightbulb, Calendar, Shield, Smartphone } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "Simple Project Management",
    description:
      "Stay organized and on track with our intuitive dashboard that breaks down complex builds into manageable tasks.",
  },
  {
    icon: Lightbulb,
    title: "Expert Guidance",
    description:
      "Access resources and tips from industry professionals to make informed decisions throughout your build.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a network of builders and homeowners for shared experiences, advice, and encouragement.",
  },
  {
    icon: Calendar,
    title: "Timeline Tracking",
    description: "Keep your project on schedule with milestone tracking and automated progress updates.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Built-in checklists and quality control measures ensure your build meets the highest standards.",
  },
  {
    icon: Smartphone,
    title: "Mobile & Web Access",
    description: "Manage your project from anywhere with our responsive web app and dedicated mobile application.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900">Everything You Need to Build</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From initial planning to final walkthrough, Aurahom provides comprehensive tools and support for every stage
            of your home building journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-cyan-800" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
