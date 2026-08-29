import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
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

  // Calculate stats
  const avgScore = Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length);
  const overallGrade = getGrade(avgScore);

  // Group by subject
  const subjectScores = {};
  attempts.forEach((attempt) => {
    const subject = attempt.subjectName || "Unknown";
    if (!subjectScores[subject]) {
      subjectScores[subject] = [];
    }
    subjectScores[subject].push(attempt.score || 0);
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
  const reports = attempts.slice(-5).reverse().map((attempt) => ({
    id: attempt.id,
    title: `${attempt.subjectName} ${attempt.year} Mock Exam`,
    type: "Mock Exam Report",
    date: formatDate(attempt.completedAt),
    score: `${attempt.score}%`,
    status: attempt.score >= 50 ? "Reviewed" : "Needs Review",
  }));

  // Generate recommendation
  const bestSubject = Object.entries(subjectScores).reduce((best, [subject, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg > (best.avg || 0) ? { subject, avg } : best;
  }, {});

  const worstSubject = Object.entries(subjectScores).reduce((worst, [subject, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg < (worst.avg || 100) ? { subject, avg } : worst;
  }, {});

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

const reportStats = [];

const reports = [];

function Report() {
  const { user } = useAuth();
  const { data: attempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ["mock-attempts", user?.uid],
    queryFn: () => getMockAttempts(user.uid),
    enabled: Boolean(user?.uid),
  });

  const reportData = processReportData(attempts);

  return (
    <div className="space-y-8 pb-10">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            Reports Center
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-500">
            Review academic summaries, mock exam reports, and personalized study
            recommendations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
            <Printer size={16} />
            Print Report
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-md shadow-blue-100 transition hover:bg-blue-800">
            <Download size={16} />
            Export PDF
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
          <TermReportPreview reportData={reportData} isLoading={attemptsLoading} attempts={attempts} />
          <ReportList reports={reportData.reports} isLoading={attemptsLoading} />
        </main>

        <aside className="space-y-6">
          <RecommendationCard recommendation={reportData.recommendation} />
          <ParentShareCard />
          <ReportSchedule />
        </aside>
      </section>
    </div>
  );
}

function TermReportPreview({ reportData, isLoading, attempts }) {
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
        <div className="flex gap-2">
          <IconButton label="View">
            <Eye size={18} />
          </IconButton>
          <IconButton label="Share">
            <Share2 size={18} />
          </IconButton>
          <IconButton label="Download">
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

function ReportList({ reports, isLoading }) {
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
        {reports.length > 5 && (
          <button className="text-sm font-black text-blue-700 hover:underline">
            View All
          </button>
        )}
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-blue-100 hover:shadow-sm md:flex-row md:items-center"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-black text-gray-950">
                  {report.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {report.type} • {report.date}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="text-right">
                  <p className="font-black text-gray-950">{report.score}</p>
                  <p className={`text-[10px] font-black uppercase ${report.score >= "50%" ? "text-emerald-700" : "text-orange-700"}`}>
                    {report.status}
                  </p>
                </div>
                <button className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-700 text-white transition hover:bg-blue-800">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
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
      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-emerald-200">
        Start Recommendation
        <ArrowRight size={16} />
      </button>
    </article>
  );
}

function ParentShareCard() {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-gray-950">Parent Copy</h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        Create a simple guardian-friendly version with grades, strengths,
        focus areas, and next steps.
      </p>
      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-900 px-4 py-3 text-sm font-black text-blue-900 hover:bg-blue-50">
        <Share2 size={16} />
        Prepare Share Link
      </button>
    </article>
  );
}

function ReportSchedule() {
  // Calculate next report date (7 days from now)
  const nextReport = new Date();
  nextReport.setDate(nextReport.getDate() + 7);
  const dayOfWeek = nextReport.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = nextReport.toLocaleDateString();

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-blue-700">
          <CalendarDays size={20} />
        </div>
        <div>
          <h2 className="font-black text-gray-950">Next Report</h2>
          <p className="text-sm text-gray-500">{dayOfWeek}, {dateStr}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {["Complete 3 mock exams", "Review focus areas", "Track progress"].map(
          (item) => (
            <p
              key={item}
              className="flex items-center gap-3 text-sm font-bold text-gray-600"
            >
              <CheckCircle2 size={17} className="text-emerald-700" />
              {item}
            </p>
          )
        )}
      </div>
    </article>
  );
}

function IconButton({ label, children }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-gray-600 transition hover:border-blue-200 hover:text-blue-700"
    >
      {children}
    </button>
  );
}

export default Report;
