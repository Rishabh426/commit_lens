"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Play, Save, Trash2, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import type { Language } from "@/types/code"
import { analyzeCode } from "@/lib/syntax-analyze"
import { executeCode, saveCode, savePreviousCode, getPreviousCode } from "@/lib/code-executor"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-[calc(100vh-64px)] w-full bg-gray-800 animate-pulse rounded-md"></div>,
})

const DEFAULT_CODE = {
  javascript: `// JavaScript Example
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Test the function
console.log(greet("World"));

// You can write any JavaScript code here
// Click the Run button to execute it
`,
  typescript: `// TypeScript Example
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Test the function
console.log(greet("World"));

// You can write any TypeScript code here
// Click the Run button to execute it
`,
  cpp: `// C++ Example
#include <iostream>
#include <string>
using namespace std;

string greet(string name) {
  return "Hello, " + name + "!";
}

int main() {
  // Test the function
  cout << greet("World") << endl;
  
  // You can write any C++ code here
  // Click the Run button to compile and execute it
  return 0;
}`,
  c: `// C Example
#include <stdio.h>
#include <string.h>

void greet(char* name, char* result) {
  sprintf(result, "Hello, %s!", name);
}

int main() {
  char result[100];
  
  // Test the function
  greet("World", result);
  printf("%s\\n", result);
  
  // You can write any C code here
  // Click the Run button to compile and execute it
  return 0;
}`,
}

export default function CodeEditorPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>("javascript")
  const [code, setCode] = useState<string>(DEFAULT_CODE.javascript)
  const [title, setTitle] = useState<string>("Untitled Snippet")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasPreviousCode, setHasPreviousCode] = useState<boolean>(false)

  // Check if there's previous code available
  useEffect(() => {
    const prevCode = getPreviousCode()
    setHasPreviousCode(!!prevCode)
  }, [])

  // Load last code from localStorage if available
  useEffect(() => {
    const lastCode = localStorage.getItem("lastCode")
    const lastLanguage = localStorage.getItem("lastLanguage") as Language | null
    const lastTitle = localStorage.getItem("lastTitle")

    if (lastCode) {
      setCode(lastCode)
    } else {
      // Only set default code if there's no saved code
      setCode(DEFAULT_CODE[language])
    }

    if (lastLanguage) {
      setLanguage(lastLanguage)
    }

    if (lastTitle) {
      setTitle(lastTitle)
    }

    // Log for debugging
    console.log("Loaded from localStorage:", { lastCode, lastLanguage, lastTitle })
  }, []) // Empty dependency array ensures this only runs once on mount

  // Save current code to localStorage whenever it changes
  useEffect(() => {
    if (code) {
      localStorage.setItem("lastCode", code)
      localStorage.setItem("lastLanguage", language)
      localStorage.setItem("lastTitle", title)
      console.log("Saved to localStorage:", { code: code.substring(0, 20) + "...", language, title })
    }
  }, [code, language, title])

  const handleLanguageChange = (value: string) => {
    const newLanguage = value as Language

    // Save current code as previous before changing language
    savePreviousCode(code, language, title)

    // Save current code before changing language
    localStorage.setItem("lastCode", code)
    localStorage.setItem("lastLanguage", language)

    // Update language
    setLanguage(newLanguage)

    // Only set default code if the current code is empty or matches the default for the previous language
    if (!code || code === DEFAULT_CODE[language]) {
      setCode(DEFAULT_CODE[newLanguage])
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && value !== code) {
      // Save current code as previous before updating
      savePreviousCode(code, language, title)
      setCode(value)
      // Check if we have previous code now
      setHasPreviousCode(true)
    }
  }

  const handleClear = () => {
    setCode(DEFAULT_CODE[language])
    toast.success("Editor cleared")
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      saveCode(code, language, title)
      toast.success("Code saved successfully")
    } catch (error) {
      console.error("Error saving code:", error)
      toast.error("Failed to save code")
    } finally {
      setIsSaving(false)
    }
  }

  const analyzeAndNavigate = async () => {
    setIsAnalyzing(true)
    try {
      // Save current state to localStorage before navigating
      localStorage.setItem("lastCode", code)
      localStorage.setItem("lastLanguage", language)
      localStorage.setItem("lastTitle", title)
      console.log("Saved before analysis:", { code: code.substring(0, 20) + "...", language, title })

      const analysisResult = await analyzeCode(code, language, title)

      // Create a safe copy of the analysis result without circular references
      const safeResult = {
        ...analysisResult,
        ast: {
          type: analysisResult.ast.type || "AST",
          simplified: true,
          // Include only safe, non-circular properties
          nodeCount:
            typeof analysisResult.ast.statements === "object"
              ? Array.isArray(analysisResult.ast.statements)
                ? analysisResult.ast.statements.length
                : 1
              : 0,
        },
      }

      sessionStorage.setItem("codeAnalysisResult", JSON.stringify(safeResult))
      router.push("/landing/report")
    } catch (error) {
      console.error("Error analyzing code:", error)
      toast.error("Failed to analyze code: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const executeAndNavigate = async () => {
    setIsExecuting(true)
    try {
      // Save current state to localStorage before navigating
      localStorage.setItem("lastCode", code)
      localStorage.setItem("lastLanguage", language)
      localStorage.setItem("lastTitle", title)
      console.log("Saved before execution:", { code: code.substring(0, 20) + "...", language, title })

      const outputResult = await executeCode(code, language)
      sessionStorage.setItem("codeOutput", JSON.stringify(outputResult))
      router.push("/landing/output")
    } catch (error) {
      console.error("Error executing code:", error)
      toast.error("Failed to execute code")
    } finally {
      setIsExecuting(false)
    }
  }

  const handleRestorePrevious = () => {
    const prevCode = getPreviousCode()
    if (prevCode) {
      savePreviousCode(code, language, title)

      setCode(prevCode.code)
      setLanguage(prevCode.language)
      setTitle(prevCode.title)

      toast.success("Previous code restored")
    } else {
      toast.error("No previous code available")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="h-16 border-b border-gray-700 flex items-center justify-between px-6 relative z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="font-bold text-xl ml-4">
            <span className="text-white">Commit</span>
            <span className="text-blue-400">Lens</span>
            <span className="ml-2 text-sm font-normal text-gray-400">Code Editor</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[200px] bg-gray-800 border-gray-700 text-white"
            placeholder="Snippet Title"
          />
          <div className="relative z-30">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white z-50">
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRestorePrevious}
              disabled={!hasPreviousCode}
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
            >
              Restore Previous
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
            }}
          />
        </div>
      </div>

      <footer className="h-16 border-t border-gray-700 flex items-center justify-end px-6 gap-4 relative z-20">
        <Button
          onClick={executeAndNavigate}
          disabled={isExecuting}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          {isExecuting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Executing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run & Output
            </>
          )}
        </Button>
        <Button
          onClick={analyzeAndNavigate}
          disabled={isAnalyzing}
          className="bg-blue-700 hover:bg-blue-800 text-white"
        >
          {isAnalyzing ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Code className="h-4 w-4 mr-2" />
              Analyze Code
            </>
          )}
        </Button>
      </footer>
      {/* <DebugStorage /> */}
    </div>
  )
}
