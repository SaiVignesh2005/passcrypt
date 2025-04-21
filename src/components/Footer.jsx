import React from 'react'
import logo from "../assets/images/logo.svg"

const Footer = () => {
  return (
    <footer className="bg-gray-800 bg-[radial-gradient(60%_120%_at_50%_50%,rgba(0,0,0,0)_0,rgba(59,130,246,0.1)_100%)] text-gray-400 text-sm px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        
        <div className="flex items-center justify-center gap-2">
          <img src={logo} alt="PassCrypt Logo" className="w-20" />
          <span className="hidden sm:inline">Built by Sai Vignesh ❤️</span>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/" className="hover:text-blue-400 transition">Home</a>
          <a href="/features" className="hover:text-blue-400 transition">Features</a>
          <a href="/privacy" className="hover:text-blue-400 transition">Privacy</a>
          <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">GitHub</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
