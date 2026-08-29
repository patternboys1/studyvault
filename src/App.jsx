import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// --- PUBLIC PAGES (Landing Site) ---
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Features from "./pages/public/Features";
import Contact from "./pages/public/Contact";
import Subjects from "./pages/public/Subjects";
import Pricing from "./pages/public/Pricings"; // Your public pricing
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

// --- PROTECTED PAGES (Internal App) ---
import Overview from "./pages/dashboard/Overview";
import Performance from "./pages/dashboard/Performance";
import MockExams from "./pages/dashboard/MockExams";
import Settings from "./pages/dashboard/Settings";
import PastQuestions from "./pages/dashboard/PastQuestions";
import Report from "./pages/dashboard/Report";
import Upgrade from "./pages/dashboard/Upgrade";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          {/*  Public Landing Page Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/subject" element={<Subjects />} />
          <Route path="/pricing" element={<Pricing />} />

          {/*  Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/*  Protected App Routes (User must be logged in) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
           {/* These render inside DashboardLayout's <Outlet /> */}
           <Route index element={<Overview />} /> 
        <Route path="performance" element={<Performance/>} />
        <Route path="mock-exams" element={<MockExams/>} />
        <Route path="settings" element={<Settings/>} />
        <Route path="upgrade" element={<Upgrade/>} />
        <Route path="past-questions" element={<PastQuestions/>} />
        <Route path="reports" element={<Report/>} />
          </Route>

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
