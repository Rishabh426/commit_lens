# CommitLens

CommitLens is a powerful online compiler and code analyzer that supports multiple programming languages, including JavaScript, TypeScript, C++, and C. It offers real-time syntax analysis, detailed error reporting, and an intuitive interface to enhance the coding experience.

## Features

- **Multi-language Support**: Write and analyze code in JavaScript, TypeScript, C++, and C
- **Comprehensive Syntax Analysis**: Detects syntax errors, typos, and potential bugs
- **Detailed Error Reporting**: Provides line and column information for all errors
- **Abstract Syntax Tree Visualization**: View the AST of your code
- **Dark Mode Support**: Comfortable coding experience in any lighting condition
- **Responsive Design**: Works on desktop and mobile devices


## How It Works

CommitLens is a Next.js application that provides a code editor and syntax analysis tool for multiple programming languages. Here's a detailed explanation of how the application works:

### Entry Point

The application entry point is `app/page.tsx`, which renders the landing page. The landing page includes:

- Navigation bar with theme toggle
- Hero section with "Try it now" button
- Features section
- Documentation section
- Code examples section
- Footer

When a user clicks "Try it now" or "Get Started", they are redirected to the code editor page at `/landing/codeeditor`.

### Code Editor

The code editor page (`app/landing/codeeditor/page.tsx`) is a client-side rendered page that:

1. Provides a Monaco Editor instance for code editing
2. Allows language selection (JavaScript, TypeScript, C++, C)
3. Handles code input and analysis
4. Navigates to the analysis report page when the user clicks "Run Analysis"

The code editor uses the Monaco Editor library, which is the same editor used in VS Code, providing features like syntax highlighting and code completion.

### Syntax Analysis

When the user clicks "Run Analysis", the following happens:

1. The `analyzeCode` function in `lib/syntax-analyzer.ts` is called with the code and language
2. Based on the language, a specific analyzer function is called:
   - `analyzeJavaScript` for JavaScript
   - `analyzeTypeScript` for TypeScript
   - `analyzeCpp` for C++
   - `analyzeC` for C
3. The analyzer parses the code and identifies syntax errors, typos, and potential bugs
4. The analysis result is stored in sessionStorage
5. The user is redirected to the analysis report page

#### JavaScript/TypeScript Analysis

For JavaScript and TypeScript, the analyzer uses:
- Esprima and Acorn for basic syntax parsing
- TypeScript Compiler API for more advanced analysis
- Custom logic for detecting typos, unbalanced brackets, and undefined variables

#### C/C++ Analysis

For C and C++, the analyzer uses custom logic to detect:
- Unbalanced braces, parentheses, and brackets
- Missing semicolons
- Typos in keywords
- Common C/C++ errors like memory leaks and null pointer dereferences

### Analysis Report

The analysis report page (`app/landing/analysis-report/page.tsx`) retrieves the analysis result from sessionStorage and displays:

1. A summary of syntax errors, warnings, and information
2. Detailed error messages with line and column information
3. The source code with highlighted error lines
4. The Abstract Syntax Tree (AST) visualization

## Project Structure

```
commitlens/
├── app/                    # Next.js app directory (entry point)
│   ├── layout.tsx          # Root layout with ThemeProvider and Toaster
│   ├── page.tsx            # Landing page (main entry point)
│   ├── globals.css         # Global styles
│   └── landing/            # Landing page routes
│       ├── codeeditor/     # Code editor page
│       │   └── page.tsx    # Code editor implementation
│       └── analysis-report/ # Analysis report page
│           └── page.tsx    # Analysis report implementation
│
├── components/             # React components
│   ├── hero.tsx            # Hero section with "Try it now" button
│   ├── features.tsx        # Features section showcasing capabilities
│   ├── documentation.tsx   # Documentation section with tabs
│   ├── code-examples.tsx   # Code examples with syntax highlighting
│   ├── footer.tsx          # Footer with contact information
│   ├── theme-toggle.tsx    # Theme toggle component for dark/light mode
│   ├── theme-provider.tsx  # Theme provider for dark mode support
│   └── ui/                 # UI components (shadcn/ui)
│       ├── button.tsx      # Button component
│       ├── card.tsx        # Card component
│       ├── dialog.tsx      # Dialog component
│       ├── tabs.tsx        # Tabs component
│       └── ...             # Other UI components
│
├── lib/                    # Utility functions and core logic
│   └── syntax-analyzer.ts  # Core syntax analysis implementation
│
├── types/                  # TypeScript type definitions
│   └── code.ts             # Types for code analysis (Language, SyntaxError, etc.)
│
├── public/                 # Static assets
│   └── logo.png            # CommitLens logo
│
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

### Key Files and Their Purposes

- **app/page.tsx**: Main entry point that renders the landing page
- **app/landing/codeeditor/page.tsx**: Code editor implementation
- **app/landing/analysis-report/page.tsx**: Analysis report implementation
- **lib/syntax-analyzer.ts**: Core syntax analysis logic
- **types/code.ts**: TypeScript type definitions for code analysis
- **components/theme-toggle.tsx**: Dark mode toggle implementation
- **components/hero.tsx**: Hero section with main call-to-action

## Code Flow

1. User lands on the home page (`app/page.tsx`)
2. User clicks "Try it now" or "Get Started"
3. User is redirected to the code editor (`app/landing/codeeditor/page.tsx`)
4. User selects a language and writes code
5. User clicks "Run Analysis"
6. Code is analyzed by `lib/syntax-analyzer.ts`
7. Analysis result is stored in sessionStorage
8. User is redirected to the analysis report (`app/landing/analysis-report/page.tsx`)
9. Analysis report displays errors, code, and AST

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/commitlens.git
cd commitlens
