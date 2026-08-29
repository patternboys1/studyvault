import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Download,
  Rocket,
  Target,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMockAttempts } from "../../services/studyContentService";

// Subject metadata with colors
const SUBJECT_METADATA = {
  Mathematics: { color: "bg-blue-700", dot: "bg-blue-600" },
  "Mathematics (with Statistics)": { color: "bg-blue-700", dot: "bg-blue-600" },
  "English Language": { color: "bg-orange-900", dot: "bg-orange-800" },
  English: { color: "bg-orange-900", dot: "bg-orange-800" },
  "Integrated Science": { color: "bg-emerald-700", dot: "bg-emerald-600" },
  Science: { color: "bg-emerald-700", dot: "bg-emerald-600" },
  "Social Studies": { color: "bg-orange-400", dot: "bg-orange-400" },
  "Social studies": { color: "bg-orange-400", dot: "bg-orange-400" },
  RME: { color: "bg-purple-700", dot: "bg-purple-600" },
};

// Process attempts data for analytics
function processAttemptsData(attempts) {
  if (!attempts || attempts.length === 0) {
    return {
      scoreTrends: [],
      subjectScores: {},
      strengths: [],
      focusAreas: [],
    };
  }

  // Sort attempts by date (oldest first)
  const sortedAttempts = [...attempts].sort(
    (a, b) => (a.completedAt?.toDate?.() || new Date(a.completedAt)) - (b.completedAt?.toDate?.() || new Date(b.completedAt))
  );

  // Score trends - last 6 attempts
  const scoreTrends = sortedAttempts.slice(-6).map((attempt, idx) => ({
    label: `Exam ${idx + 1}`,
    value: attempt.score || 0,
  }));

  // Subject scores - grouped by subject
  const subjectScores = {};
  sortedAttempts.forEach((attempt) => {
    const subject = attempt.subjectName || "Unknown";
    if (!subjectScores[subject]) {
      subjectScores[subject] = { scores: [], attempts: 0 };
    }
    subjectScores[subject].scores.push(attempt.score || 0);
    subjectScores[subject].attempts += 1;
  });

  // Calculate average scores for each subject
  Object.keys(subjectScores).forEach((subject) => {
    const data = subjectScores[subject];
    const avg = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
    subjectScores[subject].averageScore = avg;
  });

  // Identify strengths and focus areas
  const subjectAverages = Object.entries(subjectScores).map(([name, data]) => ({
    name,
    score: data.averageScore,
  }));

  const sortedByScore = [...subjectAverages].sort((a, b) => b.score - a.score);
  const strengths = sortedByScore.slice(0, 3).map((s) => [s.name, `${s.score}%`]);
  const focusAreas = sortedByScore.slice(-3).reverse().map((s) => [s.name, `${s.score}%`]);

  return {
    scoreTrends,
    subjectScores,
    strengths,
    focusAreas,
  };
}

// Calculate study metrics
function calculateStudyMetrics(attempts) {
  if (!attempts || attempts.length === 0) {
    return {
      totalHours: 0,
      averageScore: 0,
      lastAttemptDate: "Never",
    };
  }

  const avgScore = Math.round(attempts.reduce((total, a) => total + (a.score || 0), 0) / attempts.length);
  const lastAttempt = attempts[attempts.length - 1];
  const lastDate = lastAttempt.completedAt?.toDate?.() || new Date(lastAttempt.completedAt);
  const now = new Date();
  const daysAgo = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

  let lastAttemptDate;
  if (daysAgo === 0) {
    lastAttemptDate = "Today";
  } else if (daysAgo === 1) {
    lastAttemptDate = "Yesterday";
  } else if (daysAgo < 7) {
    lastAttemptDate = `${daysAgo}d ago`;
  } else {
    lastAttemptDate = lastDate.toLocaleDateString();
  }

  // Estimate total hours (assume ~1 hour per exam)
  const totalHours = attempts.length * 1.0;

  return {
    totalHours,
    averageScore: avgScore,
    lastAttemptDate,
  };
}

