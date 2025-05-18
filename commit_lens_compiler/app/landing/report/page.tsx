"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, AlertTriangle, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { CodeAnalysisResult, SyntaxError } from "@/types/code"

export default function AnalysisReportPage() {
  const router = useRouter()
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedResult = sessionStorage.getItem("codeAnalysisResult")
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult)
        setAnalysisResult(parsedResult)
      } catch (error) {
        console.error("Error parsing analysis result:", error)
      }
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        <span>Loading analysis report...</span>
      </div>
    )
  }

  if (!analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Analysis Data Found</h1>
        <p className="text-gray-400 mb-6">There is no code analysis data available to display.</p>
        <Link href="/landing/codeeditor">
          <Button className="bg-blue-700 hover:bg-blue-800">Return to Code Editor</Button>
        </Link>
      </div>
    )
  }

  const { language, code, title, syntaxErrors, isValid } = analysisResult
  
  const errors = syntaxErrors.filter((error) => error.severity === "error")
  const warnings = syntaxErrors.filter((error) => error.severity === "warning")

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
            <span className="ml-2 text-sm font-normal text-gray-400">Analysis Report</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-white">Analysis Results</CardTitle>
              <Badge className={isValid ? "bg-green-600" : "bg-red-600"}>
                {isValid ? "Valid" : "Invalid"} {language.charAt(0).toUpperCase() + language.slice(1)} Code
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-red-400">Errors</h3>
                  <span className="text-2xl font-bold text-red-400">{errors.length}</span>
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-900/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-yellow-400">Warnings</h3>
                  <span className="text-2xl font-bold text-yellow-400">{warnings.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {errors.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-red-400">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  <span>Errors</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errors.map((error, index) => (
                  <ErrorItem key={index} error={error} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {warnings.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-yellow-400">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Warnings</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {warnings.map((warning, index) => (
                  <ErrorItem key={index} error={warning} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Source Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <pre className="p-4 overflow-x-auto text-white font-mono text-sm">
                {code.split("\n").map((line, i) => {
                  const lineErrors = syntaxErrors.filter((e) => e.line === i + 1)
                  const hasError = lineErrors.length > 0
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex ${hasError ? "bg-red-900/20" : ""}`}
                    >
                      <span className="inline-block w-10 text-right pr-4 text-gray-500 select-none">
                        {i + 1}
                      </span>
                      <span>{line}</span>
                    </div>
                  )
                })}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ErrorItem({ error }: { error: SyntaxError }) {
  return (
    <div className={`p-3 rounded-lg ${error.severity === "error" ? "bg-red-900/20" : "bg-yellow-900/20"}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {error.severity === "error" ? (
            <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
          )}
          <span className="text-white">{error.message}</span>
        </div>
        <Badge variant="outline" className="bg-transparent border-gray-700 text-gray-400">
          Line {error.line}, Col {error.column}
        </Badge>
      </div>
    </div>
  )
}
