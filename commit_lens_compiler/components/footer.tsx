import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-bold text-2xl mb-4">
              <span className="text-white">Commit</span>
              <span className="text-blue-400">Lens</span>
            </div>
            <p className="text-gray-400 mb-4">
              A powerful online compiler and code analyzer that supports JavaScript, TypeScript, C++, and C.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com/Rishabh426/commit_lens" className="text-gray-400 hover:text-white transition">
                <Github className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#languages" className="text-gray-400 hover:text-white transition">
                  Languages
                </Link>
              </li>
              <li>
                <Link href="#docs" className="text-gray-400 hover:text-white transition">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://github.com/Rishabh426/commit_lens" className="text-gray-400 hover:text-white transition">
                  GitHub Repository
                </Link>
              </li>
              <li>
                <Link href="https://nextjs.org" className="text-gray-400 hover:text-white transition">
                  Built with Next.js
                </Link>
              </li>
              <li>
                <Link href="https://www.typescriptlang.org" className="text-gray-400 hover:text-white transition">
                  TypeScript
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CommitLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
