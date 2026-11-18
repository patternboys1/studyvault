import { Globe, Mail } from "lucide-react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const today = new Date().getFullYear();

function Footer() {
  return (
    <footer className="border-t border-slate-100 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-2 flex items-center gap-3">
            <img
              src={logo}
              alt="Study Vault"
              className="h-10 w-10 object-contain md:h-12 md:w-12"
            />
            <h2 className="-mt-3 text-xl font-bold leading-none text-slate-900 md:-mt-4 md:text-2xl">
              Study Vault
            </h2>
          </div>
          <p className="text-center text-xs text-slate-400 md:text-left">
            © {today} BECE Study Vault Ghana. Empowering students for academic excellence.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
          <Link to="/about" className="transition-colors hover:text-blue-600">About Us</Link>
          <Link to="/contact" className="transition-colors hover:text-blue-600">Support Center</Link>
          <Link to="/privacy" className="transition-colors hover:text-blue-600">Privacy Policy</Link>
          <Link to="/contact" className="transition-colors hover:text-blue-600">Contact</Link>
        </nav>

        <div className="flex gap-4">
          <Link
            to="/"
            aria-label="Study Vault home"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-blue-600 hover:text-blue-600"
          >
            <Globe size={16} />
          </Link>
          <Link
            to="/contact"
            aria-label="Contact Study Vault"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-blue-600 hover:text-blue-600"
          >
            <Mail size={16} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
