import type {
  Language,
  SyntaxError,
  CodeAnalysisResult,
  ScopeAnalysisResult,
  ScopeInfo,
  VariableInfo,
  ScopeWarning,
} from "@/types/code"
import * as esprima from "esprima"
import * as acorn from "acorn"
import * as estraverse from "estraverse"
import * as eslintScope from "eslint-scope"
import * as ts from "typescript"

export async function analyzeCode(
  code: string,
  language: Language,
  title = "Untitled Snippet",
): Promise<CodeAnalysisResult> {
  switch (language) {
    case "javascript":
      return analyzeJavaScriptEnhanced(code, title)
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

async function analyzeJavaScriptEnhanced(code: string, title: string): Promise<CodeAnalysisResult> {
  const syntaxErrors: SyntaxError[] = []
  let ast: any = null
  let isValid = false
  let scopeAnalysis: ScopeAnalysisResult | undefined

  try {
    try {
      ast = esprima.parseScript(code, {
        loc: true,
        tolerant: true,
        range: true,
      })

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
      try {
        ast = acorn.parse(code, {
          ecmaVersion: 2020,
          sourceType: "script",
          locations: true,
          ranges: true,
        })
      } catch (acornError: any) {
        syntaxErrors.push({
          line: acornError.loc?.line || 1,
          column: acornError.loc?.column || 1,
          message: acornError.message || "Syntax error",
          severity: "error",
        })
      }
    }

    if (ast && !syntaxErrors.some((e) => e.severity === "error")) {
      try {
        const scopeManager = eslintScope.analyze(ast, {
          ecmaVersion: 2020,
          sourceType: "script",
          childVisitorKeys: estraverse.VisitorKeys,
        })

        scopeAnalysis = analyzeScopesAndBindings(scopeManager, ast, code)

        scopeAnalysis.warnings.forEach((warning) => {
          syntaxErrors.push({
            line: warning.line,
            column: warning.column,
            message: warning.message,
            severity: warning.severity,
          })
        })
      } catch (scopeError: any) {
        console.warn("Scope analysis failed:", scopeError)
        syntaxErrors.push({
          line: 1,
          column: 1,
          message: `Scope analysis error: ${scopeError.message}`,
          severity: "warning",
        })
      }

      try {
        performASTAnalysis(ast, code, syntaxErrors)
      } catch (astError: any) {
        console.warn("AST analysis failed:", astError)
      }
    }

    performStaticAnalysis(code, syntaxErrors)

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
    scopeAnalysis,
  }
}

function analyzeScopesAndBindings(scopeManager: any, ast: any, code: string): ScopeAnalysisResult {
  const scopes: ScopeInfo[] = []
  const variables: VariableInfo[] = []
  const warnings: ScopeWarning[] = []

  const globalObjects = new Set([
    "console",
    "document",
    "window",
    "navigator",
    "location",
    "history",
    "screen",
    "global",
    "process",
    "Buffer",
    "__dirname",
    "__filename",
    "module",
    "exports",
    "require",
    "setTimeout",
    "setInterval",
    "clearTimeout",
    "clearInterval",
    "setImmediate",
    "clearImmediate",
    "fetch",
    "Request",
    "Response",
    "Headers",
    "Array",
    "Object",
    "String",
    "Number",
    "Boolean",
    "Date",
    "RegExp",
    "Error",
    "Promise",
    "Map",
    "Set",
    "WeakMap",
    "WeakSet",
    "Symbol",
    "Proxy",
    "Reflect",
    "Math",
    "JSON",
    "typeof",
    "instanceof",
    "undefined",
    "null",
    "true",
    "false",
    "NaN",
    "Infinity",
    "Intl",
    "ArrayBuffer",
    "DataView",
    "Int8Array",
    "Uint8Array",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "localStorage",
    "sessionStorage",
    "XMLHttpRequest",
    "WebSocket",
    "Worker",
    "URL",
    "URLSearchParams",
    "FormData",
    "Blob",
    "File",
    "FileReader",
    "React",
    "ReactDOM",
    "describe",
    "it",
    "test",
    "expect",
    "beforeEach",
    "afterEach",
    "beforeAll",
    "afterAll",
    "jest",
    "jasmine",
    "mocha",
    "chai",
  ])

  scopeManager.scopes.forEach((scope: any) => {
    const scopeInfo: ScopeInfo = {
      type: scope.type,
      range: scope.block.range || [0, 0],
      variables: [],
      references: [],
    }

    scope.variables.forEach((variable: any) => {
      const varInfo: VariableInfo = {
        name: variable.name,
        type: getVariableType(variable),
        declared: variable.defs.length > 0,
        used: variable.references.length > 0,
        line: variable.defs[0]?.node?.loc?.start?.line || 1,
        column: variable.defs[0]?.node?.loc?.start?.column || 1,
        scope: scope.type,
      }

      variables.push(varInfo)
      scopeInfo.variables.push(variable.name)

      if (variable.defs.length > 0) {
        const isUsed = scopeManager.scopes.some((scope: any) =>
          scope.references.some((ref: any) => ref.resolved === variable)
        );
      
        if (!isUsed && !isIgnoredUnusedVariable(variable.name)) {
          warnings.push({
            type: "unused-variable",
            message: `Variable '${variable.name}' is declared but never used`,
            line: varInfo.line,
            column: varInfo.column,
            severity: "warning",
          });
        }
      }

      if (variable.defs.length > 1) {
        variable.defs.slice(1).forEach((def: any) => {
          warnings.push({
            type: "redeclared-variable",
            message: `Variable '${variable.name}' is redeclared`,
            line: def.node?.loc?.start?.line || 1,
            column: def.node?.loc?.start?.column || 1,
            severity: "warning",
          })
        })
      }
    })

    scope.references.forEach((ref: any) => {
      scopeInfo.references.push(ref.identifier.name)

      if (!ref.resolved && !globalObjects.has(ref.identifier.name)) {
        const varName = ref.identifier.name

        if (!isLikelyGlobal(varName)) {
          warnings.push({
            type: "undefined-variable",
            message: `'${varName}' is not defined`,
            line: ref.identifier.loc?.start?.line || 1,
            column: ref.identifier.loc?.start?.column || 1,
            severity: "warning",
          })
        }
      }
    })

    scopes.push(scopeInfo)
  })

  return { scopes, variables, warnings }
}

function isLikelyGlobal(varName: string): boolean {
  return (
    /^[A-Z]/.test(varName) ||
    varName.startsWith("$") ||
    varName.startsWith("_") ||
    varName === "$" ||
    ["jQuery", "lodash", "_", "moment", "axios", "d3"].includes(varName) ||
    varName.toUpperCase() === varName
  )
}

function getVariableType(variable: any): "var" | "let" | "const" | "function" | "parameter" {
  if (variable.defs.length === 0) return "var"

  const def = variable.defs[0]
  switch (def.type) {
    case "Variable":
      return def.node.kind || "var"
    case "FunctionName":
      return "function"
    case "Parameter":
      return "parameter"
    default:
      return "var"
  }
}

function isIgnoredUnusedVariable(name: string): boolean {
  return name.startsWith("_") || name === "React" || name === "exports" || name === "module" || name === "require"
}

function performASTAnalysis(ast: any, code: string, syntaxErrors: SyntaxError[]): void {
  let hasUnreachableCode = false
  let lastReturnLine = -1

  estraverse.traverse(ast, {
    enter: (node: any) => {
      if (node.type === "ReturnStatement") {
        lastReturnLine = node.loc?.start?.line || -1
      }

      if (lastReturnLine !== -1 && node.loc?.start?.line && node.loc.start.line > lastReturnLine) {
        if (node.type !== "FunctionDeclaration" && node.type !== "FunctionExpression") {
          if (!hasUnreachableCode) {
            syntaxErrors.push({
              line: node.loc.start.line,
              column: node.loc.start.column + 1,
              message: "Unreachable code detected after return statement",
              severity: "warning",
            })
            hasUnreachableCode = true
          }
        }
      }

      if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression") {
        hasUnreachableCode = false
        lastReturnLine = -1
      }

      checkNodeForIssues(node, syntaxErrors)
    },

    leave: (node: any) => {
      if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression") {
        lastReturnLine = -1
        hasUnreachableCode = false
      }
    },
  })
}

