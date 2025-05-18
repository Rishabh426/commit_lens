"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Code, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSavedCodes, clearSavedCode } from "@/lib/code-executor"
import type { SavedCode } from "@/types/code"

export default function SavedCodePage() {
  const router = useRouter()
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const codes = getSavedCodes()
      setSavedCodes(codes)
    } catch (error) {
      console.error("Error loading saved codes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDelete = (id: string) => {
    clearSavedCode(id)
    setSavedCodes(getSavedCodes())
  }

  const handleLoad = (code: SavedCode) => {
    localStorage.setItem("lastCode", code.code)
    localStorage.setItem("lastLanguage", code.language)
    localStorage.setItem("lastTitle", code.title)
    router.push("/landing/codeeditor")
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <header className="h-16 border-b border-gray-700 flex items-center justify-between px-6 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/landing/codeeditor"
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Editor</span>
          </Link>
          <div className="font-bold text-xl ml-4">
            <span className="text-white">Commit</span>
            <span className="text-blue-400">Lens</span>
            <span className="ml-2 text-sm font-normal text-gray-400">Saved Code</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Saved Code Snippets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                <span>Loading saved code snippets...</span>
              </div>
            ) : savedCodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Code className="h-16 w-16 mb-4" />
                <p className="text-xl font-medium mb-2">No saved code snippets</p>
                <p>Your saved code snippets will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCodes.map((savedCode) => (
                  <Card key={savedCode.id} className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-white">{savedCode.title}</CardTitle>
                        <div className="text-sm text-gray-300">
                          {savedCode.language.charAt(0).toUpperCase() + savedCode.language.slice(1)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{formatDate(savedCode.timestamp)}</p>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <pre className="bg-gray-800 p-3 rounded-lg overflow-hidden text-gray-300 font-mono text-xs max-h-[150px]">
                        {savedCode.code.length > 200 ? savedCode.code.substring(0, 200) + "..." : savedCode.code}
                      </pre>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-800 hover:bg-gray-700 border-gray-600 text-white"
                        onClick={() => handleDelete(savedCode.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                        onClick={() => handleLoad(savedCode)}
                      >
                        Load
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
