"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { CodeOutput } from "@/types/code"

export default function CodeOutputPage() {
  const router = useRouter()
  const [output, setOutput] = useState<CodeOutput | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedOutput = sessionStorage.getItem("codeOutput")
    if (storedOutput) {
      try {
        const parsedOutput = JSON.parse(storedOutput)
        setOutput(parsedOutput)
      } catch (error) {
        console.error("Error parsing output result:", error)
      }
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        <span>Loading output...</span>
      </div>
    )
  }

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Output Data Found</h1>
        <p className="text-gray-400 mb-6">There is no code execution output available to display.</p>
        <Link href="/landing/codeeditor">
          <Button className="bg-blue-700 hover:bg-blue-800">Return to Code Editor</Button>
        </Link>
      </div>
    )
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
            <span className="ml-2 text-sm font-normal text-gray-400">Code Output</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-white">Code Execution Result</CardTitle>
                <div className="text-gray-400 mt-1">
                  Language: {output.language.charAt(0).toUpperCase() + output.language.slice(1)}
                </div>
              </div>
              <div className="flex items-center">
                {output.success ? (
                  <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Execution Successful</span>
                  </Badge>
                ) : (
                  <Badge className="bg-red-600 hover:bg-red-700 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    <span>Execution Failed</span>
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Source Code</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-white font-mono text-sm max-h-[500px]">
                {output.code}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-white font-mono text-sm max-h-[500px]">
                {output.output}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => router.push("/landing/codeeditor")}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            Back to Editor
          </Button>
        </div>
      </div>
    </div>
  )
}
