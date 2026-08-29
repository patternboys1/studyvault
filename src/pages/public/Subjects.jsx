import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Layout Components
import Footer from '../../components/Footer';
import Logo from '../../components/Logo';

// Icons
import {
  Calculator,
  BookOpen,
  Atom,
  Globe2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  Target,
  BarChart2
} from 'lucide-react';

const Subjects = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [activeFaq, setActiveFaq] = useState(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Subjects", path: "/subject" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  // Core BECE Subjects
  const coreSubjects = [
    {
      id: "math",
      title: "Mathematics",
      icon: <Calculator className="text-blue-600" size={24} />,
      bgColor: "bg-blue-50",
      description: "Master formula derivations, plane geometry, vectors, and algebra step-by-step.",
      questionsCount: "500+",
      mocksCount: "12 Mock Sets",
      mastery: 72,
      masteryColor: "bg-emerald-500",
      badge: "Core Subject"
    },
    {
      id: "english",
      title: "English Language",
      icon: <BookOpen className="text-amber-600" size={24} />,
      bgColor: "bg-amber-50",
      description: "Enhance your vocabulary, comprehension, formal essay structures, and grammar rules.",
      questionsCount: "500+",
      mocksCount: "10 Mock Sets",
      mastery: 64,
      masteryColor: "bg-emerald-500",
      badge: "Core Subject"
    },
    {
      id: "science",
      title: "Integrated Science",
      icon: <Atom className="text-emerald-600" size={24} />,
      bgColor: "bg-emerald-50",
      description: "Understand biology, chemistry concepts, physics calculations, and agricultural processes.",
      questionsCount: "500+",
      mocksCount: "15 Mock Sets",
      mastery: 83,
      masteryColor: "bg-emerald-500",
      badge: "Core Subject"
    },
    {
      id: "social",
      title: "Social Studies",
      icon: <Globe2 className="text-indigo-600" size={24} />,
      bgColor: "bg-indigo-50",
      description: "Explore Ghanaian history, social environment, governance, and economic development.",
      questionsCount: "500+",
      mocksCount: "11 Mock Sets",
      mastery: 42,
      masteryColor: "bg-amber-500",
      badge: "Core Subject"
    }
  ];

  // Topical Breakdown Data for Deep Dive Section
  const topicalBreakdown = {
    math: [
      { name: "Algebra & Equations", status: "82% Mastery", level: "high", color: "bg-emerald-500", desc: "Top score in past 5 mock sets" },
      { name: "Geometry & Trigonometry", status: "45% Mastery", level: "low", color: "bg-amber-500", desc: "Needs practice in circle theorems" },
      { name: "Statistics & Probability", status: "78% Mastery", level: "high", color: "bg-emerald-500", desc: "Solid performance on bar charts" },
      { name: "Vectors & Transformations", status: "89% Mastery", level: "high", color: "bg-emerald-500", desc: "Excellent overall understanding" }
    ],
    english: [
      { name: "Comprehension & Summary", status: "70% Mastery", level: "high", color: "bg-emerald-500", desc: "Good context interpretation" },
      { name: "Formal & Informal Letters", status: "85% Mastery", level: "high", color: "bg-emerald-500", desc: "Strong structural layout" },
      { name: "Grammar & Register", status: "50% Mastery", level: "medium", color: "bg-amber-500", desc: "Focus on prepositions & tenses" }
    ],
    science: [
      { name: "Cells & Life Processes", status: "92% Mastery", level: "high", color: "bg-emerald-500", desc: "Consistently scoring Grade 1" },
      { name: "Matter & Compounds", status: "80% Mastery", level: "high", color: "bg-emerald-500", desc: "Solid chemical formula grasp" },
      { name: "Electronics & Circuits", status: "75% Mastery", level: "high", color: "bg-emerald-500", desc: "Good diagram analysis" }
    ],
    social: [
      { name: "Our Culture & Heritage", status: "65% Mastery", level: "medium", color: "bg-amber-500", desc: "Review state institutions" },
      { name: "Governance & Politics", status: "38% Mastery", level: "low", color: "bg-red-500", desc: "Needs immediate revision" },
      { name: "Economic Development", status: "48% Mastery", level: "medium", color: "bg-amber-500", desc: "Focus on trade & resources" }
    ]
  };

  const faqs = [
    {
      q: "How often are past questions updated?",
      a: "We add verified WAEC exam questions annually right after official release, along with comprehensive solutions drafted by examiners."
    },
    {
      q: "Can I practice offline?",
      a: "Yes! Your downloaded mock papers and topical questions remain accessible even when your internet connection drops."
    },
    {
      q: "Is the exam format the same as the real BECE?",
      a: "Our mock exams strictly replicate WAEC timing, question distribution, and marking rubrics for accurate performance prediction."
    },
    {
      q: "Do you cover all BECE subjects?",
      a: "We cover all compulsory core subjects (Mathematics, English, Science, Social Studies) plus elective subjects like ICT, BDT, RME, and Ghanaian Languages."
    }
  ];

  const activeTopics = topicalBreakdown[selectedSubject] || topicalBreakdown.math;
  const currentSubjectObj = coreSubjects.find(s => s.id === selectedSubject) || coreSubjects[0];

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
                className={`transition-colors hover:text-blue-600 ${link.name === 'Subjects' ? 'text-blue-600 font-bold' : ''}`}
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
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
              Subject Mastery Hub
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Master Every BECE Subject
            </h1>
            <p className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed max-w-xl">
              Prepare confidently with subject-specific past questions, mock exams, step-by-step solutions, and real-time performance tracking designed for the Ghanaian curriculum.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link to="/signup" className="bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-blue-800 transition">
                Start Learning
              </Link>
              <a href="#core-subjects" className="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition">
                Take Mock Exam
              </a>
            </div>
          </div>

          {/* Dynamic Subject Banner Graphic */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-700 to-teal-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border-4 border-white min-h-[320px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
                  WAEC Aligned
                </span>
                <span className="bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={14} /> Overall Readiness
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Ghana BECE Syllabus</h3>
                <p className="text-emerald-100 text-sm max-w-sm">Structured coverage across compulsory core subjects and electives.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-200 font-bold uppercase">Average Pass Rate</p>
                  <p className="text-3xl font-extrabold text-white">84%</p>
                </div>
                <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center text-emerald-300">
                  <BarChart2 size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Core Subjects Grid Section --- */}
      <section id="core-subjects" className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Core Subjects</h2>
          <p className="text-slate-500 mt-2 text-base">Choose a subject to begin target topic practice. Each module is aligned with the official GES syllabus.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreSubjects.map((sub) => (
            <div 
              key={sub.id} 
              onClick={() => setSelectedSubject(sub.id)}
              className={`bg-white p-6 rounded-3xl border transition cursor-pointer flex flex-col justify-between relative ${
                selectedSubject === sub.id 
                  ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-lg' 
                  : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${sub.bgColor} rounded-2xl flex items-center justify-center`}>
                    {sub.icon}
                  </div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                    {sub.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg mb-2">{sub.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">{sub.description}</p>

                <div className="space-y-1.5 text-xs text-slate-500 font-medium mb-6">
                  <div className="flex justify-between">
                    <span>Question Bank:</span>
                    <span className="font-bold text-slate-800">{sub.questionsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mock Exams:</span>
                    <span className="font-bold text-slate-800">{sub.mocksCount}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">Mastery</span>
                    <span className="text-slate-900">{sub.mastery}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${sub.masteryColor}`} style={{ width: `${sub.mastery}%` }}></div>
                  </div>
                </div>

                <button 
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                    selectedSubject === sub.id
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Practice Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Deep Dive: Selected Subject Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-sm">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Topical Breakdown
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
              Deep Dive: {currentSubjectObj.title}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Every subject is broken down into granular topics so students and parents can pinpoint exact progress in detail.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* AI Recommendation Cards Left */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-blue-50/70 border border-blue-100 p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
                  <Brain size={18} />
                  <span>AI Recommendation</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus revision on geometry theorems. Solving 15 targeted questions today will boost your math mastery score by +8%.
                </p>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Daily Goal</span>
                  <span className="text-xs text-slate-400">15/20 Mins</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">Complete Section B Practice</p>
                <p className="text-xs text-slate-400">Paper 2 theory questions breakdown available.</p>
              </div>
            </div>

            {/* Topical Progress Bars Right */}
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
              {activeTopics.map((topic, index) => (
                <div key={index} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">{topic.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${topic.color}`}>
                      {topic.status}
                    </span>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden my-3">
                    <div 
                      className={`h-full ${topic.color}`} 
                      style={{ width: topic.status.split('%')[0] + '%' }}
                    ></div>
                  </div>

                  <p className="text-xs text-slate-500">{topic.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- Personalized Learning Paths Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-tr from-slate-800 to-slate-900 rounded-3xl p-8 text-white relative shadow-xl overflow-hidden min-h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 bg-blue-600/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">Smart Adaptive Engine</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Automatically adjusts practice questions based on candidate performance to fix weak spots systematically.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Personalized Learning Paths</h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Our AI engine analyzes your mock results to create a custom study plan that adapts to your learning speed and addresses your specific knowledge gaps.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">AI Recommendations</h4>
                  <p className="text-slate-500 text-xs">Targeted practice questions focus on missed topics from previous tests.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Mastery Score</h4>
                  <p className="text-slate-500 text-xs">Visual indicators show your readiness level for Grade 1 status in every subject.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Comparative Benchmarking</h4>
                  <p className="text-slate-500 text-xs">See how your scores compare against national candidate benchmarks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Why Subject-Focused Prep Works Banner --- */}
      <section className="bg-blue-700 text-white py-16 px-6 my-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">Why Subject-Focused Prep Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-800/60 p-8 rounded-2xl border border-blue-600">
              <h3 className="font-bold text-lg text-white mb-2">Focused Revision</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Stop wasting time on concepts you already know. Practice only what needs improvement.
              </p>
            </div>

            <div className="bg-blue-800/60 p-8 rounded-2xl border border-blue-600">
              <h3 className="font-bold text-lg text-white mb-2">Score Targeting</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Identify precisely what scores are required to land top Grade 1s across all core subjects.
              </p>
            </div>

            <div className="bg-blue-800/60 p-8 rounded-2xl border border-blue-600">
              <h3 className="font-bold text-lg text-white mb-2">Gap Identification</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Our analytics light up specific topic gaps so you can ask teachers exact questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Student Reviews & FAQ Side-by-Side Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Testimonials Column */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What Students Say</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-slate-600 text-sm italic leading-relaxed mb-4">
                  "BECE Prep Ghana helped me pass my Integrated Science paper easily. The topic breakdown showed me exactly what to study!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center text-sm">
                    AA
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Akosua Amoah</h4>
                    <p className="text-slate-400 text-xs">JHS 3 Candidate, Kumasi</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-slate-600 text-sm italic leading-relaxed mb-4">
                  "The subject-by-subject mocks showed me my weak spots in Math. I moved from Grade 4 to Grade 1 after 2 months."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center text-sm">
                    SK
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Seth Kwakye</h4>
                    <p className="text-slate-400 text-xs">JHS 3 Candidate, Accra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Questions Column */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    className="w-full px-5 py-4 text-left font-bold text-slate-800 flex justify-between items-center text-sm"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    {faq.q}
                    <ChevronDown size={18} className={`transition-transform text-slate-400 ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === index && (
                    <div className="px-5 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="max-w-7xl mx-auto px-6 my-16">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Choose Your Subject and Start Excelling Today
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto mb-8">
            Join thousands of students across Ghana who are increasing readiness in all 4 core BECE subjects.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#core-subjects" className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-slate-100 transition">
              Practice Subjects
            </a>
            <Link to="/signup" className="border-2 border-blue-400 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-800/50 transition">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Subjects;