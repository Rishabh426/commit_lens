import type { Language, CodeOutput, SavedCode } from "@/types/code"

async function loadTypeScriptCompiler(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve()
      return
    }

    if (window.ts) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/typescript@4.9.5/lib/typescript.min.js"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load TypeScript compiler"))
    document.head.appendChild(script)
  })
}

async function executeJsTs(code: string, language: Language): Promise<string> {
  try {
    if (language === "typescript") {
      try {
        if (typeof window !== "undefined" && !window.ts) {
          await loadTypeScriptCompiler()
        }

        if (typeof window !== "undefined" && window.ts) {
          const transpileResult = window.ts.transpileModule(code, {
            compilerOptions: {
              module: window.ts.ModuleKind.CommonJS,
              target: window.ts.ScriptTarget.ES2015,
              strict: false,
              removeComments: true,
            },
          })

          code = transpileResult.outputText
        } else {
          code = simplifyTypeScript(code)
        }
      } catch (transpileError: any) {
        return `Transpilation error: ${transpileError.message}`
      }
    }

    const result = new Function(`
      try {
        // Capture console.log output
        const logs = [];
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '));
          originalConsoleLog(...args);
        };
        
        // Execute the code
        ${code}
        
        // Restore console.log
        console.log = originalConsoleLog;
        
        return logs.join('\\n');
      } catch (error) {
        return 'Error: ' + error.message;
      }
    `)()

    return result || "Code executed successfully with no output."
  } catch (error: any) {
    return `Error: ${error.message}`
  }
}

function simplifyTypeScript(code: string): string {
  return (
    code
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, "")
      .replace(/type\s+\w+\s*=\s*[^;]*;/g, "")
      .replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*\s*(?=[,)])/g, "")
      .replace(/\)\s*:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*\s*(?=[{])/g, ")")
      .replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*\s*(?=[=;])/g, "")
  )
}

function executeCCpp(code: string): string {
  return "C/C++ execution requires a backend compiler service.\nThis would typically be implemented with a server that compiles and runs the code."
}

export async function executeCode(code: string, language: Language): Promise<CodeOutput> {
  const id = Math.random().toString(36).substring(2, 15)
  const timestamp = Date.now()
  let output = ""
  let success = true

  try {
    switch (language) {
      case "javascript":
      case "typescript":
        output = await executeJsTs(code, language)
        break
      case "c":
      case "cpp":
        output = executeCCpp(code)
        break
      default:
        output = "Unsupported language"
        success = false
    }

    if (output.startsWith("Error:")) {
      success = false
    }
  } catch (error: any) {
    output = `Execution error: ${error.message}`
    success = false
  }

  return {
    id,
    language,
    code,
    output,
    timestamp,
    success,
  }
}

export function saveCode(code: string, language: Language, title = "Untitled"): SavedCode {
  const id = Math.random().toString(36).substring(2, 15)
  const timestamp = Date.now()

  const savedCode: SavedCode = {
    id,
    language,
    code,
    title,
    timestamp,
  }

  const savedCodesJson = localStorage.getItem("savedCodes")
  const savedCodes: SavedCode[] = savedCodesJson ? JSON.parse(savedCodesJson) : []

  savedCodes.push(savedCode)
  localStorage.setItem("savedCodes", JSON.stringify(savedCodes))

  return savedCode
}

export function getSavedCodes(): SavedCode[] {
  const savedCodesJson = localStorage.getItem("savedCodes")
  return savedCodesJson ? JSON.parse(savedCodesJson) : []
}

export function clearSavedCode(id: string): boolean {
  const savedCodesJson = localStorage.getItem("savedCodes")
  if (!savedCodesJson) return false

  const savedCodes: SavedCode[] = JSON.parse(savedCodesJson)
  const newSavedCodes = savedCodes.filter((code) => code.id !== id)

  localStorage.setItem("savedCodes", JSON.stringify(newSavedCodes))
  return true
}

export function savePreviousCode(code: string, language: Language, title = "Untitled"): void {
  if (!code) return

  localStorage.setItem("previousCode", code)
  localStorage.setItem("previousLanguage", language)
  localStorage.setItem("previousTitle", title)
}

export function getPreviousCode(): { code: string; language: Language; title: string } | null {
  const previousCode = localStorage.getItem("previousCode")
  const previousLanguage = localStorage.getItem("previousLanguage") as Language | null
  const previousTitle = localStorage.getItem("previousTitle")

  if (!previousCode || !previousLanguage) {
    return null
  }

  return {
    code: previousCode,
    language: previousLanguage,
    title: previousTitle || "Untitled",
  }
}

export function clearPreviousCode(): void {
  localStorage.removeItem("previousCode")
  localStorage.removeItem("previousLanguage")
  localStorage.removeItem("previousTitle")
}
