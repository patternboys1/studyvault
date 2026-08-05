import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom"; // Assuming you use react-router
import Logo from "../../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email/Password Login Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect to that beautiful dashboard
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Logic
  const handleGoogleLogin = async () => {
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
      {/* LEFT SIDE: Visual/Marketing (Based on design) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 relative items-center justify-center p-12 overflow-hidden">
        <div className="z-10 text-white max-w-md">
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Empowering your future through knowledge.
          </h2>
          <p className="text-lg opacity-80">
            Join thousands of learners worldwide on a journey of discovery and
            growth.
          </p>
        </div>
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
        <Logo/>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-8">
            Sign in to continue your learning journey.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. name@company.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex justify-center items-center"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-white px-2 text-gray-400">OR</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full border border-gray-200 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            <img
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              className="w-5 h-5"
              alt="Google"
            />
            LOGIN WITH GOOGLE
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-indigo-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
