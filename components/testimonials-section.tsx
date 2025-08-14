"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useState } from "react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "First-time Home Builder",
    content:
      "Aurahom made building our dream home so much less overwhelming. The step-by-step guidance and community support were invaluable.",
    rating: 5,
    image: "/professional-woman-smiling.png",
  },
  {
    name: "Mike Rodriguez",
    role: "Small-scale Builder",
    content:
      "As a contractor, Aurahom helps me keep all my projects organized and my clients informed. It's become an essential part of my business.",
    rating: 5,
    image: "/construction-worker-hard-hat.png",
  },
  {
    name: "Emily Chen",
    role: "Homeowner",
    content:
      "The mobile app was perfect for staying updated on our build progress while we were still living in our old home. Highly recommend!",
    rating: 5,
    image: "/placeholder-ktasq.png",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900">Be Among the First</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join our growing community of home builders and be part of something special from the beginning.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-2xl text-gray-900 leading-relaxed font-medium">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentIndex].image || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{testimonials[currentIndex].name}</div>
                    <div className="text-slate-600">{testimonials[currentIndex].role}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-cyan-800" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
