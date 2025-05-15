import { Language, SyntaxError, CodeAnalysisResult } from "@/types/code"
import * as esprima from "esprima"
import * as ts from "typescript"

export async function analyzeCode(code: string, language: Language, title: string = "Untitled Snippet"): Promise<CodeAnalysisResult> {
  switch (language) {
    case "javascript":
      return analyzeJavaScript(code, title)
    case "typescript":
      return analyzeTypeScript(code, title)
    case "cpp":
      return analyzeCpp(code, title)
    case "c":
      return analyzeC(code, title)
    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}

function analyzeJavaScript(code: string, title: string): CodeAnalysisResult {
  const syntaxErrors: SyntaxError[] = []
  let ast = null
  let isValid = false

  try {
    ast = esprima.parseScript(code, { loc: true, tolerant: true })
    
    if (ast.errors && ast.errors.length > 0) {
      ast.errors.forEach((error: any) => {
        syntaxErrors.push({
          line: error.lineNumber || 1,
          column: error.column || 1,
          message: error.description || "Syntax error",
          severity: "error",
        })
      })
    } else {
      isValid = true
    }
  } catch (error: any) {
    syntaxErrors.push({
      line: error.lineNumber || 1,
      column: error.column || 1,
      message: error.description || error.message || "Syntax error",
      severity: "error",
    })
  }

  return {
    language: "javascript",
    code,
    title,
    syntaxErrors,
    ast: ast || {},
    isValid,
  }
}

function analyzeTypeScript(code: string, title: string): CodeAnalysisResult {
  const syntaxErrors: SyntaxError[] = []
  let ast = null
  let isValid = false

  try {
    const sourceFile = ts.createSourceFile(
      "snippet.ts",
      code,
      ts.ScriptTarget.Latest,
      true
    )

    const compilerOptions = ts.getDefaultCompilerOptions()
    
    const host = ts.createCompilerHost(compilerOptions)
    const program = ts.createProgram(["snippet.ts"], compilerOptions, {
      ...host,
      getSourceFile: (fileName) => {
        return fileName === "snippet.ts" ? sourceFile : host.getSourceFile(fileName, ts.ScriptTarget.Latest)
      },
    })

    const diagnostics = ts.getPreEmitDiagnostics(program)
    
    if (diagnostics.length > 0) {
      diagnostics.forEach((diagnostic) => {
        if (diagnostic.file && diagnostic.start !== undefined) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
          const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
          
          syntaxErrors.push({
            line: line + 1,
            column: character + 1,
            message,
            severity: diagnostic.category === ts.DiagnosticCategory.Error ? "error" : "warning",
          })
        }
      })
    }

    isValid = syntaxErrors.filter(e => e.severity === "error").length === 0
    
    ast = sourceFile
  } catch (error: any) {
    syntaxErrors.push({
      line: 1,
      column: 1,
      message: error.message || "TypeScript error",
      severity: "error",
    })
  }

  return {
    language: "typescript",
    code,
    title,
    syntaxErrors,
    ast: ast || {},
    isValid,
  }
}

function analyzeCpp(code: string, title: string): CodeAnalysisResult {
  
  const syntaxErrors: SyntaxError[] = []
  let isValid = true
  
  const lines = code.split("\n")
  
  let braceCount = 0
  let parenCount = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    for (const char of line) {
      if (char === "{") braceCount++
      if (char === "}") braceCount--
      if (char === "(") parenCount++
      if (char === ")") parenCount--
      
      if (braceCount < 0) {
        syntaxErrors.push({
          line: i + 1,
          column: line.indexOf("}") + 1,
          message: "Closing brace without matching opening brace",
          severity: "error",
        })
        braceCount = 0;
        isValid = false
      }
      
      if (parenCount < 0) {
        syntaxErrors.push({
          line: i + 1,
          column: line.indexOf(")") + 1,
          message: "Closing parenthesis without matching opening parenthesis",
          severity: "error",
        })
        parenCount = 0 
        isValid = false
      }
    }
    
    if (!line.trim().startsWith("//") && 
        !line.trim().startsWith("#") && 
        !line.trim().endsWith("{") && 
        !line.trim().endsWith("}") && 
        !line.trim().endsWith(";") && 
        line.trim().length > 0) {
      syntaxErrors.push({
        line: i + 1,
        column: line.length,
        message: "Possible missing semicolon",
        severity: "warning",
      })
    }
  }
  
  if (braceCount > 0) {
    syntaxErrors.push({
      line: lines.length,
      column: 1,
      message: `Missing ${braceCount} closing brace(s)`,
      severity: "error",
    })
    isValid = false
  }
  
  if (parenCount > 0) {
    syntaxErrors.push({
      line: lines.length,
      column: 1,
      message: `Missing ${parenCount} closing parenthesis`,
      severity: "error",
    })
    isValid = false
  }
  
  const ast = {
    type: "TranslationUnit",
    children: [
      {
        type: "SimpleAST",
        message: "Full AST not available for C++ in browser environment",
      },
    ],
  }
  
  return {
    language: "cpp",
    code,
    title,
    syntaxErrors,
    ast,
    isValid,
  }
}

function analyzeC(code: string, title: string): CodeAnalysisResult {
  const result = analyzeCpp(code, title)
  result.language = "c"
  return result
}
