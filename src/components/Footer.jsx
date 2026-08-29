import React from 'react';
import { Globe, Mail } from 'lucide-react'; // Add this line
import logo from "../assets/logo.png"

const date = new Date()
const today = date.getFullYear()

function Footer() {
  return (
   <footer className="border-t border-slate-100 py-12 px-6">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
    
    {/* Left Side: Logo and Branding */}
    <div className="flex flex-col items-center md:items-start">
      {/* Horizontal Brand Container */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 md:w-12 md:h-12 object-contain"
        />
        {/* Negative margin to pull text up and align with the blue box */}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-none -mt-3 md:-mt-4">
          Study Vault
        </h1>
      </div>
      
      <p className="text-xs text-slate-400 text-center md:text-left">
        © {today} BECE Study Vault Ghana. Empowering students for academic excellence.
      </p>
    </div>

    {/* Center: Navigation Links */}
    <div className="flex gap-6 text-xs text-slate-500">
      <a href="#" className="hover:text-blue-600 transition-colors">About Us</a>
      <a href="#" className="hover:text-blue-600 transition-colors">Support Center</a>
      <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
      <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
    </div>

    {/* Right Side: Social Icons */}
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all cursor-pointer">
        <Globe size={16} />
      </div>
      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all cursor-pointer">
        <Mail size={16} />
      </div>
    </div>
  </div>
</footer>
  );
}

export default Footer;