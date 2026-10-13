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
import { Link, useNavigate } from "react-router-dom";
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

const parseAttemptDate = (value) => {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
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

  const orderedAttempts = [...attempts].sort((first, second) => {
    const firstDate = parseAttemptDate(first.completedAt)?.getTime() || 0;
    const secondDate = parseAttemptDate(second.completedAt)?.getTime() || 0;
    return secondDate - firstDate;
  });

  // Calculate stats
  const mockCount = orderedAttempts.length;
  const avgScore = Math.round(orderedAttempts.reduce((sum, attempt) => sum + (Number(attempt.score) || 0), 0) / orderedAttempts.length);

  // Group by subject
  const subjectScores = {};
  orderedAttempts.forEach((attempt) => {
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
    const lastScore = scores[0].score;
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
  const recentResults = orderedAttempts.slice(0, 5).map((attempt, index) => {
    const completedAt = parseAttemptDate(attempt.completedAt);
    const daysAgo = completedAt ? Math.max(0, Math.floor((new Date() - completedAt) / (1000 * 60 * 60 * 24))) : 0;
    const meta = daysAgo === 0 ? "Completed today" : daysAgo === 1 ? "Completed yesterday" : `Completed ${daysAgo}d ago`;
    const previousAttempt = orderedAttempts
      .slice(index + 1)
      .find((olderAttempt) => olderAttempt.subjectName === attempt.subjectName);
    const score = Number(attempt.score) || 0;
    const scoreDifference = previousAttempt ? score - (Number(previousAttempt.score) || 0) : null;

    return {
      id: attempt.id,
      title: `${attempt.subjectName || "Mock"} Mock`,
      meta,
      score: `${score}%`,
      delta: scoreDifference === null
        ? "First attempt"
        : `${scoreDifference > 0 ? "+" : ""}${scoreDifference} pts vs last`,
      icon: <CheckCircle2 size={18} />,
      color: score >= 60 ? "text-emerald-600 bg-emerald-50" : "text-orange-600 bg-orange-50",
    };
  });

  const trendData = orderedAttempts.slice(0, 7).reverse().map((attempt, idx) => ({
    label: `Exam ${idx + 1}`,
    height: `${Math.max(0, Math.min(Number(attempt.score) || 0, 100))}%`,
    score: Number(attempt.score) || 0,
    color: Number(attempt.score) >= 70 ? "bg-blue-700" : Number(attempt.score) >= 50 ? "bg-blue-500" : "bg-blue-300",
  }));

  // Calculate streak (consecutive days)
  let streak = 0;
  const uniqueDates = new Set();
  orderedAttempts.forEach((attempt) => {
    const date = parseAttemptDate(attempt.completedAt);
    if (!date) return;
    const dateString = date.toISOString().split("T")[0];
    uniqueDates.add(dateString);
  });
  streak = Math.min(uniqueDates.size, 7); // Max 7-day streak

  // Estimate questions answered
  const totalQuestions = orderedAttempts.reduce((sum, attempt) => sum + (Number(attempt.totalQuestions) || 0), 0);

  return {
    totalQuestionsAnswered: totalQuestions,
    mockExamsTaken: mockCount,
    averageScore: avgScore,
    currentStreak: streak,
    weakestSubject,
    strongestSubject,
    subjects,
    recentResults,
    trendData,
  };
}

async function getLeaderboard(user) {
  const endpoint = import.meta.env.VITE_LEADERBOARD_ENDPOINT
    || "https://us-central1-bece-prep.cloudfunctions.net/leaderboard";
  const token = await user.getIdToken();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Unable to load leaderboard.");
  }

  return data;
}

const Overview = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(" ")[0] || "Student";

  const { data: attempts = [], isLoading } = useQuery({
    queryKey: ["mock-attempts", user?.uid],
    queryFn: () => getMockAttempts(user.uid),
    enabled: Boolean(user?.uid),
  });

  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    isError: leaderboardError,
  } = useQuery({
    queryKey: ["leaderboard", user?.uid],
    queryFn: () => getLeaderboard(user),
    enabled: Boolean(user?.uid),
  });

  const data = processOverviewData(attempts);
  const leaderboard = leaderboardData?.entries || [];

  const handleSubjectAction = (subjectName) => {
    navigate("/dashboard/reports", { state: { focusSubject: subjectName } });
  };

  const handleContinuePractice = () => navigate("/dashboard/mock-exams");
  const handleTakeMockExam = () => navigate("/dashboard/mock-exams");

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-blue-700 text-white shadow-xl shadow-blue-100">
        <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-35 md:block" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-l from-blue-900/50 to-transparent md:block" />

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
            <button
              type="button"
              onClick={handleContinuePractice}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-blue-700 shadow-md transition hover:bg-blue-50"
            >
              <PlayCircle size={18} />
              Continue Practice
            </button>
            <button
              type="button"
              onClick={handleTakeMockExam}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15"
            >
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
            <Link
              to="/dashboard/reports"
              className="flex items-center gap-1 text-sm font-black text-blue-700 hover:underline"
            >
              View Detailed Report <ArrowRight size={15} />
            </Link>
          </div>

          {data.subjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.subjects.map((subject) => (
                <SubjectCard
                  key={subject.name}
                  {...subject}
                  onReview={handleSubjectAction}
                  onPractice={handleSubjectAction}
                />
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

        <AIFocusCard attempts={attempts} isPremium={isPremium} />
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
            <span className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-black text-gray-800">
              Latest 7 exams
            </span>
          </div>

          {data.trendData.length > 0 ? (
            <div className="flex h-72 items-end gap-3 md:gap-5">
              {data.trendData.map((bar, index) => (
                <div
                  key={`${bar.label}-${index}`}
                  className="flex h-full flex-1 flex-col justify-end"
                  aria-label={`${bar.label}: ${bar.score}%`}
                >
                  <div
                    className={`${bar.color} w-full rounded-t-lg transition-all hover:opacity-80`}
                    style={{ height: bar.height }}
                    title={`${bar.label}: ${bar.score}%`}
                  />
                  <p className="mt-4 text-center text-[10px] font-black uppercase text-gray-500">
                    {bar.label}
                  </p>
                  <p className="text-center text-xs font-bold text-gray-700">{bar.score}%</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-sm text-gray-500">
              Complete a mock exam to see your score trend.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-bold text-gray-950">
              Recent Results
            </h3>
            {data.recentResults.length > 0 ? (
              <div className="space-y-5">
                {data.recentResults.map((result, index) => (
                  <div
                    key={result.id || `${result.title}-${index}`}
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
                {leaderboardData?.participantCount || 0} participants
              </p>
            </div>
            <div className="space-y-3">
              {leaderboardLoading ? (
                <p className="py-6 text-center text-sm text-gray-500">Loading leaderboard…</p>
              ) : leaderboardError ? (
                <p className="py-6 text-center text-sm text-red-600">Leaderboard is temporarily unavailable.</p>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((entry) => (
                  <div
                    key={`${entry.rank}-${entry.name}`}
                    className={`flex items-center gap-3 rounded-xl p-3 ${entry.isCurrentUser ? "bg-blue-50" : "bg-white"}`}
                  >
                    <span className="w-7 text-xs font-black text-blue-700">{entry.rank}</span>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=${entry.isCurrentUser ? "1d4ed8" : "047857"}&color=fff`}
                      alt=""
                      className="h-9 w-9 rounded-full"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black text-gray-950">
                        {entry.name} {entry.isCurrentUser ? "(You)" : ""}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {entry.averageScore}% average · {entry.attemptCount} mock{entry.attemptCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    {entry.isCurrentUser && <Trophy size={16} className="text-blue-700" />}
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-500">Complete a mock exam to join the leaderboard.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
