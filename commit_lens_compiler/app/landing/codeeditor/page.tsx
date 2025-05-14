"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-[calc(100vh-64px)] w-full bg-gray-800 animate-pulse rounded-md"></div>,
})

type Language = "javascript" | "cpp" | "c"

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

const OUTPUT_EXAMPLES = {
  javascript: "Hello, World!",
  cpp: "Hello, World!",
  c: "Hello, World!",
}

export default function CodeEditorPage() {
  const [language, setLanguage] = useState<Language>("javascript")
  const [code, setCode] = useState<string>(DEFAULT_CODE.javascript)
  const [output, setOutput] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)

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

  const runCode = () => {
    setIsRunning(true)
    setTimeout(() => {
      setOutput(OUTPUT_EXAMPLES[language])
      setIsRunning(false)
    }, 1000)
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
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="c">C</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runCode} disabled={isRunning} className="bg-blue-700 hover:bg-blue-800 text-white">
            {isRunning ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="h-full border-r border-gray-700 overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language === "javascript" ? "javascript" : language === "cpp" ? "cpp" : "c"}
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
        <div className="flex flex-col h-full bg-gray-800">
          <div className="px-4 py-3 border-b border-gray-700 font-medium">Output</div>
          <div className="p-4 font-mono text-sm h-full overflow-auto">
            {output ? (
              <pre className="text-white">{output}</pre>
            ) : (
              <div className="text-gray-400">Run your code to see the output here.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
