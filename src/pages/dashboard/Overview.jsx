import { useQuery } from "@tanstack/react-query";
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
import { getMockAttempts } from "../../services/studyContentService";
import StatCard from "../../components/StatCard";
import SubjectCard from "../../components/SubjectCard";
import AIFocusCard from "../../components/AIFocusCard";

const SUBJECT_ICONS = {
  Mathematics: <Calculator size={20} />,
  "Mathematics (with Statistics)": <Calculator size={20} />,
  "English Language": <Languages size={20} />,
  English: <Languages size={20} />,
  "Integrated Science": <Beaker size={20} />,
  Science: <Beaker size={20} />,
  "Social Studies": <Globe size={20} />,
  "Social studies": <Globe size={20} />,
  RME: <Book size={20} />,
};

// Process mock attempts data
function processOverviewData(attempts) {
  if (!attempts || attempts.length === 0) {
    return {
      totalQuestionsAnswered: 0,
      mockExamsTaken: 0,
      averageScore: 0,
      currentStreak: 0,
      weakestSubject: "None",
      strongestSubject: "None",
      subjects: [],
      recentResults: [],
      trendData: [],
    };
  }

  // Calculate stats
  const mockCount = attempts.length;
  const avgScore = Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length);

  // Group by subject
  const subjectScores = {};
  attempts.forEach((attempt) => {
    const subject = attempt.subjectName || "Unknown";
    if (!subjectScores[subject]) {
      subjectScores[subject] = [];
    }
    subjectScores[subject].push({
      score: attempt.score || 0,
      correctCount: attempt.correctCount || 0,
      totalQuestions: attempt.totalQuestions || 0,
    });
  });

  // Calculate subject data
  const subjects = Object.entries(subjectScores).map(([name, scores]) => {
    const avgSubjectScore = Math.round(scores.reduce((s, a) => s + a.score, 0) / scores.length);
    const lastScore = scores[scores.length - 1].score;
    const mastery = avgSubjectScore;
    const status = avgSubjectScore >= 80 ? "Strong" : avgSubjectScore >= 60 ? "Average" : "Critical";

    return {
      name,
      lastScore,
      mastery,
      status,
      icon: SUBJECT_ICONS[name] || <Book size={20} />,
    };
  });

  // Get strongest and weakest subjects
  const sortedByScore = [...subjects].sort((a, b) => b.mastery - a.mastery);
  const strongestSubject = sortedByScore[0]?.name || "Unknown";
  const weakestSubject = sortedByScore[sortedByScore.length - 1]?.name || "Unknown";

  // Recent results (last 5)
  const recentResults = attempts.slice(-5).reverse().map((attempt) => {
    const daysAgo = Math.floor((new Date() - (attempt.completedAt?.toDate?.() || new Date(attempt.completedAt))) / (1000 * 60 * 60 * 24));
    const meta = daysAgo === 0 ? "Completed today" : daysAgo === 1 ? "Completed yesterday" : `Completed ${daysAgo}d ago`;

    return {
      title: `${attempt.subjectName} Mock`,
      meta,
      score: `${attempt.score}%`,
      delta: "+5 XP",
      icon: <CheckCircle2 size={18} />,
      color: attempt.score >= 60 ? "text-emerald-600 bg-emerald-50" : "text-orange-600 bg-orange-50",
    };
  });

  // Generate trend data
  const last7Attempts = attempts.slice(-7);
  const trendData = last7Attempts.map((attempt, idx) => ({
    label: `Exam ${idx + 1}`,
    height: `${Math.min((attempt.score / 100) * 100, 100)}%`,
    color: attempt.score >= 70 ? "bg-blue-700" : attempt.score >= 50 ? "bg-blue-500" : "bg-blue-300",
  }));

  // Calculate streak (consecutive days)
  let streak = 0;
  const uniqueDates = new Set();
  attempts.forEach((attempt) => {
    const date = attempt.completedAt?.toDate?.() || new Date(attempt.completedAt);
    const dateString = date.toISOString().split('T')[0];
    uniqueDates.add(dateString);
  });
  streak = Math.min(uniqueDates.size, 7); // Max 7-day streak

  // Estimate questions answered
  const totalQuestions = attempts.reduce((sum, a) => sum + (a.totalQuestions || 0), 0);

  return {
    totalQuestionsAnswered: totalQuestions,
    mockExamsTaken: mockCount,
    averageScore: avgScore,
    currentStreak: streak,
    weakestSubject,
    strongestSubject,
    subjects,
    recentResults,
    trendData: trendData.length > 0 ? trendData : generateDefaultTrend(),
  };
}

