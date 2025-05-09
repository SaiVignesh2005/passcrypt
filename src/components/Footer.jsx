import React from 'react'
import logo from "../assets/images/logo.svg"

const Footer = () => {
  return (
    <footer className="min-h-[10vh] bg-gray-800 bg-[radial-gradient(60%_120%_at_50%_50%,rgba(0,0,0,0)_0,rgba(59,130,246,0.1)_100%)] text-gray-400 text-sm px-4 py-6 sticky bottom-0 transition-all duration-300" style={{ top: 'calc(100vh - 70px)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-3">
        
        <div className="flex items-center justify-center gap-2">
          <img src={logo} alt="PassCrypt Logo" className="w-20" />
          <span className="hidden sm:inline">Built by Sai Vignesh ❤️</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
