"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import type { Language } from "@/types/code"
import { analyzeCode } from "@/lib/syntax-analyze"

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

  // Update code when language changes
  useEffect(() => {
    setCode(DEFAULT_CODE[language])
  }, [language])

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language)
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
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
    } finally {
      setIsAnalyzing(false)
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
                <Play className="h-4 w-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
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
    </div>
  )
}
