export type Language = "javascript" | "typescript" | "c" | "cpp"

export interface SyntaxError {
  line: number
  column: number
  message: string
  severity: "error" | "warning" | "info"
}

export interface CodeAnalysisResult {
  language: Language
  code: string
  title: string
  syntaxErrors: SyntaxError[]
  ast: any
  isValid: boolean
  scopeAnalysis?: ScopeAnalysisResult
}

export interface CodeOutput {
  id: string
  language: Language
  code: string
  output: string
  timestamp: number
  success: boolean
}

export interface SavedCode {
  id: string
  language: Language
  code: string
  title: string
  timestamp: number
}

export interface ScopeAnalysisResult {
  scopes: ScopeInfo[]
  variables: VariableInfo[]
  warnings: ScopeWarning[]
}

export interface ScopeInfo {
  type: string
  range: [number, number]
  variables: string[]
  references: string[]
}

export interface VariableInfo {
  name: string
  type: "var" | "let" | "const" | "function" | "parameter"
  declared: boolean
  used: boolean
  line: number
  column: number
  scope: string
}

export interface ScopeWarning {
  type: "unused-variable" | "undefined-variable" | "redeclared-variable" | "unreachable-code"
  message: string
  line: number
  column: number
  severity: "warning" | "error"
}
