"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CodeExamples() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("javascript")

  const navigateToEditor = (code: string, language: string) => {
    localStorage.setItem("lastCode", code)
    localStorage.setItem("lastLanguage", language)
    router.push("/landing/codeeditor")
  }

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Code Examples</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Check out these examples to see what CommitLens can do.
          </p>
        </div>

        <Tabs defaultValue="javascript" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
            <TabsTrigger value="cpp">C++</TabsTrigger>
            <TabsTrigger value="c">C</TabsTrigger>
          </TabsList>

          <div className="bg-gray-900 rounded-lg p-1">
            <TabsContent value="javascript" className="mt-0">
              <pre className="language-javascript p-4 overflow-x-auto text-gray-300 text-sm">
                <code>{`// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}
`}</code>
              </pre>
            </TabsContent>

            <TabsContent value="typescript" className="mt-0">
              <pre className="language-typescript p-4 overflow-x-auto text-gray-300 text-sm">
                <code>{`// TypeScript Example
interface Person {
  name: string;
  age: number;
  email?: string;
}

function greet(person: Person): string {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

const alice: Person = {
  name: "Alice",
  age: 28,
  email: "alice@example.com"
};

console.log(greet(alice));
`}</code>
              </pre>
            </TabsContent>

            <TabsContent value="cpp" className="mt-0">
              <pre className="language-cpp p-4 overflow-x-auto text-gray-300 text-sm">
                <code>{`// C++ Example
#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Person {
private:
    string name;
    int age;
    
public:
    Person(string n, int a) : name(n), age(a) {}
    
    void introduce() {
        cout << "Hello, my name is " << name << " and I am " << age << " years old." << endl;
    }
};

int main() {
    Person alice("Alice", 28);
    alice.introduce();
    
    return 0;
}
`}</code>
              </pre>
            </TabsContent>

            <TabsContent value="c" className="mt-0">
              <pre className="language-c p-4 overflow-x-auto text-gray-300 text-sm">
                <code>{`// C Example
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int age;
} Person;

void introduce(Person p) {
    printf("Hello, my name is %s and I am %d years old.\\n", p.name, p.age);
}

int main() {
    Person alice;
    strcpy(alice.name, "Alice");
    alice.age = 28;
    
    introduce(alice);
    
    return 0;
}
`}</code>
              </pre>
            </TabsContent>
          </div>

          <div className="mt-6 text-center">
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white"
              onClick={() => {
                const codeMap: Record<string, string> = {
                  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}`,
                  typescript: `// TypeScript Example
interface Person {
  name: string;
  age: number;
  email?: string;
}

function greet(person: Person): string {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

const alice: Person = {
  name: "Alice",
  age: 28,
  email: "alice@example.com"
};

console.log(greet(alice));`,
                  cpp: `// C++ Example
#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Person {
private:
    string name;
    int age;
    
public:
    Person(string n, int a) : name(n), age(a) {}
    
    void introduce() {
        cout << "Hello, my name is " << name << " and I am " << age << " years old." << endl;
    }
};

int main() {
    Person alice("Alice", 28);
    alice.introduce();
    
    return 0;
}`,
                  c: `// C Example
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int age;
} Person;

void introduce(Person p) {
    printf("Hello, my name is %s and I am %d years old.\\n", p.name, p.age);
}

int main() {
    Person alice;
    strcpy(alice.name, "Alice");
    alice.age = 28;
    
    introduce(alice);
    
    return 0;
}`,
                }

                navigateToEditor(codeMap[activeTab], activeTab)
              }}
            >
              Try this example
            </Button>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
