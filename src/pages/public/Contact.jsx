import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Layout Components
import Footer from '../../components/Footer';
import Logo from '../../components/Logo';

// Icons
import {
  Mail,
  MessageSquare,
  PhoneCall,
  Building2,
  Send,
  MapPin,
  Clock,
  ChevronDown,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

const Contact = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Student',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Contact form submitted:', formData);
    alert('Thank you! Your message has been sent.');
  };

  const navLinks = [
   { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Subjects", path: "/subject" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const contactCards = [
    {
      icon: <Mail className="text-blue-600" size={22} />,
      bgColor: "bg-blue-50",
      title: "Email Us",
      desc: "Our support team responds within 24 hours to all inquiries.",
      actionText: "support@beceprep.com",
      actionLink: "mailto:support@beceprep.com",
      actionColor: "text-blue-600 hover:text-blue-700"
    },
    {
      icon: <MessageSquare className="text-emerald-600" size={22} />,
      bgColor: "bg-emerald-50",
      title: "WhatsApp",
      desc: "Instant help for students and parents on the go.",
      actionText: "Chat on WhatsApp",
      actionLink: "https://wa.me/233000000000",
      actionColor: "text-emerald-600 hover:text-emerald-700 font-bold"
    },
    {
      icon: <PhoneCall className="text-amber-600" size={22} />,
      bgColor: "bg-amber-50",
      title: "Call Support",
      desc: "Available Mon–Fri, 8:00 AM to 5:00 PM for urgent needs.",
      actionText: "+233 (0) 555 123 456",
      actionLink: "tel:+2330555123456",
      actionColor: "text-slate-800 font-bold hover:text-blue-600"
    },
    {
      icon: <Building2 className="text-indigo-600" size={22} />,
      bgColor: "bg-indigo-50",
      title: "Partnerships",
      desc: "Bulk licensing and digital lab setup for schools.",
      actionText: "School Solutions",
      actionLink: "/features#schools",
      actionColor: "text-indigo-600 hover:text-indigo-700 font-bold"
    }
  ];

  const faqs = [
    {
      q: "How to register for mock exams?",
      a: "Simply sign up for a free or pro account, navigate to the Dashboard, and select your desired subject mock exam to begin immediately."
    },
    {
      q: "Subscription pricing for schools?",
      a: "We offer tailored bulk pricing for schools with custom admin portals. Reach out via the contact form under 'School Admin' role."
    },
    {
      q: "Resetting my account password?",
      a: "Click on 'Login', select 'Forgot Password', and enter your email. An instant reset link will be sent to you."
    },
    {
      q: "Accepted payment methods in Ghana?",
      a: "We accept all major Ghana Mobile Money networks (MTN MoMo, Telecel Cash, AT Money) and local Visa/Mastercard debit cards."
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
                className={`transition-colors hover:text-blue-600 ${link.name === 'Contact' ? 'text-blue-600 font-bold' : ''}`}
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

      {/* --- Header Section --- */}
      <section className="relative bg-gradient-to-b from-blue-50/60 to-transparent pt-12 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
            Support Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            We're Here to Help You Succeed
          </h1>
          <p className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you're a student preparing for exams, a parent tracking progress, or a school looking for digital solutions, our team is ready to guide your journey to academic excellence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a href="#message-form" className="bg-blue-700 text-white px-7 py-3 rounded-xl font-bold shadow-md hover:bg-blue-800 transition">
              Send Message
            </a>
            <Link to="/signup" className="bg-white border border-slate-200 text-slate-700 px-7 py-3 rounded-xl font-bold hover:bg-slate-50 transition">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* --- Support Cards Grid --- */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{card.desc}</p>
              </div>
              <a href={card.actionLink} className={`text-sm ${card.actionColor} flex items-center gap-1 font-semibold`}>
                {card.actionText}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* --- Main Content Section (Form & Sidebar) --- */}
      <section id="message-form" className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
            <p className="text-slate-500 text-sm mb-8">Fill out the form below and our academic consultants will get back to you shortly.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Kojo Mensah"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="kojo@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+233 24 000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Your Role</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm bg-white"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                    <option value="Teacher">Teacher</option>
                    <option value="School Administrator">School Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Message</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-800 transition flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* Right Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* FAQ Accordion */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
                    <button
                      className="w-full px-5 py-4 text-left font-semibold text-slate-800 flex justify-between items-center text-sm"
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

            {/* Dark Office Box */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Our Office</h3>
              
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Oxford Street, Osu</p>
                    <p className="text-slate-400">Accra, Ghana</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Working Hours</p>
                    <p className="text-slate-400">Mon - Fri: 8:00 AM - 5:00 PM</p>
                    <p className="text-slate-400">Sat: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Follow Our Updates</p>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition text-slate-300 hover:text-white">
                    <span className="font-bold text-xs">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition text-slate-300 hover:text-white">
                    <span className="font-bold text-xs">X</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition text-slate-300 hover:text-white">
                    <span className="font-bold text-xs">in</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- Map Section --- */}
      <section className="relative w-full h-80 bg-slate-200 my-12 overflow-hidden flex items-center justify-center">
        {/* Placeholder Map Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] bg-slate-300"></div>
        
        {/* Map Location Card */}
        <div className="relative z-10 bg-white p-6 rounded-2xl shadow-2xl border border-slate-200 text-center max-w-sm mx-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <MapPin size={22} />
          </div>
          <h4 className="font-bold text-slate-900 text-base">BECE Prep Ghana HQ</h4>
          <p className="text-xs text-slate-500 mt-1">Empowering students across Osu and Greater Accra</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 mt-3 hover:underline"
          >
            Get Directions <ExternalLink size={12} />
          </a>
        </div>
      </section>

      {/* --- Bottom CTA Section --- */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Start Your BECE Success Journey?
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto mb-8">
            Join thousands of students across Ghana achieving excellence with our practice preparation system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-slate-100 transition">
              Get Started
            </Link>
            <a href="#message-form" className="border-2 border-blue-400 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-800/50 transition">
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;