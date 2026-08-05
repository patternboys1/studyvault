import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // Using lucide-react to match your sidebar icons

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      navigate("/login"); // Push them back to login page
    } catch (error) {
      console.error("Logout Error:", error.message);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
    >
      <LogOut size={20} className="group-hover:text-red-600" />
      <span className="font-medium">Logout</span>
    </button>
  );
}