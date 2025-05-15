"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import type { CodeAnalysisResult } from "@/types/code"

export default function AnalysisReportPage() {
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
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Analysis Data Found</h1>
        <p className="text-gray-400 mb-6">There is no code analysis data available to display.</p>
        <Link href="/landing/codeeditor">
          <Button className="bg-blue-700 hover:bg-blue-800">Return to Code Editor</Button>
        </Link>
      </div>
    )
  }

  const { language, code, title, syntaxErrors, ast, isValid } = analysisResult

  const errorCount = syntaxErrors.filter((e) => e.severity === "error").length
  const warningCount = syntaxErrors.filter((e) => e.severity === "warning").length

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
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-white">{title}</CardTitle>
                <CardDescription className="text-gray-400">
                  Language: {language.charAt(0).toUpperCase() + language.slice(1)}
                </CardDescription>
              </div>
              <div className="flex items-center">
                {isValid ? (
                  <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    <span>Syntax Valid</span>
                  </Badge>
                ) : (
                  <Badge className="bg-red-600 hover:bg-red-700 flex items-center gap-1">
                    <X className="h-4 w-4" />
                    <span>Syntax Invalid</span>
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Errors</p>
                  <p className="text-2xl font-bold text-white">{errorCount}</p>
                </div>
                <X className="h-8 w-8 text-red-500" />
              </div>
              <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Warnings</p>
                  <p className="text-2xl font-bold text-white">{warningCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="errors" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="errors">Syntax Errors</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="ast">Abstract Syntax Tree</TabsTrigger>
          </TabsList>

          <TabsContent value="errors" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Syntax Errors and Warnings</CardTitle>
                <CardDescription className="text-gray-400">
                  {syntaxErrors.length === 0
                    ? "No syntax errors or warnings found."
                    : `Found ${syntaxErrors.length} issue${syntaxErrors.length === 1 ? "" : "s"}.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {syntaxErrors.length > 0 ? (
                  <div className="space-y-4">
                    {syntaxErrors.map((error, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {error.severity === "error" ? (
                            <Badge className="bg-red-600">Error</Badge>
                          ) : (
                            <Badge className="bg-yellow-600">Warning</Badge>
                          )}
                          <span className="text-gray-300">
                            Line {error.line}, Column {error.column}
                          </span>
                        </div>
                        <p className="text-white">{error.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Check className="h-16 w-16 text-green-500 mb-4" />
                    <p className="text-xl font-medium text-white">No syntax errors found</p>
                    <p className="text-gray-400">Your code is syntactically correct.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Source Code</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-white font-mono text-sm">
                  {code.split("\n").map((line, i) => (
                    <div key={i} className="relative">
                      <span className="inline-block w-8 text-gray-500 select-none">{i + 1}</span>
                      <span>{line}</span>
                      {syntaxErrors.some((e) => e.line === i + 1) && (
                        <span className="absolute left-0 w-full bg-red-900 bg-opacity-20 -z-10"></span>
                      )}
                    </div>
                  ))}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ast" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Abstract Syntax Tree</CardTitle>
                <CardDescription className="text-gray-400">Visual representation of the code structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-white font-mono text-sm">{JSON.stringify(ast, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}