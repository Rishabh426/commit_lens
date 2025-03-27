import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [code, setCode] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setError('')
      const reader = new FileReader()
      reader.onload = (e) => {
        setCode(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('dark-mode')
  }

  const handleSubmit = () => {
    if (!code.trim()) {
      setError('Please include some code before submitting')
      return
    }
    if (!fileName) {
      setError('Please upload a file before submitting')
      return
    }
    setError('')
    console.log('Code submitted:', code)
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <div className="header">
          <h1>Commit Lens</h1>
        </div>
        <div className="main-content">
          <div className="editor-section">
            <div className="textbox-container">
              <div className="code-header">
                <span className="code-title">Code Editor</span>
                <div className="code-controls">
                  <span className="control-dot red"></span>
                  <span className="control-dot yellow"></span>
                  <span className="control-dot green"></span>
                </div>
              </div>
              <div className="editor-content">
                <textarea
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setError('')
                  }}
                  placeholder="Paste your code here..."
                  className="code-textbox"
                />
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".txt,.js,.ts,.jsx,.tsx"
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                  <label htmlFor="file-upload" className="file-label">
                    Browse File
                  </label>
                  {fileName && <p className="file-name">Selected file: {fileName}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="action-section">
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleSubmit} className="submit-button">
              Submit Code
            </button>
          </div>
        </div>
      </div>
      <button onClick={toggleDarkMode} className="theme-toggle">
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  )
}

export default App
