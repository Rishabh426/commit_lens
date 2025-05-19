import type { Language, SyntaxError, CodeAnalysisResult } from "@/types/code"
import * as esprima from "esprima"
import * as ts from "typescript"
import * as acorn from "acorn"

export async function analyzeCode(
  code: string,
  language: Language,
  title = "Untitled Snippet",
): Promise<CodeAnalysisResult> {
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

async function analyzeJavaScript(code: string, title: string): Promise<CodeAnalysisResult> {
  const syntaxErrors: SyntaxError[] = []
  let ast = null
  let isValid = false

  try {
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
      }
    } catch (esprimaError: any) {
      syntaxErrors.push({
        line: esprimaError.lineNumber || 1,
        column: esprimaError.column || 1,
        message: esprimaError.description || esprimaError.message || "Syntax error",
        severity: "error",
      })
    }

    try {
      acorn.parse(code, {
        ecmaVersion: 2020,
        sourceType: "script",
        locations: true,
      })
    } catch (acornError: any) {
      const errorMessage = acornError.message || "Syntax error"
      if (!syntaxErrors.some((e) => e.message.includes(errorMessage.substring(0, 20)))) {
        syntaxErrors.push({
          line: acornError.loc?.line || 1,
          column: acornError.loc?.column || 1,
          message: errorMessage,
          severity: "error",
        })
      }
    }

    const jsKeywords = [
      { word: "function", typos: ["functon", "funtion", "funciton"] },
      { word: "return", typos: ["retrun", "retrn"] },
      { word: "const", typos: ["cosnt", "conts"] },
      { word: "let", typos: ["lte"] },
      { word: "var", typos: ["vra"] },
      { word: "if", typos: ["fi"] },
      { word: "else", typos: ["esle"] },
      { word: "for", typos: ["fro"] },
      { word: "while", typos: ["whiel", "whlie"] },
      { word: "switch", typos: ["swtich"] },
      { word: "case", typos: ["caes"] },
      { word: "break", typos: ["braek"] },
      { word: "continue", typos: ["contniue"] },
      { word: "console", typos: ["consoel"] },
    ]

    const stringRegex = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g
    const commentRegex = /\/\/.*$|\/\*[\s\S]*?\*\//g

    const lines = code.split("\n")

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.trim().startsWith("//")) continue

      const processedLine = line
        .replace(stringRegex, (match) => " ".repeat(match.length))
        .replace(commentRegex, (match) => " ".repeat(match.length))

      jsKeywords.forEach(({ word, typos }) => {
        typos.forEach((typo) => {
          const typoRegex = new RegExp(`\\b${typo}\\b`, "g")
          let match
          while ((match = typoRegex.exec(processedLine)) !== null) {
            syntaxErrors.push({
              line: i + 1,
              column: match.index + 1,
              message: `Possible typo: '${typo}' might be '${word}'`,
              severity: "warning",
            })
          }
        })
      })
    }

    const brackets = [
      { open: "(", close: ")", name: "parenthesis" },
      { open: "{", close: "}", name: "curly brace" },
      { open: "[", close: "]", name: "square bracket" },
    ]

    brackets.forEach(({ open, close, name }) => {
      const stack: string[] = []
      const positions: number[] = []

      for (let i = 0; i < code.length; i++) {
        const char = code[i]
        if (char === open) {
          stack.push(char)
          positions.push(i)
        } else if (char === close) {
          if (stack.length === 0 || stack[stack.length - 1] !== open) {
            const line = code.substring(0, i).split("\n").length
            const column = i - code.lastIndexOf("\n", i - 1)
            syntaxErrors.push({
              line,
              column,
              message: `Unmatched closing ${name}`,
              severity: "error",
            })
          } else {
            stack.pop()
            positions.pop()
          }
        }
      }

      if (stack.length > 0) {
        for (let i = 0; i < stack.length; i++) {
          const pos = positions[i]
          const line = code.substring(0, pos).split("\n").length
          const column = pos - (code.lastIndexOf("\n", pos - 1) + 1)
          syntaxErrors.push({
            line,
            column,
            message: `Unclosed ${name}`,
            severity: "error",
          })
        }
      }
    })

    const statementEndings = [
      /\b(var|let|const)\s+\w+\s*=\s*[^;{}\n]+$/,
      /\breturn\s+[^;{}\n]+$/,
      /\bconsole\.\w+\([^;{}\n]+$/,
      /\w+$$[^;{}\n]*$$$/,
    ]

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line && !line.endsWith(";") && !line.endsWith("{") && !line.endsWith("}") && !line.startsWith("//")) {
        for (const pattern of statementEndings) {
          if (pattern.test(line)) {
            syntaxErrors.push({
              line: i + 1,
              column: lines[i].length + 1,
              message: "Missing semicolon at the end of statement",
              severity: "warning",
            })
            break
          }
        }
      }
    }

    const definedVars = new Set<string>()
    const varDeclarationRegex = /\b(var|let|const|function)\s+(\w+)/g
    const functionParamRegex = /\bfunction\s+\w*\s*$$([^)]*)$$/g

    let match: RegExpExecArray | null
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      varDeclarationRegex.lastIndex = 0
      while ((match = varDeclarationRegex.exec(line)) !== null) {
        definedVars.add(match[2])
      }

      functionParamRegex.lastIndex = 0
      while ((match = functionParamRegex.exec(line)) !== null) {
        const params = match[1].split(",")
        params.forEach((param) => {
          const paramName = param.trim()
          if (paramName) definedVars.add(paramName)
        })
      }
    }

    const varUsageRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g
    const keywords = new Set([
      "if",
      "else",
      "for",
      "while",
      "do",
      "switch",
      "case",
      "break",
      "continue",
      "return",
      "function",
      "var",
      "let",
      "const",
      "new",
      "this",
      "typeof",
      "instanceof",
      "void",
      "delete",
      "try",
      "catch",
      "finally",
      "throw",
      "class",
      "extends",
      "super",
      "import",
      "export",
      "default",
      "null",
      "undefined",
      "true",
      "false",
      "in",
      "of",
      "await",
      "async",
      "yield",
      "console",
      "document",
      "window",
      "global",
      "process",
      "require",
      "module",
      "setTimeout",
      "setInterval",
      "clearTimeout",
      "clearInterval",
      "fetch",
      "Promise",
      "Map",
      "Set",
      "Array",
      "Object",
      "String",
      "Number",
      "Boolean",
      "Math",
      "Date",
      "JSON",
      "Error",
    ])

    const stringRegex2 = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g
    const commentRegex2 = /\/\/.*$|\/\*[\s\S]*?\*\//g

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.trim().startsWith("//")) continue

      const processedLine = line
        .replace(stringRegex2, (match) => " ".repeat(match.length))
        .replace(commentRegex2, (match) => " ".repeat(match.length))

      varUsageRegex.lastIndex = 0
      let match
      while ((match = varUsageRegex.exec(processedLine)) !== null) {
        const varName = match[1]
        if (!definedVars.has(varName) && !keywords.has(varName) && varName.length > 1) {
          const prevChar = processedLine[match.index - 1] || ""
          if (prevChar !== "." && prevChar !== "[") {
            const occurrences = (processedLine.match(new RegExp(`\\b${varName}\\b`, "g")) || []).length
            if (occurrences > 1 || code.split(varName).length > 3) {
              syntaxErrors.push({
                line: i + 1,
                column: match.index + 1,
                message: `'${varName}' might be undefined`,
                severity: "warning",
              })
            }
          }
        }
      }
    }

    isValid = syntaxErrors.filter((e) => e.severity === "error").length === 0
  } catch (error: any) {
    console.error("JavaScript analysis error:", error)
    syntaxErrors.push({
      line: 1,
      column: 1,
      message: error.message || "Unknown error during JavaScript analysis",
      severity: "error",
    })
    isValid = false
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
    const sourceFile = ts.createSourceFile("snippet.ts", code, ts.ScriptTarget.Latest, true)

    const compilerOptions: ts.CompilerOptions = {
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      noImplicitReturns: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      allowJs: true,
      checkJs: true,
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext,
    }

    const host = ts.createCompilerHost(compilerOptions)
    const program = ts.createProgram(["snippet.ts"], compilerOptions, {
      ...host,
      getSourceFile: (fileName) => {
        return fileName === "snippet.ts" ? sourceFile : host.getSourceFile(fileName, ts.ScriptTarget.Latest)
      },
    })

    const syntacticDiagnostics = program.getSyntacticDiagnostics(sourceFile)
    const semanticDiagnostics = program.getSemanticDiagnostics(sourceFile)
    const allDiagnostics = [...syntacticDiagnostics, ...semanticDiagnostics]

    if (allDiagnostics.length > 0) {
      allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file && diagnostic.start !== undefined) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
          const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")

          syntaxErrors.push({
            line: line + 1,
            column: character + 1,
            message,
            severity: diagnostic.category === ts.DiagnosticCategory.Error ? "error" : "warning",
          })
        } else if (typeof diagnostic.messageText === "string") {
          syntaxErrors.push({
            line: 1,
            column: 1,
            message: diagnostic.messageText,
            severity: diagnostic.category === ts.DiagnosticCategory.Error ? "error" : "warning",
          })
        } else {
          syntaxErrors.push({
            line: 1,
            column: 1,
            message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
            severity: diagnostic.category === ts.DiagnosticCategory.Error ? "error" : "warning",
          })
        }
      })
    }

    const tsKeywords = [
      { word: "interface", typos: ["inteface", "interace"] },
      { word: "type", typos: ["tpye"] },
      { word: "extends", typos: ["extedns", "extneds"] },
      { word: "implements", typos: ["implemnets"] },
      { word: "class", typos: ["calss"] },
      { word: "constructor", typos: ["consturctor"] },
      { word: "private", typos: ["privte"] },
      { word: "public", typos: ["pubilc"] },
      { word: "protected", typos: ["protceted"] },
      { word: "readonly", typos: ["readony"] },
      { word: "string", typos: ["stirng"] },
      { word: "number", typos: ["numbr"] },
      { word: "boolean", typos: ["boolaen"] },
    ]

    const lines = code.split("\n")

    const stringRegex = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g
    const commentRegex = /\/\/.*$|\/\*[\s\S]*?\*\//g

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.trim().startsWith("//")) continue

      const processedLine = line
        .replace(stringRegex, (match) => " ".repeat(match.length))
        .replace(commentRegex, (match) => " ".repeat(match.length))

      tsKeywords.forEach(({ word, typos }) => {
        typos.forEach((typo) => {
          const typoRegex = new RegExp(`\\b${typo}\\b`, "g")
          let match
          while ((match = typoRegex.exec(processedLine)) !== null) {
            syntaxErrors.push({
              line: i + 1,
              column: match.index + 1,
              message: `Possible typo: '${typo}' might be '${word}'`,
              severity: "warning",
            })
          }
        })
      })
    }

    isValid = syntaxErrors.filter((e) => e.severity === "error").length === 0

    ast = sourceFile
  } catch (error: any) {
    syntaxErrors.push({
      line: 1,
      column: 1,
      message: error.message || "TypeScript error",
      severity: "error",
    })
    isValid = false
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
  let bracketCount = 0
  const bracePositions: number[][] = []
  const parenPositions: number[][] = []
  const bracketPositions: number[][] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === "{") {
        braceCount++
        bracePositions.push([i + 1, j + 1])
      } else if (char === "}") {
        braceCount--
        if (braceCount < 0) {
          syntaxErrors.push({
            line: i + 1,
            column: j + 1,
            message: "Closing brace without matching opening brace",
            severity: "error",
          })
          braceCount = 0
          isValid = false
        } else {
          bracePositions.pop()
        }
      }

      if (char === "(") {
        parenCount++
        parenPositions.push([i + 1, j + 1])
      } else if (char === ")") {
        parenCount--
        if (parenCount < 0) {
          syntaxErrors.push({
            line: i + 1,
            column: j + 1,
            message: "Closing parenthesis without matching opening parenthesis",
            severity: "error",
          })
          parenCount = 0
          isValid = false
        } else {
          parenPositions.pop()
        }
      }

      if (char === "[") {
        bracketCount++
        bracketPositions.push([i + 1, j + 1])
      } else if (char === "]") {
        bracketCount--
        if (bracketCount < 0) {
          syntaxErrors.push({
            line: i + 1,
            column: j + 1,
            message: "Closing bracket without matching opening bracket",
            severity: "error",
          })
          bracketCount = 0 
          isValid = false
        } else {
          bracketPositions.pop()
        }
      }
    }
  }

  if (braceCount > 0) {
    bracePositions.forEach(([line, column]) => {
      syntaxErrors.push({
        line,
        column,
        message: "Unclosed brace",
        severity: "error",
      })
    })
    isValid = false
  }

  if (parenCount > 0) {
    parenPositions.forEach(([line, column]) => {
      syntaxErrors.push({
        line,
        column,
        message: "Unclosed parenthesis",
        severity: "error",
      })
    })
    isValid = false
  }

  if (bracketCount > 0) {
    bracketPositions.forEach(([line, column]) => {
      syntaxErrors.push({
        line,
        column,
        message: "Unclosed bracket",
        severity: "error",
      })
    })
    isValid = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (
      line.startsWith("//") ||
      line.startsWith("#") ||
      line.endsWith("{") ||
      line.endsWith("}") ||
      line.length === 0
    ) {
      continue
    }

    if (!line.endsWith(";")) {
      const isStatement =
        /^(int|char|float|double|void|bool|long|short|unsigned|signed|auto|const|static|extern|volatile|register|struct|class|enum|typename|template|namespace|using|typedef)/.test(
          line,
        ) ||
        /=/.test(line) ||
        /\w+$$.*$$$/.test(line) ||
        /\+\+|--/.test(line) ||
        /return\s+\w+/.test(line)

      if (isStatement) {
        syntaxErrors.push({
          line: i + 1,
          column: line.length + 1,
          message: "Missing semicolon at the end of statement",
          severity: "error",
        })
        isValid = false
      }
    }
  }

  const cppKeywords = [
    { word: "include", typos: ["incldue", "inlcude"] },
    { word: "iostream", typos: ["iosteam"] },
    { word: "namespace", typos: ["namepsace"] },
    { word: "using", typos: ["usign"] },
    { word: "std", typos: ["sdt"] },
    { word: "cout", typos: ["cuot"] },
    { word: "cin", typos: ["cni"] },
    { word: "endl", typos: ["edl"] },
    { word: "return", typos: ["retrun"] },
    { word: "class", typos: ["calss"] },
    { word: "struct", typos: ["strcut"] },
    { word: "public", typos: ["pubilc"] },
    { word: "private", typos: ["privte"] },
    { word: "protected", typos: ["protceted"] },
    { word: "virtual", typos: ["virtal"] },
    { word: "static", typos: ["statci"] },
    { word: "const", typos: ["cosnt"] },
    { word: "void", typos: ["viod"] },
    { word: "int", typos: ["itn"] },
    { word: "char", typos: ["cahr"] },
    { word: "float", typos: ["flota"] },
    { word: "double", typos: ["duoble"] },
    { word: "bool", typos: ["boool"] },
  ]

  const stringRegex = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g
  const commentRegex = /\/\/.*$|\/\*[\s\S]*?\*\//g

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trim().startsWith("//") || line.trim().startsWith("#")) continue

    const processedLine = line
      .replace(stringRegex, (match) => " ".repeat(match.length))
      .replace(commentRegex, (match) => " ".repeat(match.length))

    cppKeywords.forEach(({ word, typos }) => {
      typos.forEach((typo) => {
        const typoRegex = new RegExp(`\\b${typo}\\b`, "g")
        let match
        while ((match = typoRegex.exec(processedLine)) !== null) {
          syntaxErrors.push({
            line: i + 1,
            column: match.index + 1,
            message: `Possible typo: '${typo}' might be '${word}'`,
            severity: "warning",
          })
        }
      })
    })
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (i === 0 && line.includes("#include") && !code.includes("#ifndef") && !code.includes("#pragma once")) {
      syntaxErrors.push({
        line: 1,
        column: 1,
        message: "Header file might be missing include guards (#ifndef, #define, #endif or #pragma once)",
        severity: "warning",
      })
    }

    if (line.includes("using namespace std") && code.includes("#include")) {
      syntaxErrors.push({
        line: i + 1,
        column: line.indexOf("using namespace std") + 1,
        message: "Using 'using namespace std' in a header file is not recommended",
        severity: "warning",
      })
    }

    if (line.includes("int main(") && !code.includes("return")) {
      syntaxErrors.push({
        line: i + 1,
        column: line.indexOf("int main(") + 1,
        message: "Non-void function 'main' might be missing a return statement",
        severity: "warning",
      })
    }

    if (line.includes("new ") && !code.includes("delete")) {
      syntaxErrors.push({
        line: i + 1,
        column: line.indexOf("new ") + 1,
        message: "Potential memory leak: 'new' used without corresponding 'delete'",
        severity: "warning",
      })
    }

    if (line.includes("->") && (line.includes("NULL") || line.includes("nullptr"))) {
      syntaxErrors.push({
        line: i + 1,
        column: line.indexOf("->") + 1,
        message: "Potential null pointer dereference",
        severity: "warning",
      })
    }
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
  const cppResult = analyzeCpp(code, title)
  const syntaxErrors = [...cppResult.syntaxErrors]
  let isValid = cppResult.isValid

  const lines = code.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.includes("//")) {
      syntaxErrors.push({
        line: i + 1,
        column: line.indexOf("//") + 1,
        message: "C++ style comments (//) are not standard in C89/C90",
        severity: "warning",
      })
    }

    const cppOnlyKeywords = [
      "class",
      "namespace",
      "template",
      "typename",
      "bool",
      "true",
      "false",
      "new",
      "delete",
      "try",
      "catch",
      "throw",
      "private",
      "public",
      "protected",
      "virtual",
      "friend",
      "operator",
      "this",
    ]

    cppOnlyKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`)
      if (regex.test(line)) {
        syntaxErrors.push({
          line: i + 1,
          column: line.indexOf(keyword) + 1,
          message: `'${keyword}' is a C++ keyword, not standard C`,
          severity: "error",
        })
        isValid = false
      }
    })

    if (/^\s+\w+\s+\w+\s*=/.test(line) && i > 0) {
      const prevLine = lines[i - 1].trim()
      if (prevLine.endsWith(";") || prevLine.endsWith("}")) {
        syntaxErrors.push({
          line: i + 1,
          column: 1,
          message: "Variable declaration not at the beginning of a block (not allowed in C89/C90)",
          severity: "warning",
        })
      }
    }

    if (/^\w+\s+\w+\s*\(/.test(line) && !line.includes(";") && i > 0) {
      const functionName = line.match(/^\w+\s+(\w+)\s*\(/)?.[1]
      if (functionName && functionName !== "main") {
        let hasPrototype = false
        for (let j = 0; j < i; j++) {
          if (lines[j].includes(functionName) && lines[j].includes("(") && lines[j].includes(";")) {
            hasPrototype = true
            break
          }
        }

        if (!hasPrototype) {
          syntaxErrors.push({
            line: i + 1,
            column: 1,
            message: `Function '${functionName}' might be missing a prototype declaration`,
            severity: "warning",
          })
        }
      }
    }
  }

  return {
    language: "c",
    code,
    title,
    syntaxErrors,
    ast: cppResult.ast,
    isValid,
  }
}
