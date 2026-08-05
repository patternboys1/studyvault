import {
  AlertTriangle,
  ArrowUpRight,
  Download,
  Eye,
  Rocket,
  Target,
} from "lucide-react";

const scoreBars = [
  { month: "Jan", value: 48 },
  { month: "Feb", value: 56 },
  { month: "Mar", value: 62 },
  { month: "Apr", value: 68 },
  { month: "May", value: 74 },
  { month: "Jun", value: 82 },
];

const subjects = [
  {
    name: "Mathematics",
    score: 82,
    note: "Mastery in Algebra & Geometry",
    color: "bg-blue-700",
    dot: "bg-blue-600",
  },
  {
    name: "English Language",
    score: 75,
    note: "Focus needed on Essay Writing",
    color: "bg-orange-900",
    dot: "bg-orange-800",
  },
  {
    name: "Integrated Science",
    score: 91,
    note: "Exceptional performance in Biology",
    color: "bg-emerald-700",
    dot: "bg-emerald-700",
  },
  {
    name: "Social Studies",
    score: 64,
    note: "Review History & Governance",
    color: "bg-orange-400",
    dot: "bg-orange-400",
  },
];

const strengths = [
  ["Sets & Operations", "95%"],
  ["Grammar & Punctuation", "88%"],
  ["Human Body Systems", "92%"],
];

const focusAreas = [
  ["Trigonometry", "42%"],
  ["Colonial History", "38%"],
  ["Electrical Circuits", "51%"],
];

const mockHistory = [
  {
    id: "01",
    title: "Full Mock Exam #04",
    date: "Completed June 12, 2024",
    score: "412/500",
  },
  {
    id: "02",
    title: "Weekly Assessment #18",
    date: "Completed June 05, 2024",
    score: "388/500",
  },
];

function Performance() {
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
        <ExamReadiness />
        <ScoreTrends />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <SubjectBreakdown />
        <StudyPattern />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TopicInsights />
        <MockHistory />
      </section>
    </div>
  );
}

function ExamReadiness() {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
      <Target
        size={76}
        className="absolute right-6 top-5 text-slate-100"
        strokeWidth={1.5}
      />
      <h2 className="text-2xl font-black text-gray-950">Exam Readiness</h2>

      <div className="relative mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#047857_0deg,#047857_281deg,#eceaf6_281deg,#eceaf6_360deg)]">
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
          <p className="text-4xl font-black text-gray-950">78%</p>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Excellent
          </p>
        </div>
      </div>

      <p className="mx-auto mt-7 max-w-56 text-base leading-relaxed text-gray-700">
        You are in the top 15% of students this month.
      </p>
    </article>
  );
}

function ScoreTrends() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-950">Score Trends</h2>
          <p className="mt-1 text-sm text-gray-500">
            Performance across all subjects (last 6 months)
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
          {scoreBars.map((bar) => (
            <div key={bar.month} className="flex h-full flex-1 flex-col justify-end">
              <div
                className="rounded-t-xl bg-blue-700/90"
                style={{ height: `${bar.value}%` }}
              />
              <p className="mt-3 text-center text-[11px] font-black uppercase text-gray-500">
                {bar.month}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function SubjectBreakdown() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-black text-gray-950">Subject Breakdown</h2>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {subjects.map((subject) => (
          <div
            key={subject.name}
            className="rounded-xl border border-slate-100 bg-indigo-50/60 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-black text-gray-950">
                <span className={`h-2 w-2 rounded-full ${subject.dot}`} />
                {subject.name}
              </p>
              <p className="font-black text-blue-700">{subject.score}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <div
                className={`h-full rounded-full ${subject.color}`}
                style={{ width: `${subject.score}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-gray-500">{subject.note}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function StudyPattern() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-black text-gray-950">Study Pattern</h2>
      <div className="mx-auto mt-7 flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-emerald-300 bg-emerald-300 text-emerald-950 shadow-inner">
        <p className="text-3xl font-black">18.5</p>
        <p className="text-[10px] font-black uppercase">Hours / Week</p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="font-medium text-gray-600">Active Days</p>
        <p className="font-black text-gray-950">6/7 Days</p>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div
            key={day}
            className={`h-6 rounded-sm ${
              day === 5 ? "bg-slate-100" : "bg-emerald-700"
            }`}
          />
        ))}
      </div>
      <p className="mt-5 text-sm italic text-gray-500">
        Peak performance usually at 4 PM.
      </p>
    </article>
  );
}

function TopicInsights() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-black text-gray-950">Topic Insights</h2>
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

function MockHistory() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-950">Mock History</h2>
        <button className="text-sm font-black text-blue-700 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockHistory.map((mock) => (
          <div
            key={mock.id}
            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-lg font-black text-blue-900">
              {mock.id}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-black text-gray-950">{mock.title}</p>
              <p className="text-sm text-gray-500">{mock.date}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-gray-950">{mock.score}</p>
              <p className="text-[10px] font-black uppercase text-emerald-700">
                Pass
              </p>
            </div>
            <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800">
              <Eye size={20} />
            </button>
          </div>
        ))}
      </div>

      <button className="mt-5 flex items-center gap-2 text-sm font-black text-blue-700 hover:underline">
        Open detailed analytics
        <ArrowUpRight size={16} />
      </button>
    </article>
  );
}

export default Performance;