function Performance() {
  const { user } = useAuth();
  const { data: attempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ["mock-attempts", user?.uid],
    queryFn: () => getMockAttempts(user.uid),
    enabled: Boolean(user?.uid),
  });

  // Process attempts data for analytics
  const analytics = processAttemptsData(attempts);

  return (
    <div className="space-y-8 pb-10">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            Performance Analytics
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Track your progress and identify areas for improvement.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
            <Download size={16} />
            Export Report
          </button>
          <button className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-md shadow-blue-100 transition hover:bg-blue-800">
            Start Practice Test
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <ExamReadiness attempts={attempts} analytics={analytics} />
        <ScoreTrends analytics={analytics} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <SubjectBreakdown analytics={analytics} />
        <StudyPattern attempts={attempts} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TopicInsights analytics={analytics} />
        <MockHistory attempts={attempts} isLoading={attemptsLoading} />
      </section>
    </div>
  );
}

function ExamReadiness({ attempts, analytics }) {
  const averageScore = attempts.length
    ? Math.round(attempts.reduce((total, attempt) => total + (attempt.score || 0), 0) / attempts.length)
    : 0;
  const readinessLabel = averageScore >= 80 ? "Excellent" : averageScore >= 60 ? "Progressing" : "Keep Practising";
  const readinessColor = averageScore >= 80 ? "text-emerald-700" : averageScore >= 60 ? "text-blue-700" : "text-orange-700";
  const readinessBg = averageScore >= 80 ? "#047857" : averageScore >= 60 ? "#1e40af" : "#ea580c";

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
      <Target
        size={76}
        className="absolute right-6 top-5 text-slate-100"
        strokeWidth={1.5}
      />
      <h2 className="text-2xl font-black text-gray-950">Exam Readiness</h2>

      <div className="relative mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-full" style={{ background: `conic-gradient(${readinessBg} 0deg, ${readinessBg} ${averageScore * 3.6}deg, #eceaf6 ${averageScore * 3.6}deg, #eceaf6 360deg)` }}>
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
          <p className="text-4xl font-black text-gray-950">{averageScore}%</p>
          <p className={`text-xs font-black uppercase tracking-widest ${readinessColor}`}>{readinessLabel}</p>
        </div>
      </div>

      <p className="mx-auto mt-7 max-w-56 text-base leading-relaxed text-gray-700">
        {attempts.length ? `Based on ${attempts.length} completed objective mock${attempts.length === 1 ? "" : "s"}.` : "Complete an objective mock to see your real readiness score."}
      </p>
    </article>
  );
}

