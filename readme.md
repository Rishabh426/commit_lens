4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Usage

### Code Editor

1. Navigate to the code editor by clicking "Try it now" or "Get Started" on the landing page
2. Select your programming language from the dropdown menu
3. Write or paste your code in the editor
4. Click "Run Analysis" to analyze your code
5. View the detailed analysis report with syntax errors and AST


### Analysis Report

The analysis report provides:

- Summary of syntax errors, warnings, and information
- Detailed error messages with line and column information
- Source code view with highlighted error lines
- Abstract Syntax Tree (AST) visualization


## Technologies

- **Frontend Framework**:

- [Next.js](https://nextjs.org/) - React framework for server-rendered applications
- [React](https://reactjs.org/) - UI library



- **Styling**:

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library built on Radix UI



- **Code Editor**:

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor used in VS Code



- **Code Analysis**:

- [Esprima](https://esprima.org/) - JavaScript parser for syntax analysis
- [Acorn](https://github.com/acornjs/acorn) - JavaScript parser (alternative to Esprima)
- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) - For TypeScript analysis



- **State Management**:

- React Hooks - For local state management
- sessionStorage - For passing data between pages



- **Type Safety**:

- [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript





## Technical Implementation Details

### Syntax Analysis

The syntax analyzer (`lib/syntax-analyzer.ts`) is the core of the application. It uses different approaches for each supported language:

#### JavaScript Analysis

1. Uses Esprima to parse the code and get basic syntax errors
2. Falls back to Acorn for more detailed parsing if needed
3. Performs custom checks for:

1. Typos in common JavaScript keywords
2. Unbalanced brackets and parentheses
3. Missing semicolons
4. Undefined variables





#### TypeScript Analysis

1. Uses the TypeScript Compiler API with strict type checking
2. Gets both syntactic and semantic diagnostics
3. Performs additional checks for typos in TypeScript-specific keywords


#### C/C++ Analysis

Since running a C/C++ compiler in the browser is not feasible, the analyzer uses custom logic to detect:

1. Unbalanced braces, parentheses, and brackets
2. Missing semicolons in statements
3. Typos in common C/C++ keywords
4. Language-specific issues like memory leaks and null pointer dereferences


### Theme Switching

The application supports dark and light modes using:

1. Next.js `next-themes` package
2. Tailwind CSS dark mode
3. A theme toggle component that persists the user's preference


### Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones


This is achieved using Tailwind CSS's responsive utilities and a mobile-first design approach.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Write tests for new features
- Update documentation as needed


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editing experience
- [TypeScript](https://www.typescriptlang.org/) for the compiler API
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components