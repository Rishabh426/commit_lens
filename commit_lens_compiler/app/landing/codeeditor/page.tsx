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
import { executeCode, saveCode } from "@/lib/code-executor"

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

  useEffect(() => {
    const lastCode = localStorage.getItem("lastCode")
    const lastLanguage = localStorage.getItem("lastLanguage") as Language | null
    const lastTitle = localStorage.getItem("lastTitle")

    if (lastCode) {
      setCode(lastCode)
    }

    if (lastLanguage) {
      setLanguage(lastLanguage)
    }

    if (lastTitle) {
      setTitle(lastTitle)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("lastCode", code)
    localStorage.setItem("lastLanguage", language)
    localStorage.setItem("lastTitle", title)
  }, [code, language, title])

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language)
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
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
      const analysisResult = await analyzeCode(code, language, title)
      sessionStorage.setItem("codeAnalysisResult", JSON.stringify(analysisResult))
      router.push("/landing/report")
    } catch (error) {
      console.error("Error analyzing code:", error)
      toast.error("Failed to analyze code")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const executeAndNavigate = async () => {
    setIsExecuting(true)
    try {
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

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="h-16 border-b border-gray-700 flex items-center justify-between px-6">
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
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="c">C</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
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

      <footer className="h-16 border-t border-gray-700 flex items-center justify-end px-6 gap-4">
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
    </div>
  )
}