function checkNodeForIssues(node: any, syntaxErrors: SyntaxError[]): void {
  if (node.type === "IfStatement" && node.test?.type === "AssignmentExpression") {
    syntaxErrors.push({
      line: node.test.loc?.start?.line || 1,
      column: node.test.loc?.start?.column + 1 || 1,
      message: "Assignment in condition, did you mean to use == or ===?",
      severity: "warning",
    })
  }

  if (node.type === "BinaryExpression" && node.operator === "==") {
    syntaxErrors.push({
      line: node.loc?.start?.line || 1,
      column: node.loc?.start?.column + 1 || 1,
      message: "Use === instead of == for strict equality comparison",
      severity: "info",
    })
  }

  if (node.type === "CatchClause" && node.body?.body?.length === 0) {
    syntaxErrors.push({
      line: node.loc?.start?.line || 1,
      column: node.loc?.start?.column + 1 || 1,
      message: "Empty catch block - consider handling the error",
      severity: "warning",
    })
  }
}

function performStaticAnalysis(code: string, syntaxErrors: SyntaxError[]): void {
  const lines = code.split("\n")

  const commonTypos = [
    { word: "function", typos: ["functon", "funtion", "funciton"] },
    { word: "return", typos: ["retrun", "retrn"] },
    { word: "const", typos: ["cosnt", "conts"] },
    { word: "let", typos: ["lte"] },
    { word: "var", typos: ["vra"] },
    { word: "console", typos: ["consoel"] },
  ]

  const stringRegex = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g
  const commentRegex = /\/\/.*$|\/\*[\s\S]*?\*\//g

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trim().startsWith("//")) continue

    const processedLine = line
      .replace(stringRegex, (match) => " ".repeat(match.length))
      .replace(commentRegex, (match) => " ".repeat(match.length))

    commonTypos.forEach(({ word, typos }) => {
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

    if (
      line.trim() &&
      !line.trim().endsWith(";") &&
      !line.trim().endsWith("{") &&
      !line.trim().endsWith("}") &&
      !line.trim().startsWith("//") &&
      !line.trim().startsWith("*") &&
      /^[^/]*[a-zA-Z0-9)\]]\s*$/.test(line.trim())
    ) {
      syntaxErrors.push({
        line: i + 1,
        column: line.length + 1,
        message: "Missing semicolon at end of statement",
        severity: "info",
      })
    }
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
        }
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === "{") braceCount++
      else if (char === "}") braceCount--
    }
  }

  if (braceCount !== 0) {
    syntaxErrors.push({
      line: 1,
      column: 1,
      message: "Mismatched braces",
      severity: "error",
    })
    isValid = false
  }

  return {
    language: "cpp",
    code,
    title,
    syntaxErrors,
    ast: { type: "TranslationUnit" },
    isValid,
  }
}

function analyzeC(code: string, title: string): CodeAnalysisResult {
  const cppResult = analyzeCpp(code, title)
  return {
    ...cppResult,
    language: "c",
  }
}
