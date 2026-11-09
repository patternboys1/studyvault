import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/public/Home"));
const About = lazy(() => import("./pages/public/About"));
const Features = lazy(() => import("./pages/public/Features"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Subjects = lazy(() => import("./pages/public/Subjects"));
const Pricing = lazy(() => import("./pages/public/Pricings"));
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const DashboardLayout = lazy(() => import("./components/DashboardLayout"));
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const Performance = lazy(() => import("./pages/dashboard/Performance"));
const MockExams = lazy(() => import("./pages/dashboard/MockExams"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const PastQuestions = lazy(() => import("./pages/dashboard/PastQuestions"));
const Report = lazy(() => import("./pages/dashboard/Report"));
const Upgrade = lazy(() => import("./pages/dashboard/Upgrade"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router basename={import.meta.env.BASE_URL}>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm font-semibold text-slate-500">Loading Study Vault...</div>}>
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
        </Suspense>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
