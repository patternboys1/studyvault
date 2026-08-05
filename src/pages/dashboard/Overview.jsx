import {
  ArrowRight,
  Beaker,
  Book,
  Calculator,
  CheckCircle2,
  Clock3,
  FileText,
  Flame,
  Globe,
  Languages,
  PlayCircle,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard";
import SubjectCard from "../../components/SubjectCard";
import AIFocusCard from "../../components/AIFocusCard";

const Overview = () => {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "Student";

  const subjects = [
    {
      name: "Mathematics",
      lastScore: 92,
      mastery: 85,
      status: "Strong",
      icon: <Calculator size={20} />,
    },
    {
      name: "English Language",
      lastScore: 76,
      mastery: 72,
      status: "Average",
      icon: <Languages size={20} />,
    },
    {
      name: "Integrated Science",
      lastScore: 58,
      mastery: 55,
      status: "Critical",
      icon: <Beaker size={20} />,
    },
    {
      name: "Social Studies",
      lastScore: 81,
      mastery: 79,
      status: "Strong",
      icon: <Globe size={20} />,
    },
  ];

  const trendBars = [
    { label: "Week 1", height: "38%", color: "bg-blue-200" },
    { label: "Week 2", height: "52%", color: "bg-blue-300" },
    { label: "Week 3", height: "47%", color: "bg-blue-300" },
    { label: "Week 3", height: "66%", color: "bg-blue-400" },
    { label: "Week 4", height: "80%", color: "bg-blue-700" },
    { label: "Week 4", height: "70%", color: "bg-blue-600" },
    { label: "Current", height: "85%", color: "bg-emerald-700" },
  ];

  const recentResults = [
    {
      title: "English Mock Alpha",
      meta: "Completed 2h ago",
      score: "88%",
      delta: "+5 XP",
      icon: <CheckCircle2 size={18} />,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Math Practice Unit 4",
      meta: "Completed Yesterday",
      score: "94%",
      delta: "+8 XP",
      icon: <Clock3 size={18} />,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-blue-700 text-white shadow-xl shadow-blue-100">
        <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-35 md:block" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-blue-900/50 to-transparent md:block" />

        <div className="relative z-10 max-w-3xl px-6 py-8 md:px-12 md:py-11">
          <p className="text-sm font-semibold text-blue-100">
            Welcome back, {firstName}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
            You're doing great! Your consistency is paying off.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
            You have 3 new recommended questions based on your last Science
            mock.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-blue-700 shadow-md transition hover:bg-blue-50">
              <PlayCircle size={18} />
              Continue Practice
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15">
              <Sparkles size={18} />
              Take Mock Exam
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={<FileText className="text-blue-600" />}
          label="Questions Practiced"
          value="1,204"
          color="text-blue-600"
        />
        <StatCard
          icon={<Book className="text-emerald-700" />}
          label="Mock Exams"
          value="15"
          color="text-emerald-700"
        />
        <StatCard
          icon={<Star className="text-red-700" />}
          label="Avg Score"
          value="78%"
          color="text-red-700"
        />
        <StatCard
          icon={<Flame className="text-orange-500" />}
          label="Current Streak"
          value="5-Day"
          color="text-orange-500"
        />
        <StatCard
          icon={<TrendingDown className="text-red-500" />}
          label="Weakest Subject"
          value="Science"
          color="text-red-500"
        />
        <StatCard
          icon={<TrendingUp className="text-emerald-700" />}
          label="Strongest Subject"
          value="Math"
          color="text-emerald-700"
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-950">
              Subject Performance
            </h3>
            <button className="flex items-center gap-1 text-sm font-black text-blue-700 hover:underline">
              View Detailed Report <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {subjects.map((subject) => (
              <SubjectCard key={subject.name} {...subject} />
            ))}
          </div>
        </div>

        <AIFocusCard />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7 xl:col-span-2">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-950">
                Analytics & Trends
              </h3>
              <p className="text-sm text-gray-500">
                Your progress over the last 30 days
              </p>
            </div>
            <button className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-black text-gray-800">
              Last 30 Days
            </button>
          </div>

          <div className="flex h-72 items-end gap-3 md:gap-5">
            {trendBars.map((bar, index) => (
              <div
                key={`${bar.label}-${index}`}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className={`${bar.color} w-full rounded-t-lg transition-all`}
                  style={{ height: bar.height }}
                />
                <p className="mt-4 text-center text-[10px] font-black uppercase text-gray-500">
                  {bar.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-bold text-gray-950">
              Recent Results
            </h3>
            <div className="space-y-5">
              {recentResults.map((result) => (
                <div
                  key={result.title}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${result.color}`}
                    >
                      {result.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-400">{result.meta}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-700">
                      {result.score}
                    </p>
                    <p className="text-xs font-bold text-blue-600">
                      {result.delta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-950">Top Students</h3>
              <p className="text-[10px] font-black uppercase text-blue-700">
                Region: Greater Accra
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-3">
                <span className="text-xs font-black text-blue-700">12</span>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.displayName || "Study Vault"
                  )}&background=1d4ed8&color=fff`}
                  alt=""
                  className="h-9 w-9 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-gray-950">
                    {user?.displayName || "Kwame Mensah"} (You)
                  </p>
                  <p className="text-[11px] text-gray-500">2,450 XP</p>
                </div>
                <Trophy size={16} className="text-blue-700" />
              </div>
              <div className="flex items-center gap-3 p-3">
                <span className="text-xs font-black text-gray-700">11</span>
                <img
                  src="https://ui-avatars.com/api/?name=Abena+Serwaa&background=047857&color=fff"
                  alt=""
                  className="h-9 w-9 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-gray-950">
                    Abena Serwaa
                  </p>
                  <p className="text-[11px] text-gray-500">2,480 XP</p>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  Ahead
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
