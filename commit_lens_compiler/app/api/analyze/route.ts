// import { NextRequest, NextResponse } from "next/server"
// import Parser from "tree-sitter"
// import * as esprima from "esprima"
// import ts from "typescript"

// type Language = "javascript" | "typescript" | "cpp" | "c";

// interface ParserResponse {
//   success: boolean;
//   tree?: string;
//   error?: string;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { code, language } = await req.json()

//     if (language === "javascript") {
//       try {
//         const tree = esprima.parseScript(code, { tolerant: true, loc: true })
//         return NextResponse.json({ success: true, tree, errors: (tree as any).errors ?? [] })
//       } catch (syntaxError: any) {
//         return NextResponse.json({ success: false, error: syntaxError.message }, { status: 200 })
//       }
//     }

//     if (language === "typescript") {
//       try {
//         const sourceFile: ts.SourceFile = ts.createSourceFile("code.ts", code, ts.ScriptTarget.Latest, true)
//         const diagnostics = (sourceFile as any).parseDiagnostics?.map((d: any) => ({
//           message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
//           line: sourceFile.getLineAndCharacterOfPosition(d.start ?? 0).line + 1,
//           column: sourceFile.getLineAndCharacterOfPosition(d.start ?? 0).character + 1,
//         })) || []

//         return NextResponse.json({ success: true, errors: diagnostics })
//       } catch (err: any) {
//         return NextResponse.json({ success: false, error: err.message }, { status: 200 })
//       }
//     }

//     if (language === "cpp" || language === "c") {
//         try {
//             const Parser = require('tree-sitter');
//             const parser = new Parser();
            
//             let lang;
//             if (language === "c") {
//               lang = require('tree-sitter-c');
//             } else if (language === "cpp") {
//               lang = require('tree-sitter-cpp');
//             } else {
//               return NextResponse.json<ParserResponse>({
//                 success: false,
//                 error: `Unsupported language: ${language}`
//               }, { status: 400 });
//             }
            
//             parser.setLanguage(lang);
//             const tree = parser.parse(code);
            
//             return NextResponse.json<ParserResponse>({
//               success: true,
//               tree: tree.rootNode.toString()
//             });
//           } catch (err) {
//             console.error("Tree-sitter parsing error:", err);
//             const errorMessage = err instanceof Error ? err.message : String(err);
//             return NextResponse.json<ParserResponse>({
//               success: false,
//               error: errorMessage
//             }, { status: 500 });
//         }
//         // return NextResponse.json<ParserResponse>({ 
//         //     success: false, 
//         //     error: `Unsupported language: ${language}` 
//         //   }, { status: 400 });
//       }
      
//     return NextResponse.json({ success: false, error: "Unsupported language" }, { status: 400 })
//   } catch (err: any) {
//     return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 })
//   }
// }