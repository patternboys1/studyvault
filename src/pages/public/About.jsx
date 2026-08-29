import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Layout Components
import Footer from '../../components/Footer';
import Logo from '../../components/Logo';

// Icons
import {
  BookOpen,
  Timer,
  BarChart3,
  Layers,
  FileText,
  Sparkles,
  Target,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Subjects", path: "/subject" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
     { name: "About", path: "/about" },
  ];

  const whatWeOffer = [
    {
      icon: <BookOpen className="text-blue-600" size={22} />,
      bgColor: "bg-blue-50",
      title: "Past Questions",
      desc: "Comprehensive database of over 20 years of official BECE papers with detailed answers."
    },
    {
      icon: <Timer className="text-emerald-600" size={22} />,
      bgColor: "bg-emerald-50",
      title: "Mock Exams",
      desc: "Simulate the actual BECE environment with timed test sessions and instant results."
    },
    {
      icon: <BarChart3 className="text-amber-600" size={22} />,
      bgColor: "bg-amber-50",
      title: "Performance Analytics",
      desc: "Track your scores over time and see exactly where you need to improve."
    },
    {
      icon: <Layers className="text-purple-600" size={22} />,
      bgColor: "bg-purple-50",
      title: "Subject Learning",
      desc: "Break down your study sessions by core and elective subjects for focused learning."
    },
    {
      icon: <FileText className="text-emerald-600" size={22} />,
      bgColor: "bg-emerald-50",
      title: "Progress Reports",
      desc: "Detailed breakdowns of weekly performance to share with parents and teachers."
    },
    {
      icon: <Sparkles className="text-indigo-600" size={22} />,
      bgColor: "bg-indigo-50",
      title: "Personalized Recs",
      desc: "Get smart suggestions on weak topics to focus revision on your weak areas."
    }
  ];

  const trustPoints = [
    {
      title: "Updated Curriculum",
      desc: "Content regularly updated to match the latest WAEC & GES syllabus."
    },
    {
      title: "Instant Grading",
      desc: "No more waiting for results. Get immediate feedback on every practice test."
    },
    {
      title: "Mobile-First Access",
      desc: "Study on-the-go with our fully responsive web platform on any mobile device."
    }
  ];

  const stats = [
    { value: "50,000+", label: "Questions Solved" },
    { value: "1M+", label: "Questions Practiced" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "35%", label: "Score Improvement" }
  ];

  const teamMembers = [
    {
      name: "Kwame Mensah",
      role: "Founder & Lead Developer",
      badge: "FOUNDER",
      badgeColor: "bg-blue-600",
      bio: "Veteran educator with 10 years of Ghanaian curriculum experience."
    },
    {
      name: "Dr. Abena Mensah",
      role: "Head of Content",
      badge: "EDUCATOR",
      badgeColor: "bg-emerald-600",
      bio: "Curriculum specialist focused on JHS excellence and WAEC standards."
    },
    {
      name: "Prof. Kofi Boateng",
      role: "Strategic Advisor",
      badge: "ADVISOR",
      badgeColor: "bg-amber-700",
      bio: "Advising on STEM assessment metrics and nationwide BECE benchmarks."
    },
    {
      name: "Yaa Appiah",
      role: "Lead UI/UX Designer",
      badge: "DESIGNER",
      badgeColor: "bg-blue-700",
      bio: "Crafting accessible, student-first digital learning interfaces."
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
                className="transition-colors hover:text-blue-600"
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
              About Our Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Empowering BECE Students to Achieve Academic Success
            </h1>
            <p className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed max-w-xl">
              BECE Prep Ghana helps students prepare smarter with past questions, mock exams, detailed solutions, and performance tracking.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link to="/signup" className="bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-blue-800 transition">
                Get Started
              </Link>
              <Link to="/features" className="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition">
                Explore Features
              </Link>
            </div>
          </div>

          {/* Graphic Visual Box */}
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-[2.5rem] p-8 border-4 border-white shadow-2xl min-h-[340px] flex items-center justify-center text-center relative overflow-hidden">
              <div className="space-y-4 max-w-xs">
                <div className="w-20 h-20 bg-blue-700 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <BookOpen size={40} />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Student-First Learning</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Tailored specifically for Junior High School students across all 16 regions of Ghana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Mission & Story Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Mission Box */}
          <div className="bg-blue-50/60 p-8 md:p-10 rounded-3xl border border-blue-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-400/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our mission is to give every BECE student the tools, confidence, and practice needed to excel. We are focused on improving BECE pass rates and making quality preparation accessible across Ghana, regardless of location or economic background.
              </p>
            </div>
          </div>

          {/* Story Box */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Our Story</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                BECE Prep Ghana was born from a simple observation: JHS students often struggle to find comprehensive, up-to-date, and affordable study materials for their exams. Traditional book revisions tend to be outdated and offer no feedback.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                We solved this by building a digital platform that brings prep materials to the student's device. By combining years of past papers with instant grading and detailed explanations, we've created a preparation hub that adapts to each learner's unique pace.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- What We Offer Grid Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">What We Offer</h2>
          <p className="text-slate-500 mt-2 text-base">A comprehensive suite of digital tools designed specifically for the Ghanaian JHS curriculum.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatWeOffer.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Why Students & Parents Trust Us Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-sm grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 bg-gradient-to-tr from-slate-900 to-indigo-950 rounded-2xl p-8 text-white min-h-[300px] flex items-center justify-center">
            <div className="text-center space-y-3">
              <ShieldCheck size={48} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Trusted Standards</h3>
              <p className="text-xs text-slate-300">Verified by experienced JHS teachers and WAEC examiners.</p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Why Students & Parents Trust Us</h2>

            <div className="space-y-6">
              {trustPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">{pt.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- Blue Stats Bar --- */}
      <section className="bg-blue-700 text-white py-14 px-6 my-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, index) => (
            <div key={index}>
              <p className="text-4xl md:text-5xl font-extrabold mb-1">{s.value}</p>
              <p className="text-blue-100 text-xs md:text-sm font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Meet the Minds Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Meet the Minds Behind Your Success</h2>
          <p className="text-slate-500 mt-2 text-base">Our diverse team of experts is dedicated to transforming preparation through technology and pedagogy.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-700 text-white font-extrabold text-xl flex items-center justify-center mb-4 shadow-md">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className={`text-[10px] font-extrabold text-white uppercase px-3 py-1 rounded-full mb-2 ${member.badgeColor}`}>
                {member.badge}
              </span>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{member.name}</h3>
              <p className="text-xs text-slate-400 mb-4">{member.role}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Our Future Vision Banner --- */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <span className="inline-block bg-slate-100 text-slate-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          The Road Ahead
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Our Future Vision</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          We're not stopping at WAEC questions. We are currently expanding our platform to include interactive AI tutors that can answer specific student doubts in real-time, personalized AI learning paths, and expansion into WASSCE preparation.
        </p>
      </section>

      {/* --- CTA Section --- */}
      <section className="max-w-7xl mx-auto px-6 my-16">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Join the Future of BECE Preparation
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/signup" className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-slate-100 transition">
              Start Free Trial
            </Link>
            <Link to="/pricing" className="border-2 border-blue-400 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-800/50 transition">
              Explore Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;