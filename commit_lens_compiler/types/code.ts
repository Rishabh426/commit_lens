export type Language = "javascript" | "typescript" | "cpp" | "c"

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
}
