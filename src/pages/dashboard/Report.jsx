import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  Download,
  Eye,
  FileBarChart,
  FileText,
  GraduationCap,
  Printer,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMockAttempts } from "../../services/studyContentService";

// Subject metadata
const SUBJECT_METADATA = {
  Mathematics: "Algebra, Geometry, Statistics",
  "Mathematics (with Statistics)": "Algebra, Geometry, Statistics",
  "English Language": "Writing, Comprehension, Grammar",
  English: "Writing, Comprehension, Grammar",
  "Integrated Science": "Biology, Chemistry, Physics",
  Science: "Biology, Chemistry, Physics",
  "Social Studies": "History, Geography, Governance",
  "Social studies": "History, Geography, Governance",
  RME: "Moral Development, Ethics",
};

const getAttemptDate = (timestamp) => {
  if (!timestamp) return null;
  const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
};

const sortAttemptsNewestFirst = (attempts = []) => [...attempts].sort((first, second) =>
  (getAttemptDate(second.completedAt)?.getTime() || 0)
    - (getAttemptDate(first.completedAt)?.getTime() || 0)
);

const downloadCsv = (filename, rows) => {
  const csv = rows
    .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const buildParentSummary = (attempts) => {
  const orderedAttempts = sortAttemptsNewestFirst(attempts);
  if (orderedAttempts.length === 0) return "No completed mock exams yet.";

  const average = Math.round(
    orderedAttempts.reduce((sum, attempt) => sum + (Number(attempt.score) || 0), 0) / orderedAttempts.length
  );
  const latest = orderedAttempts[0];

  return `BECE Prep progress: ${orderedAttempts.length} completed mock exams; overall average ${average}%. Latest: ${latest.subjectName || "Mock"} ${latest.year || ""}, ${Number(latest.score) || 0}%.`;
};

const shareOrCopy = async (text) => {
  if (navigator.share) {
    await navigator.share({ title: "BECE Prep progress", text });
    return "";
  }

  await navigator.clipboard.writeText(text);
  return "Summary copied to clipboard.";
};

// Grade calculator
const getGrade = (percentage) => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

// Status mapper
const getStatus = (percentage) => {
  if (percentage >= 80) return "Strong";
  if (percentage >= 60) return "Average";
  return "Needs Focus";
};

// Status color
const getStatusColor = (status) => {
  if (status === "Strong" || status === "Excellent") return "bg-emerald-50 text-emerald-700";
  if (status === "Average") return "bg-orange-50 text-orange-700";
  return "bg-red-50 text-red-700";
};

// Process attempts into report data
function processReportData(attempts) {
  if (!attempts || attempts.length === 0) {
    return {
      stats: [
        { label: "Reports Generated", value: "0", helper: "Start a mock exam", icon: <FileText size={22} />, color: "text-blue-700 bg-blue-50" },
        { label: "Latest Average", value: "0%", helper: "No attempts yet", icon: <TrendingUp size={22} />, color: "text-emerald-700 bg-emerald-50" },
        { label: "Mock Reports", value: "0", helper: "Complete exams", icon: <FileBarChart size={22} />, color: "text-purple-700 bg-purple-50" },
        { label: "Recommendations", value: "0", helper: "Build history", icon: <Sparkles size={22} />, color: "text-orange-700 bg-orange-50" },
      ],
      overallScore: 0,
      overallGrade: "N/A",
      subjectData: [],
      reports: [],
      recommendation: null,
    };
  }

  const orderedAttempts = sortAttemptsNewestFirst(attempts);

  // Calculate stats
  const avgScore = Math.round(orderedAttempts.reduce((sum, attempt) => sum + (Number(attempt.score) || 0), 0) / orderedAttempts.length);
  const overallGrade = getGrade(avgScore);

  // Group by subject
  const subjectScores = {};
  orderedAttempts.forEach((attempt) => {
    const subject = attempt.subjectName || "Unknown";
    if (!subjectScores[subject]) {
      subjectScores[subject] = [];
    }
    subjectScores[subject].push(Number(attempt.score) || 0);
  });

  // Create subject data for report
  const subjectData = Object.entries(subjectScores).map(([subject, scores]) => {
    const avgSubjectScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const status = getStatus(avgSubjectScore);
    return [
      subject,
      `${avgSubjectScore}%`,
      status,
      SUBJECT_METADATA[subject] || "Topics",
    ];
  });

  // Create reports from attempts
  const reports = orderedAttempts.slice(0, 5).map((attempt) => ({
    id: attempt.id,
    title: `${attempt.subjectName} ${attempt.year} Mock Exam`,
    type: "Mock Exam Report",
    date: formatDate(attempt.completedAt),
    score: Number(attempt.score) || 0,
    status: Number(attempt.score) >= 50 ? "Reviewed" : "Needs Review",
  }));

  // Generate recommendation
  const bestSubject = Object.entries(subjectScores).reduce((best, [subject, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return !best.subject || avg > best.avg ? { subject, avg } : best;
  }, null);

  const worstSubject = Object.entries(subjectScores).reduce((worst, [subject, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return !worst.subject || avg < worst.avg ? { subject, avg } : worst;
  }, null);

  const recommendation = bestSubject.subject && worstSubject.subject
    ? `Your strongest area is ${bestSubject.subject}. Focus on improving ${worstSubject.subject} for your next exam.`
    : "Keep taking mock exams to get personalized recommendations.";

  const stats = [
    {
      label: "Reports Generated",
      value: attempts.length.toString(),
      helper: "Mock exams completed",
      icon: <FileText size={22} />,
      color: "text-blue-700 bg-blue-50",
    },
    {
      label: "Latest Average",
      value: `${avgScore}%`,
      helper: "Overall performance",
      icon: <TrendingUp size={22} />,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Mock Reports",
      value: attempts.length.toString(),
      helper: "Ready to review",
      icon: <FileBarChart size={22} />,
      color: "text-purple-700 bg-purple-50",
    },
    {
      label: "Recommendations",
      value: subjectData.length.toString(),
      helper: "Subject insights",
      icon: <Sparkles size={22} />,
      color: "text-orange-700 bg-orange-50",
    },
  ];

  return {
    stats,
    overallScore: avgScore,
    overallGrade,
    subjectData,
    reports,
    recommendation,
  };
}

function formatDate(timestamp) {
  if (!timestamp) return "Unknown date";
  const date = timestamp.toDate?.() || new Date(timestamp);
  const now = new Date();
  const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) return "Generated today";
  if (daysAgo === 1) return "Generated yesterday";
  if (daysAgo < 7) return `Generated ${daysAgo} days ago`;

  return `Generated ${date.toLocaleDateString()}`;
}

function Report() {
  const { user } = useAuth();
  const location = useLocation();
  const { data: attempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ["mock-attempts", user?.uid],
    queryFn: () => getMockAttempts(user.uid),
    enabled: Boolean(user?.uid),
  });
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [shareMessage, setShareMessage] = useState("");

  const reportData = processReportData(attempts);
  const focusSubject = location.state?.focusSubject;
  const handleShare = async () => {
    try {
      setShareMessage(await shareOrCopy(buildParentSummary(attempts)));
    } catch (error) {
      if (error.name !== "AbortError") setShareMessage("Unable to share the report from this browser.");
    }
  };
  const handleExportCsv = () => downloadCsv("bece-progress-report.csv", [
    ["Subject", "Year", "Score", "Correct", "Total Questions", "Completed At"],
    ...sortAttemptsNewestFirst(attempts).map((attempt) => [
      attempt.subjectName,
      attempt.year,
      Number(attempt.score) || 0,
      Number(attempt.correctCount) || 0,
      Number(attempt.totalQuestions) || 0,
      getAttemptDate(attempt.completedAt)?.toISOString() || "",
    ]),
  ]);
  const handleDownloadAttempt = (attempt) => downloadCsv(
    `${String(attempt.subjectName || "mock").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${attempt.year || "report"}.csv`,
    [
      ["Subject", "Year", "Score", "Correct", "Total Questions", "Completed At"],
      [
        attempt.subjectName,
        attempt.year,
        Number(attempt.score) || 0,
        Number(attempt.correctCount) || 0,
        Number(attempt.totalQuestions) || 0,
        getAttemptDate(attempt.completedAt)?.toISOString() || "",
      ],
    ]
  );
  const handlePrint = () => window.print();

  return (
    <div id="report-print-area" className="space-y-8 pb-10">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          {focusSubject && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              Focus subject: {focusSubject}
            </div>
          )}
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            Reports Center
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-500">
            Review academic summaries, mock exam reports, and personalized study
            recommendations.
          </p>
        </div>
        <div className="report-print-hidden flex flex-wrap gap-3">
          <button type="button" onClick={handlePrint} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
            <Printer size={16} />
            Print Report
          </button>
          <button type="button" onClick={handlePrint} className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-md shadow-blue-100 transition hover:bg-blue-800">
            <Download size={16} />
            Save as PDF
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportData.stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-400">{stat.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_340px]">
        <main className="space-y-8">
          <div id="report-summary"><TermReportPreview reportData={reportData} isLoading={attemptsLoading} attempts={attempts} onShare={handleShare} onExport={handleExportCsv} /></div>
          <ReportList reports={reportData.reports} isLoading={attemptsLoading} attempts={attempts} expandedReportId={expandedReportId} setExpandedReportId={setExpandedReportId} onDownloadAttempt={handleDownloadAttempt} />
        </main>

        <aside className="space-y-6">
          <RecommendationCard recommendation={reportData.recommendation} />
          <ParentShareCard onShare={handleShare} shareMessage={shareMessage} />
          <ReportSchedule attempts={attempts} />
        </aside>
      </section>
    </div>
  );
}

