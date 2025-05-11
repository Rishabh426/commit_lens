"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CodeExamples() {
  const [activeTab, setActiveTab] = useState("javascript")

  return (
    <section id="languages" className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Try It Out</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how CommitLens works with these example code snippets
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="javascript" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="cpp">C++</TabsTrigger>
              <TabsTrigger value="c">C</TabsTrigger>
            </TabsList>

            <div className="mt-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <div className="bg-gray-800 text-white p-4 font-mono text-sm">
                <TabsContent value="javascript" className="m-0">
                  <pre>{`// JavaScript Example - Fibonacci Sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}`}</pre>
                </TabsContent>

                <TabsContent value="cpp" className="m-0">
                  <pre>{`// C++ Example - Fibonacci Sequence
#include <iostream>
using namespace std;

int fibonacci(int n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
  // Calculate first 10 Fibonacci numbers
  for (int i = 0; i < 10; i++) {
    cout << "Fibonacci(" << i << ") = " << fibonacci(i) << endl;
  }
  return 0;
}`}</pre>
                </TabsContent>

                <TabsContent value="c" className="m-0">
                  <pre>{`// C Example - Fibonacci Sequence
#include <stdio.h>

int fibonacci(int n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
  // Calculate first 10 Fibonacci numbers
  for (int i = 0; i < 10; i++) {
    printf("Fibonacci(%d) = %d\\n", i, fibonacci(i));
  }
  return 0;
}`}</pre>
                </TabsContent>
              </div>

              <div className="bg-gray-100 p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Output</div>
                  <Button
                    size="sm"
                    className="bg-blue-700 hover:bg-blue-800"
                    onClick={() => {
                      console.log("Running code")
                    }}
                  >
                    Run
                  </Button>
                </div>
                <div className="mt-2 p-3 bg-white rounded border border-gray-200 font-mono text-sm">
                  {activeTab === "javascript" && (
                    <pre>{`Fibonacci(0) = 0
Fibonacci(1) = 1
Fibonacci(2) = 1
Fibonacci(3) = 2
Fibonacci(4) = 3
Fibonacci(5) = 5
Fibonacci(6) = 8
Fibonacci(7) = 13
Fibonacci(8) = 21
Fibonacci(9) = 34`}</pre>
                  )}
                  {activeTab === "cpp" && (
                    <pre>{`Fibonacci(0) = 0
Fibonacci(1) = 1
Fibonacci(2) = 1
Fibonacci(3) = 2
Fibonacci(4) = 3
Fibonacci(5) = 5
Fibonacci(6) = 8
Fibonacci(7) = 13
Fibonacci(8) = 21
Fibonacci(9) = 34`}</pre>
                  )}
                  {activeTab === "c" && (
                    <pre>{`Fibonacci(0) = 0
Fibonacci(1) = 1
Fibonacci(2) = 1
Fibonacci(3) = 2
Fibonacci(4) = 3
Fibonacci(5) = 5
Fibonacci(6) = 8
Fibonacci(7) = 13
Fibonacci(8) = 21
Fibonacci(9) = 34`}</pre>
                  )}
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  )
}