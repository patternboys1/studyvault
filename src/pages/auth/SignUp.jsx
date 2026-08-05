import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Add their Name to their Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      console.log("Account created successfully");
      navigate("/dashboard"); 
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Design Placeholder (Matches EduMentor) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 relative items-center justify-center p-12 overflow-hidden">
        <div className="z-10 text-white max-w-md">
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Empowering the next generation of leaders.
          </h2>
          <p className="text-lg opacity-80">
            Join over 10,000 students preparing for excellence with the BECE Academy ecosystem.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tighter text-gray-900 italic">Study Vault</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-500 mb-6">Start your journey toward academic success today.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-start gap-2 py-2">
              <input type="checkbox" id="terms" className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded" required />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <span className="text-indigo-600 font-semibold cursor-pointer">Terms and Conditions</span> and <span className="text-indigo-600 font-semibold cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg flex justify-center items-center"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <div className="relative flex justify-center text-sm uppercase"><span className="bg-white px-2 text-gray-400">OR</span></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignup}
            className="w-full border border-gray-200 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            <img 
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
              className="w-5 h-5" 
              alt="Google" 
            />
            Sign up with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" clLinkssName="font-bold text-indigo-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}