function TermReportPreview({ reportData, isLoading, attempts, onShare, onExport }) {
  if (isLoading) {
    return (
      <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="py-12 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
          <p className="mt-4 text-sm font-bold text-gray-400">Loading report data...</p>
        </div>
      </article>
    );
  }

  if (!attempts || attempts.length === 0) {
    return (
      <article className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
        <FileBarChart className="mx-auto text-slate-300" size={44} />
        <h3 className="mt-4 text-lg font-black text-gray-600">No Reports Yet</h3>
        <p className="mt-2 text-sm text-gray-500">Complete some mock exams to generate your first report.</p>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-5 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-blue-700">
            Performance Summary
          </p>
          <h2 className="mt-2 text-2xl font-black text-gray-950">
            Overall Academic Report
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Based on {attempts.length} mock exam{attempts.length !== 1 ? "s" : ""} completed
          </p>
        </div>
        <div className="report-print-hidden flex gap-2">
          <IconButton label="View summary" onClick={() => document.getElementById("report-summary")?.scrollIntoView({ behavior: "smooth" })}>
            <Eye size={18} />
          </IconButton>
          <IconButton label="Share summary" onClick={onShare}>
            <Share2 size={18} />
          </IconButton>
          <IconButton label="Download CSV" onClick={onExport}>
            <Download size={18} />
          </IconButton>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[260px_1fr]">
        <div className="rounded-2xl bg-blue-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-sm text-blue-100">Overall Grade</p>
              <p className="text-3xl font-black">{reportData.overallGrade}</p>
            </div>
          </div>
          <div className="mt-7">
            <p className="text-sm text-blue-100">Average Score</p>
            <p className="text-5xl font-black">{reportData.overallScore}%</p>
            <p className="mt-3 text-sm leading-relaxed text-blue-50">
              {reportData.overallScore >= 80
                ? "Excellent performance. Keep maintaining this momentum!"
                : reportData.overallScore >= 60
                ? "Good progress. Focus on weaker areas to improve."
                : "Keep practicing and you'll see improvement soon."}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <div className="grid grid-cols-[1.2fr_0.6fr_0.7fr_1fr] bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-gray-500">
            <span>Subject</span>
            <span>Score</span>
            <span>Status</span>
            <span>Topics</span>
          </div>
          {reportData.subjectData.length > 0 ? (
            reportData.subjectData.map(([subject, score, status, note]) => (
              <div
                key={subject}
                className="grid grid-cols-[1.2fr_0.6fr_0.7fr_1fr] items-center border-t border-slate-100 px-4 py-4 text-sm"
              >
                <span className="font-black text-gray-950">{subject}</span>
                <span className="font-black text-blue-700">{score}</span>
                <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase ${getStatusColor(status)}`}>
                  {status}
                </span>
                <span className="text-gray-500">{note}</span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-gray-500">No subject data available</div>
          )}
        </div>
      </div>
    </article>
  );
}

function ReportList({ reports, isLoading, attempts = [], expandedReportId, setExpandedReportId, onDownloadAttempt }) {
  const attemptMap = new Map((attempts || []).map((attempt) => [attempt.id, attempt]));

  if (isLoading) {
    return (
      <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="py-12 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
          <p className="mt-4 text-sm font-bold text-gray-400">Loading reports...</p>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-950">
            Generated Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {reports.length > 0 ? "Recent reports ready for review or download." : "No reports generated yet."}
          </p>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => {
            const attempt = attemptMap.get(report.id);
            const isExpanded = expandedReportId === report.id;

            return (
              <div key={report.id} className="rounded-2xl border border-slate-100 p-4 transition hover:border-blue-100 hover:shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <FileText size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-gray-950">{report.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{report.type} • {report.date}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <div className="text-right">
                      <p className="font-black text-gray-950">{report.score}%</p>
                      <p className={`text-[10px] font-black uppercase ${report.score >= 50 ? "text-emerald-700" : "text-orange-700"}`}>
                        {report.status}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-gray-700 transition hover:border-blue-200 hover:text-blue-700"
                      aria-label="View report details"
                      title="View report details"
                    >
                      <Eye size={18} />
                    </button>
                    <button type="button" onClick={() => attempt && onDownloadAttempt(attempt)} disabled={!attempt} className="report-print-hidden flex h-11 w-11 items-center justify-center rounded-lg bg-blue-700 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Download report CSV" title="Download report CSV">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                {isExpanded && attempt && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subject</p>
                        <p className="mt-1 font-bold text-gray-950">{attempt.subjectName || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Score</p>
                        <p className="mt-1 font-bold text-gray-950">{attempt.score || 0}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Correct</p>
                        <p className="mt-1 font-bold text-gray-950">{attempt.correctCount || 0}/{attempt.totalQuestions || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <FileBarChart className="mx-auto text-slate-300" size={36} />
          <p className="mt-3 text-sm font-bold text-gray-500">No reports generated yet</p>
          <p className="text-sm text-gray-400">Complete mock exams to generate performance reports.</p>
        </div>
      )}
    </article>
  );
}

function RecommendationCard({ recommendation }) {
  const navigate = useNavigate();

  return (
    <article className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <Sparkles size={22} className="text-emerald-300" />
        <h2 className="text-xl font-black">Report Insight</h2>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">
        {recommendation || "Complete more mock exams to get personalized insights about your performance."}
      </p>
      <div className="mt-6 rounded-2xl bg-white/10 p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
          Suggested Action
        </p>
        <p className="mt-2 font-black">Review weaker subjects daily</p>
      </div>
      <button type="button" onClick={() => navigate("/dashboard/mock-exams")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-emerald-200">
        Start Recommendation
        <ArrowRight size={16} />
      </button>
    </article>
  );
}

function ParentShareCard({ onShare, shareMessage }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-gray-950">Parent Copy</h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        Create a simple guardian-friendly version with grades, strengths,
        focus areas, and next steps.
      </p>
      <button type="button" onClick={onShare} className="report-print-hidden mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-900 px-4 py-3 text-sm font-black text-blue-900 hover:bg-blue-50">
        <Share2 size={16} />
        Share Progress Summary
      </button>
      {shareMessage && <p role="status" className="mt-3 text-sm font-bold text-blue-800">{shareMessage}</p>}
    </article>
  );
}

function ReportSchedule({ attempts }) {
  const latestAttempt = sortAttemptsNewestFirst(attempts)[0];
  const latestDate = latestAttempt ? getAttemptDate(latestAttempt.completedAt) : null;
  const dateLabel = latestDate
    ? latestDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "No saved attempts yet";

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-blue-700">
          <CalendarDays size={20} />
        </div>
        <div>
          <h2 className="font-black text-gray-950">Latest Report Activity</h2>
          <p className="text-sm text-gray-500">{dateLabel}</p>
        </div>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-gray-600">
        {latestAttempt
          ? `${attempts.length} saved mock ${attempts.length === 1 ? "result" : "results"}. Your report updates when a new mock is completed.`
          : "Complete a mock exam to generate a report from your saved results."}
      </p>
    </article>
  );
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-gray-600 transition hover:border-blue-200 hover:text-blue-700"
    >
      {children}
    </button>
  );
}

export default Report;
