import React from 'react';
import logo from "../assets/images/logo.svg";
import github from "../assets/images/github.svg";

const Navbar = () => {
  const getNavbarClass = (extra = '') =>
    `hover:font-bold hover:text-[#2563EB] transition-all duration-200 ${extra}`;

  return (
    <div className="relative w-full overflow-hidden">

      <div className="absolute inset-0 -z-10 h-32 w-full bg-gray-800 bg-[radial-gradient(60%_120%_at_50%_50%,rgba(0,0,0,0)_0,rgba(59,130,246,0.1)_100%)]" />

      <nav className="px-4 sm:px-10 flex justify-between items-center h-16 bg-transparent text-[#e0e5ec] max-w-full">
    
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-45" />
        </div>

       <button onClick={() => window.open('https://github.com', '_blank')} className="flex items-center space-x-4 cursor-pointer hover:font-bold hover:text-[#2563EB] transition-all duration-200">
          <img src={github} alt="GitHub" className='invert h-8' />
           <span className='font-bold'>GitHub</span>
       </button> 
        
      </nav>
    </div>
  );
};

export default Navbar;
