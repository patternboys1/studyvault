import { Menu, Search, Bell, HelpCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 lg:gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar - Hidden on very small screens to make room for name */}
        <div className="relative hidden sm:block w-48 md:w-64 lg:w-96">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      {/* Right Side Tools & Identity */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Icons - Hidden on small mobile to prioritize the Name */}
        <div className="hidden md:flex items-center gap-4 border-r pr-6 border-gray-100 text-gray-400">
          <button className="hover:text-blue-600 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="hover:text-blue-600">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* User Identity - ALWAYS VISIBLE NOW */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right">
            <p className="text-[13px] md:text-sm font-bold text-gray-900 leading-tight">
              {user?.displayName || "Student"}
            </p>
            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">
              JHS 3 Student
            </p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-blue-600 p-0.5 shadow-sm">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=2563eb&color=fff`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
