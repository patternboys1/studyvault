import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, FileText, 
  BarChart2, Settings, Trophy, X, ClipboardList 
} from "lucide-react";
import LogoutButton from "./LogoutButton";
import logo from "../assets/logo.png"

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Overview", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Past Questions", path: "/dashboard/past-questions", icon: <FileText size={20} /> },
    { label: "Mock Exams", path: "/dashboard/mock-exams", icon: <Trophy size={20} /> },
    { label: "Performance", path: "/dashboard/performance", icon: <BarChart2 size={20} /> },
    { label: "Reports", path: "/dashboard/reports", icon: <ClipboardList size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Header & Close Button */}
          <div className="p-6 flex items-center justify-between">
  <Link to="/dashboard" className="flex items-center gap-3"> {/* Increased gap for breathing room */}
    
    {/* Fixed Logo Container */}
    <div className="flex-shrink-0"> 
      <img 
        src={logo} 
        alt="Logo" 
        className="w-15 h-15 object-contain" // Forces the logo to be exactly this size without distorting
      />
    </div>

    {/* Text Container */}
    <div className="flex flex-col justify-center">
      <span className="block text-xl font-bold text-gray-900 leading-tight">
        Study Vault
      </span>
      <span className="text-[11px] font-medium text-gray-400 tracking-tight">
        Your Academic Success Partner
      </span>
    </div>
  </Link>

  {/* Close Button (Mobile) */}
  <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
    <X size={20} />
  </button>
</div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Pro Card */}
          <div className="mx-4 mb-6 p-5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Pro Plan</p>
            <p className="text-xs mt-1 font-medium leading-tight">Unlimited Mock Exams & AI Feedback</p>
            <Link
              to="/dashboard/upgrade"
              onClick={() => setIsOpen(false)}
              className="block w-full mt-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 text-center"
            >
              Upgrade Now
            </Link>
          </div>

          <div className="p-4 border-t space-y-1">
            <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-blue-600 text-sm font-medium">
              <Settings size={18} /> Settings
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
