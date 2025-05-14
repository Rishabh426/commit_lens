"use client"

import { useState, useEffect } from "react"
import { X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-800 animate-pulse rounded-md"></div>,
})

type Language = "javascript" | "cpp" | "c"

interface CodeEditorModalProps {
  isOpen: boolean
  onClose: () => void
}

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

export function CodeEditorModal({ isOpen, onClose }: CodeEditorModalProps) {
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full w-full h-screen flex flex-col p-0 gap-0 bg-gray-900 text-white border-none rounded-none">
        <DialogHeader className="px-6 py-4 border-b border-gray-700 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-xl text-white">CommitLens Code Editor</DialogTitle>
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
          </div>
          <div className="flex items-center gap-2">
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

            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-800">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden">
          {/* Editor Panel */}
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

          {/* Output Panel */}
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
      </DialogContent>
    </Dialog>
  )
}
