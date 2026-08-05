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

const reportStats = [
  {
    label: "Reports Generated",
    value: "18",
    helper: "Across all terms",
    icon: <FileText size={22} />,
    color: "text-blue-700 bg-blue-50",
  },
  {
    label: "Latest Average",
    value: "78%",
    helper: "Second term summary",
    icon: <TrendingUp size={22} />,
    color: "text-emerald-700 bg-emerald-50",
  },
  {
    label: "Mock Reports",
    value: "12",
    helper: "Ready to review",
    icon: <FileBarChart size={22} />,
    color: "text-purple-700 bg-purple-50",
  },
  {
    label: "Recommendations",
    value: "6",
    helper: "Personalized actions",
    icon: <Sparkles size={22} />,
    color: "text-orange-700 bg-orange-50",
  },
];

const reports = [
  {
    title: "Second Term Performance Report",
    type: "Academic Summary",
    date: "Generated June 18, 2024",
    score: "78%",
    status: "Ready",
  },
  {
    title: "Mathematics Mock Exam #04",
    type: "Mock Exam Report",
    date: "Generated June 12, 2024",
    score: "82%",
    status: "Reviewed",
  },
  {
    title: "Integrated Science Topic Review",
    type: "Subject Insight",
    date: "Generated June 08, 2024",
    score: "91%",
    status: "Ready",
  },
  {
    title: "Weekly Practice Progress",
    type: "Practice Report",
    date: "Generated June 05, 2024",
    score: "74%",
    status: "Ready",
  },
];

const subjectRows = [
  ["Mathematics", "82%", "Strong", "Algebra, geometry"],
  ["English Language", "75%", "Average", "Essay writing"],
  ["Integrated Science", "91%", "Excellent", "Biology systems"],
  ["Social Studies", "64%", "Needs Focus", "History, governance"],
];

function Report() {
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
        {reportStats.map((stat) => (
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
          <TermReportPreview />
          <ReportList />
        </main>

        <aside className="space-y-6">
          <RecommendationCard />
          <ParentShareCard />
          <ReportSchedule />
        </aside>
      </section>
    </div>
  );
}

function TermReportPreview() {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-5 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-blue-700">
            Latest Report
          </p>
          <h2 className="mt-2 text-2xl font-black text-gray-950">
            Second Term Academic Summary
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Generated from mock exams, past question practice, and weekly
            assessments.
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
              <p className="text-3xl font-black">B+</p>
            </div>
          </div>
          <div className="mt-7">
            <p className="text-sm text-blue-100">Average Score</p>
            <p className="text-5xl font-black">78%</p>
            <p className="mt-3 text-sm leading-relaxed text-blue-50">
              Strong progress. Focus on Social Studies and English composition
              to lift the next report.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <div className="grid grid-cols-[1.2fr_0.6fr_0.7fr_1fr] bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-gray-500">
            <span>Subject</span>
            <span>Score</span>
            <span>Status</span>
            <span>Key Note</span>
          </div>
          {subjectRows.map(([subject, score, status, note]) => (
            <div
              key={subject}
              className="grid grid-cols-[1.2fr_0.6fr_0.7fr_1fr] items-center border-t border-slate-100 px-4 py-4 text-sm"
            >
              <span className="font-black text-gray-950">{subject}</span>
              <span className="font-black text-blue-700">{score}</span>
              <span
                className={`w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                  status === "Needs Focus"
                    ? "bg-red-50 text-red-700"
                    : status === "Average"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {status}
              </span>
              <span className="text-gray-500">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function ReportList() {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-950">
            Generated Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Recent reports ready for review or download.
          </p>
        </div>
        <button className="text-sm font-black text-blue-700 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.title}
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
                <p className="text-[10px] font-black uppercase text-emerald-700">
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
    </article>
  );
}

function RecommendationCard() {
  return (
    <article className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <Sparkles size={22} className="text-emerald-300" />
        <h2 className="text-xl font-black">Report Insight</h2>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">
        Your strongest improvement came from Integrated Science. The next best
        gain is likely from focused English essays and Social Studies revision.
      </p>
      <div className="mt-6 rounded-2xl bg-white/10 p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
          Suggested Action
        </p>
        <p className="mt-2 font-black">Complete 2 writing drills this week</p>
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
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-blue-700">
          <CalendarDays size={20} />
        </div>
        <div>
          <h2 className="font-black text-gray-950">Next Report</h2>
          <p className="text-sm text-gray-500">Friday, June 28</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {["Mock exam results", "Practice streak", "Topic mastery"].map(
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
