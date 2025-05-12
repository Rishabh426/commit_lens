"use client"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

export default function Hero() {
    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false)

    const openEditor = () => setIsEditorOpen(true)
    const closeEditor = () => setIsEditorOpen(false)
  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">Code. Compile. Create.</h1>
            <p className="text-xl text-gray-600 max-w-[600px]">
              CommitLens is a powerful online compiler that supports JavaScript, C++, and C. Write, compile, and run
              your code in seconds.
            </p>
            <div className="flex justify-center">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 text-lg">
                    Try it now
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
            <Image
                src="/assets/image.svg"
                alt="Commit Lens Visual"
                width={800}
                height={400}
                className="rounded-xl"
            />
          </div>
        </div>
      </div> 
    </section>
  )
}
