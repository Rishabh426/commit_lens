import type React from "react"
import { Code, Zap, Globe, Lock, Clock, Server } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-[800px] mx-auto">
            Everything you need to write, compile, and run code in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Code className="h-10 w-10 text-blue-700" />}
            title="Multi-language Support"
            description="Write code in JavaScript, C++, C, and more languages coming soon."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-blue-700" />}
            title="Instant Compilation"
            description="Compile and run your code in milliseconds with our optimized infrastructure."
          />
          <FeatureCard
            icon={<Lock className="h-10 w-10 text-blue-700" />}
            title="Secure Environment"
            description="Your code is executed in isolated, secure containers for maximum safety."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
