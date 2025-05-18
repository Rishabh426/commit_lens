export type Language = "javascript" | "typescript" | "cpp" | "c"

export interface SyntaxError {
  line: number
  column: number
  message: string
  severity: "error" | "warning"
}

export interface CodeAnalysisResult {
  language: string
  code: string
  title: string
  syntaxErrors: SyntaxError[]
  ast: any
  isValid: boolean
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
