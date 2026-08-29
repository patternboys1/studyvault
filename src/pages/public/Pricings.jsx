import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Layout Components
import Footer from '../../components/Footer';
import Logo from '../../components/Logo';

// Icons
import {
  ArrowRight,
  Check,
  Crown,
  FileQuestion,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
  TrendingUp,
  Menu,
} from 'lucide-react';

const pricingPlans = [
  {
    id: "free",
    name: "Free Plan",
    description: "Perfect for getting started",
    price: "0",
    period: "Forever",
    color: "slate",
    buttonText: "Get Started Free",
    buttonLink: "/signup",
    badge: null,
    features: [
      { text: "3 mock exams per month", included: true },
      { text: "Basic performance tracking", included: true },
      { text: "Limited past questions (2020-2021)", included: true },
      { text: "Study calendar", included: true },
      { text: "Monthly summary reports", included: false },
      { text: "AI focus recommendations", included: false },
      { text: "Detailed question explanations", included: false },
      { text: "Priority support", included: false },
      { text: "Parent progress reports", included: false },
    ],
  },
  {
    id: "monthly",
    name: "Pro Monthly",
    description: "Best for consistent preparation",
    price: "49",
    period: "month",
    color: "blue",
    buttonText: "Start Monthly",
    buttonLink: "/signup?plan=monthly",
    badge: null,
    features: [
      { text: "Unlimited mock exams", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Full past question library", included: true },
      { text: "AI-powered focus areas", included: true },
      { text: "Detailed exam readiness reports", included: true },
      { text: "Topic-wise explanations", included: true },
      { text: "Priority support", included: true },
      { text: "Parent progress reports", included: false },
      { text: "Cancel anytime", included: true },
    ],
  },
  {
    id: "yearly",
    name: "Pro Yearly",
    description: "Maximum savings & commitment",
    price: "499",
    period: "year",
    color: "emerald",
    buttonText: "Get Yearly Access",
    buttonLink: "/signup?plan=yearly",
    badge: "Save 16%",
    featured: true,
    features: [
      { text: "Unlimited mock exams", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Full past question library", included: true },
      { text: "AI-powered focus recommendations", included: true },
      { text: "Detailed exam readiness reports", included: true },
      { text: "Topic-wise explanations", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Parent progress reports (3 exports/month)", included: true },
      { text: "Early access to new papers", included: true },
    ],
  },
];

const comparison = [
  ["Mock exams per month", "3", "Unlimited", "Unlimited"],
  ["Past question years", "2020-2021", "All available", "All available"],
  ["AI recommendations", "No", "Yes", "Yes"],
  ["Performance reports", "Monthly only", "Unlimited", "Unlimited"],
  ["Question explanations", "No", "Yes", "Yes"],
  ["Parent sharing", "No", "No", "Yes"],
  ["Priority support", "No", "Yes", "Yes"],
];

const Pricing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Subjects", path: "/subject" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-4 md:px-6 py-2 max-w-7xl mx-auto">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <Logo />
          </Link>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className=" hover:text-blue-600 transition-colors">
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
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl py-8 px-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-10">
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
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-8 text-white shadow-xl md:p-16">
          <GraduationCap
            size={300}
            className="absolute -right-12 top-2 hidden text-white/10 md:block"
          />
          <Sparkles size={40} className="absolute left-8 top-8 text-blue-300/20" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-100 mb-6">
              <Crown size={14} />
              Flexible Pricing
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Unlock Your Full BECE Potential Today
            </h1>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-blue-100">
              From free practice to unlimited access—choose the plan that fits your study goals. AI recommendations, detailed analytics, and full exam papers await.
            </p>
          </div>
        </div>
      </section>

      {/* --- Pricing Cards Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Plans For Every Student</h2>
          <p className="mt-3 text-slate-500 text-base md:text-lg">Start free or upgrade for unlimited practice and expert insights</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* --- Benefits Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Upgrade?</h2>
          <p className="mt-2 text-slate-500">Access premium features designed explicitly for BECE exam success</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <BenefitCard
            icon={<FileQuestion size={24} />}
            title="Unlimited Practice"
            body="Take as many subject mocks and past paper sessions as you need to master every single topic."
          />
          <BenefitCard
            icon={<Sparkles size={24} />}
            title="AI-Powered Focus"
            body="Get intelligent topic recommendations tailored to your performance history and weakest areas."
          />
          <BenefitCard
            icon={<Trophy size={24} />}
            title="Detailed Reports"
            body="Track readiness scores, subject strengths, weak spots, and full performance history over time."
          />
        </div>
      </section>

      {/* --- Detailed Comparison Table --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <PlanComparison />
      </section>

      {/* --- Security Note --- */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-blue-50/70 border border-blue-100 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Secure Payment & Instant Access</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                All transactions are encrypted and processed through local secure gateways (Mobile Money & Cards). Upgrade or adjust your plan anytime with immediate access to premium materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function PricingCard({ plan }) {
  const colorClasses = {
    slate: {
      bg: "bg-white",
      border: "border-slate-200",
      badge: "bg-slate-100 text-slate-700",
      button: "bg-slate-900 hover:bg-slate-800 text-white",
      accent: "text-slate-800",
    },
    blue: {
      bg: "bg-white",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      button: "bg-blue-700 hover:bg-blue-800 text-white shadow-md",
      accent: "text-blue-700",
    },
    emerald: {
      bg: "bg-gradient-to-b from-slate-950 to-slate-900",
      border: "border-emerald-500",
      badge: "bg-emerald-500 text-white",
      button: "bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-lg",
      accent: "text-emerald-400",
    },
  };

  const colors = colorClasses[plan.color];

  return (
    <article
      className={`relative rounded-3xl border-2 ${colors.border} ${colors.bg} p-8 shadow-lg flex flex-col justify-between transition-all hover:shadow-xl ${
        plan.featured ? "lg:-translate-y-2 lg:shadow-2xl" : ""
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className={`rounded-full ${colors.badge} px-4 py-1 text-xs font-bold tracking-wide uppercase shadow-sm`}>
            {plan.badge}
          </div>
        </div>
      )}

      <div>
        {/* Header */}
        <div>
          <h3 className={`text-xl font-bold ${plan.featured ? "text-emerald-400" : colors.accent}`}>
            {plan.name}
          </h3>
          <p className={`mt-1 text-sm ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>
            {plan.description}
          </p>
        </div>

        {/* Price display */}
        <div className="mt-6 flex items-baseline gap-2">
          <span className={`text-4xl md:text-5xl font-extrabold ${plan.featured ? "text-white" : "text-slate-900"}`}>
            GHS {plan.price}
          </span>
          <span className={`text-sm font-semibold ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>
            /{plan.period}
          </span>
        </div>

        {/* CTA */}
        <Link
          to={plan.buttonLink}
          className={`mt-8 w-full rounded-xl px-5 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition ${colors.button}`}
        >
          {plan.buttonText}
          <ArrowRight size={16} />
        </Link>

        {/* Features itemization */}
        <div className="mt-8 space-y-3.5 border-t border-slate-200/20 pt-8">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {feature.included ? (
                <Check
                  size={18}
                  className={`shrink-0 font-bold ${
                    plan.featured ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              ) : (
                <X size={18} className="shrink-0 text-slate-300" />
              )}
              <span
                className={`text-sm font-medium ${
                  feature.included
                    ? plan.featured
                      ? "text-slate-100"
                      : "text-slate-800"
                    : plan.featured
                      ? "text-slate-500"
                      : "text-slate-400 line-through"
                }`}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function BenefitCard({ icon, title, body }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-blue-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
    </article>
  );
}

function PlanComparison() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Detailed Comparison</h3>
          <p className="text-sm text-slate-500">
            Compare features across each available tier
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Feature
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Free
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Pro Monthly
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-blue-700">
                Pro Yearly ⭐
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 transition hover:bg-slate-50/50"
              >
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                  {row[0]}
                </td>
                <td className="px-4 py-4 text-center text-sm text-slate-500">
                  {row[1]}
                </td>
                <td className="px-4 py-4 text-center text-sm font-semibold text-blue-700">
                  {row[2]}
                </td>
                <td className="px-4 py-4 text-center text-sm font-bold text-emerald-600">
                  {row[3]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100">
        <p className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <span>✨</span> Yearly plan includes early access to new exam papers and dedicated support.
        </p>
      </div>
    </article>
  );
}

export default Pricing;