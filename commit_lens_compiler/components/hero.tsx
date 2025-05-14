"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeroProps {
  onOpenEditor: () => void
}

export default function Hero({ onOpenEditor }: HeroProps) {
  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">Code. Compile. Create.</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-[600px]">
              CommitLens is a powerful online compiler that supports JavaScript, C++, and C. Write, compile, and run
              your code in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 text-lg" onClick={onOpenEditor}>
                Try it now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="px-8 py-6 text-lg">
                View Documentation
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
            {/* <Image
              src="/placeholder.svg?height=500&width=600"
              alt="CommitLens IDE interface"
              fill
              className="object-cover"
              priority
            /> */}
          </div>
        </div>
      </div>
    </section>
  )
}
