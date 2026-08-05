import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

// Assets
import prepimg from '../../assets/prep.jpg';
import prepimg2 from '../../assets/download.jpg'; 
import prepimg3 from '../../assets/p.jpg';

// Components
import Footer from "../../components/Footer";
import Logo from '../../components/Logo';

// Icons
import { 
  CheckCircle, 
  BookOpen, 
  Timer, 
  BarChart3, 
  Smartphone, 
  RefreshCw, 
  Zap, 
  Star,
  Menu,
  X
} from 'lucide-react';

const Home = () => {
  // --- States ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);
  
  // Ref for the analytics section to detect scroll
  const analyticsRef = useRef(null);

  const images = [prepimg, prepimg2, prepimg3];

  // --- Intersection Observer for Scroll Animations ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setAnimateStats(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.2 } 
    );

    if (analyticsRef.current) {
      observer.observe(analyticsRef.current);
    }

    return () => {
      if (analyticsRef.current) observer.unobserve(analyticsRef.current);
    };
  }, []);

  // --- Hero Image Switching ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  // --- General Scroll Reveal ---
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((entry) => {
        const windowHeight = window.innerHeight;
        const elementTop = entry.getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          entry.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Subjects", path: "/subjects" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
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
              <Link key={link.name} to={link.path} className="hover:text-blue-600 transition-colors">
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
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl py-8 px-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
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
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <span className="inline-block bg-green-100 text-green-600 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            #1 Prep Platform in Ghana
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
            Pass Your BECE With Confidence
          </h1>
          <p className="text-slate-500 mt-6 text-lg max-w-md leading-relaxed">
            Master your exams with access to 10,000+ past questions and timed mock exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link to="/signup" className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-blue-800 text-center transition">Get Started for Free</Link>
            <Link to="/login" className="border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 text-center transition text-slate-700">Login to Account</Link>
          </div>
        </div>
        
        <div className="relative reveal">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl rotate-1 h-[300px] md:h-[450px] w-full relative border-4 md:border-8 border-white bg-slate-100">
            {images.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`Slide ${index}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Animated Analytics Preview --- */}
      <section ref={analyticsRef} className="bg-slate-50/50 py-24 reveal">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-800">Track Your Path to Success</h2>
            <p className="text-slate-500 mb-10 leading-relaxed text-lg">Visual dashboards to track your strengths and weaknesses in real-time.</p>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2 text-sm font-bold">
                  <span className="text-slate-700">Mathematics</span>
                  <span className="text-green-600">85% Mastery</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    style={{ width: animateStats ? '85%' : '0%' }} 
                    className="h-full bg-green-500 transition-all duration-[2000ms] ease-out shadow-sm"
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm font-bold">
                  <span className="text-slate-700">Integrated Science</span>
                  <span className="text-orange-600">62% Mastery</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    style={{ width: animateStats ? '62%' : '0%' }} 
                    className="h-full bg-orange-500 transition-all duration-[2000ms] ease-out shadow-sm"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl p-6 md:p-8">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">KM</div>
                <div>
                  <h4 className="font-bold text-slate-800">Kofi Mensah</h4>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">Candidate #102934</p>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] text-blue-500 uppercase font-bold mb-1 tracking-wider">Mocks</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-700">24</p>
                </div>
                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                  <p className="text-[10px] text-green-500 uppercase font-bold mb-1 tracking-wider">Questions</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-600">1,240</p>
                </div>
             </div>

             <div className="h-32 flex items-end justify-between gap-2 px-2">
                {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      height: animateStats ? `${h}%` : '0%',
                      transitionDelay: animateStats ? `${i * 100}ms` : '0ms' 
                    }} 
                    className={`flex-1 rounded-t-lg transition-all duration-700 ease-out ${i === 3 ? 'bg-blue-600 shadow-lg' : 'bg-blue-200'}`}
                  ></div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* --- Trusted by Students & Parents --- */}
      <section className="max-w-7xl mx-auto py-24 px-6 reveal text-center">
        <h2 className="text-3xl font-bold mb-16 text-slate-800">Trusted by Students & Parents</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Ama Serwaa", role: "2023 BECE Candidate", text: "This platform helped me improve my Math grades from a 4 to a 1 in just two months!" },
            { name: "Mr. Boateng", role: "Parent, Kumasi", text: "As a parent, I was worried. BECE Success gave us a clear view of his progress." },
            { name: "Ebenezer Tetteh", role: "Student, Accra", text: "The explanations for Science answers are so clear. It's like having a personal tutor." }
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left flex flex-col justify-between hover:border-blue-200 transition-colors">
              <div>
                <div className="flex text-orange-400 mb-4 gap-1">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
                </div>
                <p className="italic text-slate-600 mb-8 text-sm leading-relaxed">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 font-bold text-xs uppercase">
                   {t.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">{t.name}</h5>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;