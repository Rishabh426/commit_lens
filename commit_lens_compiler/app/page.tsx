import Hero from "@/components/hero"
import Features from "@/components/features"
import Documentation from "@/components/documentation"
import CodeExamples from "@/components/code_example"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mb-12">
        <nav className="shadow-xl h-16 bg-white">
          <div className="flex justify-between items-center h-full px-6 max-w-7xl mx-auto">
            <div className="flex items-center">
              <div className="font-bold text-2xl">
                <span className="text-black">Commit</span>
                <span className="text-blue-700">Lens</span>
              </div>
              <div className="hidden md:flex space-x-6 ml-10">
                <a href="#features" className="text-gray-700 hover:text-blue-700">
                  Features
                </a>
                <a href="#languages" className="text-gray-700 hover:text-blue-700">
                  Languages
                </a>
                <a href="#docs" className="text-gray-700 hover:text-blue-700">
                  Docs
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100" title="Toggle theme"></button>
              <button className="px-4 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800 transition">
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </div>

      <Hero />
      <Features />
      <Documentation />
      <CodeExamples />
      <Footer />
    </main>
  )
}