function ScoreTrends({ analytics }) {
  const { scoreTrends } = analytics;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-950">Score Trends</h2>
          <p className="mt-1 text-sm text-gray-500">
            {scoreTrends.length > 0 ? "Performance over time (last exams)" : "Take mock exams to see your trends"}
          </p>
        </div>
        <div className="flex rounded-full bg-slate-50 p-1 text-xs font-black">
          <button className="rounded-full bg-white px-4 py-2 text-gray-900 shadow-sm">
            Monthly
          </button>
          <button className="px-4 py-2 text-gray-400">Weekly</button>
        </div>
      </div>

      <div className="mt-8 h-64 border-l border-slate-100">
        <div className="flex h-full items-end gap-5 border-b border-slate-100 px-4">
          {scoreTrends.length > 0 ? (
            scoreTrends.map((bar) => (
              <div key={bar.label} className="flex h-full flex-1 flex-col justify-end">
                <div
                  className="rounded-t-xl bg-blue-700/90 transition hover:bg-blue-700"
                  style={{ height: `${Math.min(bar.value, 100)}%` }}
                />
                <p className="mt-3 text-center text-[11px] font-black uppercase text-gray-500">
                  {bar.label}
                </p>
              </div>
            ))
          ) : (
            <div className="flex w-full items-center justify-center text-sm text-gray-400">
              No attempt data yet
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function SubjectBreakdown({ analytics }) {
  const { subjectScores } = analytics;
  const subjectList = Object.entries(subjectScores).map(([name, data]) => ({
    name,
    score: Math.round(data.averageScore),
    attempts: data.attempts,
    metadata: SUBJECT_METADATA[name] || { color: "bg-slate-600", dot: "bg-slate-500" },
  }));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-black text-gray-950">Subject Breakdown</h2>
      {subjectList.length > 0 ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {subjectList.map((subject) => (
            <div
              key={subject.name}
              className="rounded-xl border border-slate-100 bg-indigo-50/60 p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-black text-gray-950">
                  <span className={`h-2 w-2 rounded-full ${subject.metadata.dot}`} />
                  {subject.name}
                </p>
                <p className="font-black text-blue-700">{subject.score}%</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full ${subject.metadata.color}`}
                  style={{ width: `${subject.score}%` }}
                />
              </div>
              <p className="mt-4 text-sm text-gray-500">{subject.attempts} attempt{subject.attempts !== 1 ? "s" : ""}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-gray-500">
          Complete mock exams to see subject breakdown
        </div>
      )}
    </article>
  );
}

function StudyPattern({ attempts }) {
  // Calculate study metrics from attempts
  const studyMetrics = calculateStudyMetrics(attempts);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-black text-gray-950">Study Pattern</h2>
      
      {attempts.length > 0 ? (
        <>
          <div className="mx-auto mt-7 flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-emerald-300 bg-emerald-300 text-emerald-950 shadow-inner">
            <p className="text-3xl font-black">{studyMetrics.totalHours.toFixed(1)}</p>
            <p className="text-[10px] font-black uppercase">Hours Total</p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="font-medium text-gray-600">Exams Taken</p>
            <p className="font-black text-gray-950">{attempts.length}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="font-medium text-gray-600">Last Exam</p>
            <p className="text-sm font-black text-gray-900">{studyMetrics.lastAttemptDate}</p>
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-black">Average Score</p>
            <p className="mt-1 text-2xl font-black">{studyMetrics.averageScore}%</p>
          </div>
        </>
      ) : (
        <div className="mt-7 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-gray-500">
          Your study data will appear after taking exams
        </div>
      )}
    </article>
  );
}

function TopicInsights({ analytics }) {
  const { strengths, focusAreas } = analytics;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-black text-gray-950">Topic Insights</h2>
      {strengths.length > 0 || focusAreas.length > 0 ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <InsightColumn
            icon={<Rocket size={19} />}
            title="Strengths"
            color="text-emerald-700"
            rows={strengths}
            rowClass="bg-emerald-50 text-emerald-800"
          />
          <InsightColumn
            icon={<AlertTriangle size={19} />}
            title="Needs Focus"
            color="text-red-700"
            rows={focusAreas}
            rowClass="bg-red-50 text-red-800"
          />
        </div>
      ) : (
        <div className="mt-7 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-gray-500">
          Complete more exams to identify strengths and focus areas
        </div>
      )}
    </article>
  );
}

function InsightColumn({ icon, title, color, rows, rowClass }) {
  return (
    <div>
      <h3 className={`mb-4 flex items-center gap-2 text-lg font-black ${color}`}>
        {icon}
        {title}
      </h3>
      <div className="space-y-3">
        {rows.map(([topic, score]) => (
          <div
            key={topic}
            className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold ${rowClass}`}
          >
            <span>{topic}</span>
            <span>{score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockHistory({ attempts, isLoading }) {
  const recentAttempts = attempts.slice(0, 5);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate?.() || new Date(timestamp);
    const now = new Date();
    const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo < 7) return `${daysAgo} days ago`;

    return date.toLocaleDateString();
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-950">Mock History</h2>
        <p className="text-sm font-black text-blue-700">Saved results</p>
      </div>

      {isLoading ? <p className="py-8 text-center text-sm font-bold text-gray-400">Loading saved results...</p> : recentAttempts.length > 0 ? <div className="space-y-4">
        {recentAttempts.map((attempt) => (
          <div
            key={attempt.id}
            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-lg font-black text-blue-900">
              {attempt.score}%
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-black text-gray-950">{attempt.subjectName} {attempt.year}</p>
              <p className="text-sm text-gray-500">{formatDate(attempt.completedAt)}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-gray-950">{attempt.correctCount}/{attempt.totalQuestions}</p>
              <p className={`text-[10px] font-black uppercase ${attempt.score >= 50 ? "text-emerald-700" : "text-orange-700"}`}>{attempt.score >= 50 ? "Pass" : "Keep Practising"}</p>
            </div>
          </div>
        ))}
      </div> : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center text-sm font-medium text-gray-500">Your completed objective mocks will appear here.</div>}
    </article>
  );
}

export default Performance;
