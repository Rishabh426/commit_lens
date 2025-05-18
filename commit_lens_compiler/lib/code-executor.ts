import type { Language, CodeOutput, SavedCode } from "@/types/code"

function executeJsTs(code: string): string {
  try {
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
        output = executeJsTs(code)
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
