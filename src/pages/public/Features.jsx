import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Layout Components
import Footer from '../../components/Footer';
import Logo from '../../components/Logo';

// Icons
import {
  BookOpen,
  Timer,
  CheckCircle2,
  BarChart3,
  Layers,
  Smartphone,
  ArrowRight,
  Sparkles,
  FileText,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  BrainCircuit,
  Award
} from 'lucide-react';

const Features = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('past-questions');

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Subjects", path: "/subject" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  // Core Features linked directly to your dashboard
  const mainFeatures = [
    {
      id: "past-questions",
      icon: <BookOpen size={24} className="text-blue-600" />,
      title: "Past Questions Vault",
      tagline: "20+ Years of Official WAEC Questions",
      desc: "Access verified BECE past questions across all subjects with step-by-step solutions written by expert Ghanaian examiners.",
      bullets: [
        "Filter questions by subject, year, or specific topic",
        "Detailed step-by-step answer breakdowns",
        "Offline view mode for study on the go"
      ],
      badge: "20,000+ Questions",
      color: "blue"
    },
    {
      id: "mock-exams",
      icon: <Timer size={24} className="text-emerald-600" />,
      title: "Timed Mock Exams",
      tagline: "Real WAEC Exam Environment",
      desc: "Master exam pressure and timing with real-time timed mock sessions designed to mirror the actual BECE layout.",
      bullets: [
        "Auto-grading with instant result calculation",
        "Realistic WAEC countdown timer",
        "Sectional navigation & question flagging"
      ],
      badge: "Timed Practice",
      color: "emerald"
    },
    {
      id: "performance",
      icon: <BarChart3 size={24} className="text-purple-600" />,
      title: "Performance Analytics",
      tagline: "Smart Weak-Spot Detection",
      desc: "Understand your exam readiness with real-time analytics tracking topic mastery across Mathematics, Science, English, and BDT.",
      bullets: [
        "Visual mastery percentage bars per subject",
        "AI-guided weak topic identification",
        "Historical score comparison graphs"
      ],
      badge: "AI Recommendations",
      color: "purple"
    },
    {
      id: "reports",
      icon: <FileText size={24} className="text-amber-600" />,
      title: "Parent & Teacher Reports",
      tagline: "Exportable Progress Summaries",
      desc: "Generate clean summary reports to share with parents or teachers to demonstrate study consistency and growth.",
      bullets: [
        "PDF progress export with 1-click download",
        "Weekly study time and accuracy stats",
        "Subject-by-subject readiness grade"
      ],
      badge: "Exportable PDF",
      color: "amber"
    }
  ];

  const gridFeatures = [
    {
      icon: <CheckCircle2 size={22} className="text-blue-600" />,
      title: "Instant Auto-Grading",
      desc: "No waiting for markers. Get instant scores and explanations immediately after submitting objective test mocks."
    },
    {
      icon: <Layers size={22} className="text-emerald-600" />,
      title: "Subject-by-Subject Focus",
      desc: "Concentrate on specific subjects like Integrated Science, ICT, or Social Studies to turn weak spots into strengths."
    },
    {
      icon: <Smartphone size={22} className="text-purple-600" />,
      title: "Mobile First Design",
      desc: "Study seamlessly on phones, tablets, or laptops without losing your practice progress."
    }
  ];

  const steps = [
    { num: "1", title: "Choose Subject", desc: "Select your target subject" },
    { num: "2", title: "Practice Questions", desc: "Work through topical questions" },
    { num: "3", title: "Take Mock Exam", desc: "Simulate real timed tests" },
    { num: "4", title: "Review Answers", desc: "Study step-by-step solutions" },
    { num: "5", title: "Track Progress", desc: "View your analytics dashboard" },
    { num: "6", title: "Improve Scores", desc: "Target weak areas with AI guidance" }
  ];

  const faqs = [
    {
      q: "How often are the questions updated?",
      a: "Our question bank is updated continuously. We add new WAEC/BECE papers and mock sets as soon as verified solutions are published."
    },
    {
      q: "Can I use this on my Android phone?",
      a: "Yes! The platform is optimized for mobile browsers across Android and iOS, requiring minimal internet data."
    },
    {
      q: "What subjects are included in the dashboard?",
      a: "We cover all major BECE subjects including Mathematics, Integrated Science, English Language, Social Studies, BDT/Career Technology, RME, ICT, and Ghanaian Languages."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-4 md:px-6 py-2 max-w-7xl mx-auto">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <Logo />
          </Link>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`transition-colors hover:text-blue-600 ${link.name === 'Features' ? 'text-blue-600 font-bold' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-blue-600 font-semibold text-sm px-4 py-2">Login</Link>
              <Link to="/signup" className="bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition shadow-md">Get Started</Link>
            </div>
            <button className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl py-8 px-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-lg font-bold text-slate-700" onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-4">
              <Link to="/login" className="w-full text-center py-3 font-bold text-blue-700 border-2 border-blue-700 rounded-xl" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="w-full text-center py-3 font-bold bg-blue-700 text-white rounded-xl" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
              <Sparkles size={14} /> Built For BECE Candidates
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Everything You Need to Excel in BECE
            </h1>
            <p className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed">
              Practice smarter with 20+ years of past questions, timed mock exams, detailed step-by-step answers, and performance analytics designed for Ghanaian students.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link to="/signup" className="bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-blue-800 transition">
                Get Started
              </Link>
              <a href="#interactive-preview" className="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition">
                View Dashboard Features
              </a>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden border-4 border-white">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    JS
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Dashboard Overview</h4>
                    <p className="text-xs text-blue-200">Candidate #2026-BECE</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  Active Prep
                </span>
              </div>

              {/* Sample Analytics Card inside Hero */}
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Integrated Science Readiness</span>
                    <span className="text-emerald-400">88% (Grade 1)</span>
                  </div>
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[88%] rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-blue-200 uppercase font-bold">Mocks Passed</p>
                    <p className="text-2xl font-bold mt-1">18 Sets</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-blue-200 uppercase font-bold">Questions Solved</p>
                    <p className="text-2xl font-bold mt-1">1,420</p>
                  </div>
                </div>
              </div>

              {/* Floating Improvement Badge */}
              <div className="mt-6 bg-emerald-500 text-slate-950 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-lg">
                <TrendingUp size={24} className="shrink-0" />
                <span>+92% Average student score improvement after 3 months</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Interactive Core Features Section (Tabs) --- */}
      <section id="interactive-preview" className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Powerful Features for Effective Learning</h2>
          <p className="text-slate-500 mt-2 text-base">Built with input from WAEC examiners and top-performing BECE students.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {mainFeatures.map((feat) => (
            <button
              key={feat.id}
              onClick={() => setActiveTab(feat.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 ${
                activeTab === feat.id
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {feat.icon}
              {feat.title}
            </button>
          ))}
        </div>

        {/* Active Feature Detail Card */}
        {mainFeatures.map((feat) => {
          if (feat.id !== activeTab) return null;
          return (
            <div key={feat.id} className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-md grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-md uppercase">
                  {feat.badge}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">{feat.title}</h3>
                <p className="text-blue-600 font-semibold text-sm">{feat.tagline}</p>
                <p className="text-slate-500 text-base leading-relaxed">{feat.desc}</p>
                
                <div className="space-y-3 pt-2">
                  {feat.bullets.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      <span className="text-slate-700 text-sm font-semibold">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link to="/signup" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition">
                    Explore in Dashboard <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200/60 text-center flex flex-col items-center justify-center min-h-[260px]">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4">
                  {feat.icon}
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{feat.title} Overview</h4>
                <p className="text-xs text-slate-400 max-w-xs">Directly integrated into candidate dashboard accounts.</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* --- Feature Grid Cards --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {gridFeatures.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Step-by-step Journey Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Your Path to Excellence</h2>
          <p className="text-slate-500 mt-2 text-base">Six simple steps to transform your exam preparation strategy.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-700 text-white font-extrabold rounded-full flex items-center justify-center mb-4 text-sm shadow-md">
                {s.num}
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{s.title}</h4>
              <p className="text-slate-400 text-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <button
                className="w-full px-6 py-5 text-left font-bold text-slate-800 flex justify-between items-center text-sm md:text-base"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                {faq.q}
                <ChevronDown size={20} className={`transition-transform text-slate-400 ${activeFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA Banner --- */}
      <section className="max-w-7xl mx-auto px-6 my-16">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Start Preparing for BECE Success Today
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto mb-8">
            Join over 10,000 students across Ghana who are already using BECE Success to secure top grades.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-slate-100 transition">
              Get Started for Free
            </Link>
            <Link to="/pricing" className="border-2 border-blue-400 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-800/50 transition">
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;