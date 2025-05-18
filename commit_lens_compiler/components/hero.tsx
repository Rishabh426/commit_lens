"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  onOpenEditor: () => void
}

export default function Hero({ onOpenEditor }: HeroProps) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
          Write, Analyze, and Execute Code <span className="text-blue-700">Online</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl">
          CommitLens is a powerful online compiler and code analyzer that supports multiple programming languages. Write
          code, check for errors, and execute it all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white px-8" onClick={onOpenEditor}>
            Try it now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-700 text-blue-700 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-gray-800"
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          >
            Learn more
          </Button>
        </div>
      </div>
    </section>
  )
}
