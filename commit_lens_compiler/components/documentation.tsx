import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Documentation() {
  return (
    <section id="docs" className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Documentation</h2>
          <p className="text-xl text-gray-600 max-w-[800px] mx-auto">
            Everything you need to know to get started with CommitLens
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            <TabsContent value="getting-started" className="p-6 bg-white rounded-b-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Getting Started with CommitLens</h3>
              <div className="space-y-4">
                <p>Follow these simple steps to start coding with CommitLens:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Create an account or sign in</li>
                  <li>Create a new project and select your language</li>
                  <li>Write your code in the editor</li>
                  <li>Click "Run" to compile and execute your code</li>
                  <li>View the output in the console</li>
                </ol>
              </div>
            </TabsContent>
            <TabsContent value="languages" className="p-6 bg-white rounded-b-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Supported Languages</h3>
              <div className="space-y-4">
                <p>CommitLens currently supports the following languages:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>JavaScript (Node.js)</li>
                  <li>C++</li>
                  <li>C</li>
                </ul>
                <p>Each language environment is configured with the latest stable version and common libraries.</p>
              </div>
            </TabsContent>
            <TabsContent value="api" className="p-6 bg-white rounded-b-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">API Documentation</h3>
              <div className="space-y-4">
                <p>Integrate CommitLens into your own applications with our REST API:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Create and manage projects</li>
                  <li>Compile and run code</li>
                  <li>Retrieve execution results</li>
                  <li>Manage user accounts</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
