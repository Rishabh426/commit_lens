import type React from "react"
import { Code, Search, Play, Moon, Zap, Shield } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Powerful Features for Developers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            CommitLens provides everything you need to write, analyze, and execute code efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Code className="h-8 w-8 text-blue-700" />}
            title="Multi-language Support"
            description="Write and analyze code in JavaScript, TypeScript, C++, and C with syntax highlighting and intelligent features."
          />
          <FeatureCard
            icon={<Search className="h-8 w-8 text-blue-700" />}
            title="Syntax Analysis"
            description="Detect syntax errors, typos, and potential bugs before running your code with our advanced analyzer."
          />
          <FeatureCard
            icon={<Play className="h-8 w-8 text-blue-700" />}
            title="Code Execution"
            description="Execute your code directly in the browser and see the output instantly without any setup."
          />
          <FeatureCard
            icon={<Moon className="h-8 w-8 text-blue-700" />}
            title="Dark Mode"
            description="Reduce eye strain with our fully-featured dark mode that works across the entire application."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-blue-700" />}
            title="Fast Performance"
            description="Experience lightning-fast code analysis and execution with our optimized engine."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-blue-700" />}
            title="Type Safety"
            description="Built with TypeScript for enhanced code quality and developer experience."
          />
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