// Default trend if no data
function generateDefaultTrend() {
  return [
    { label: "Week 1", height: "38%", color: "bg-blue-200" },
    { label: "Week 2", height: "52%", color: "bg-blue-300" },
    { label: "Week 3", height: "47%", color: "bg-blue-300" },
    { label: "Week 3", height: "66%", color: "bg-blue-400" },
    { label: "Week 4", height: "80%", color: "bg-blue-700" },
    { label: "Week 4", height: "70%", color: "bg-blue-600" },
    { label: "Current", height: "85%", color: "bg-emerald-700" },
  ];
}

const Overview = () => {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "Student";

  const { data: attempts = [], isLoading } = useQuery({
    queryKey: ["mock-attempts", user?.uid],
    queryFn: () => getMockAttempts(user.uid),
    enabled: Boolean(user?.uid),
  });

  const data = processOverviewData(attempts);

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
            {data.averageScore >= 80 
              ? "You're doing great! Your consistency is paying off."
              : data.averageScore >= 60
              ? "You're making good progress. Keep it up!"
              : "Keep studying! Every attempt counts."}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
            {data.mockExamsTaken > 0
              ? `You've completed ${data.mockExamsTaken} mock${data.mockExamsTaken !== 1 ? "s" : ""} with an average score of ${data.averageScore}%.`
              : "Take your first mock exam to get started and see your progress."}
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
          label="Questions Answered"
          value={data.totalQuestionsAnswered}
          color="text-blue-600"
        />
        <StatCard
          icon={<Book className="text-emerald-700" />}
          label="Mock Exams"
          value={data.mockExamsTaken}
          color="text-emerald-700"
        />
        <StatCard
          icon={<Star className="text-red-700" />}
          label="Avg Score"
          value={`${data.averageScore}%`}
          color="text-red-700"
        />
        <StatCard
          icon={<Flame className="text-orange-500" />}
          label="Current Streak"
          value={`${data.currentStreak}-Day`}
          color="text-orange-500"
        />
        <StatCard
          icon={<TrendingDown className="text-red-500" />}
          label="Weakest Subject"
          value={data.weakestSubject.split(" ")[0]}
          color="text-red-500"
        />
        <StatCard
          icon={<TrendingUp className="text-emerald-700" />}
          label="Strongest Subject"
          value={data.strongestSubject.split(" ")[0]}
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

          {data.subjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.subjects.map((subject) => (
                <SubjectCard key={subject.name} {...subject} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Book className="mx-auto text-slate-300" size={36} />
              <p className="mt-3 text-sm font-bold text-gray-500">No subjects yet</p>
              <p className="text-sm text-gray-400">Complete mock exams to see subject breakdown</p>
            </div>
          )}
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
                {data.mockExamsTaken > 0 ? "Your progress across exams" : "No data yet"}
              </p>
            </div>
            <button className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-black text-gray-800">
              Recent
            </button>
          </div>

          <div className="flex h-72 items-end gap-3 md:gap-5">
            {data.trendData.map((bar, index) => (
              <div
                key={`${bar.label}-${index}`}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className={`${bar.color} w-full rounded-t-lg transition-all hover:opacity-80`}
                  style={{ height: bar.height }}
                  title={bar.label}
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
            {data.recentResults.length > 0 ? (
              <div className="space-y-5">
                {data.recentResults.map((result) => (
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
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-gray-500">
                No results yet. Take a mock exam to get started!
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-950">Leaderboard</h3>
              <p className="text-[10px] font-black uppercase text-blue-700">
                Region: Greater Accra
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-3">
                <span className="text-xs font-black text-blue-700">1st</span>
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
                  <p className="text-[11px] text-gray-500">{data.mockExamsTaken * 100} XP</p>
                </div>
                <Trophy size={16} className="text-blue-700" />
              </div>
              <div className="flex items-center gap-3 p-3">
                <span className="text-xs font-black text-gray-700">2nd</span>
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
                  -{(data.mockExamsTaken * 100) - 2480} XP
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
