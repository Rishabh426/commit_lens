"use client"

import { useRouter } from "next/navigation"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Documentation from "@/components/documentation"
import CodeExamples from "@/components/code_example"
import Footer from "@/components/footer"
// import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const router = useRouter()

  const navigateToCodeEditor = () => {
    router.push("/landing/codeeditor")
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mb-12">
        <nav className="shadow-xl h-16 bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center h-full px-6 max-w-7xl mx-auto">
            <div className="flex items-center">
              <div className="font-bold text-2xl">
                <span className="text-black dark:text-white">Commit</span>
                <span className="text-blue-700">Lens</span>
              </div>
              <div className="hidden md:flex space-x-6 ml-10">
                <a
                  href="#features"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  Features
                </a>
                <a
                  href="#languages"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  Languages
                </a>
                <a
                  href="#docs"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  Docs
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <ThemeToggle /> */}
              <button
                className="px-4 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800 transition"
                onClick={navigateToCodeEditor}
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </div>

      <Hero onOpenEditor={navigateToCodeEditor} />
      <Features />
      <Documentation />
      <CodeExamples />
      <Footer />
    </main>
  )
}
