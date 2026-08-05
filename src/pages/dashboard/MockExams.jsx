import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Flag,
  GraduationCap,
  ListChecks,
  NotebookPen,
  Play,
  Ruler,
  Sigma,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";

const subjects = [
  {
    name: "Mathematics",
    description:
      "Master numbers, algebra, and geometry through structured problem solving.",
    exams: 15,
    score: "88%",
    status: "Recent: 88%",
    icon: <Calculator size={22} />,
    accent: "text-blue-700 bg-blue-50",
    progressColor: "bg-blue-700",
  },
  {
    name: "English Language",
    description:
      "Enhance grammar, comprehension, vocabulary, and creative writing skills.",
    exams: 12,
    score: "64%",
    status: "Not Taken",
    icon: <BookOpen size={22} />,
    accent: "text-purple-700 bg-purple-50",
    progressColor: "bg-purple-500",
  },
  {
    name: "Integrated Science",
    description: "Explore the world of biology, physics, and chemistry concepts.",
    exams: 18,
    score: "92%",
    status: "Recent: 92%",
    icon: <GraduationCap size={22} />,
    accent: "text-emerald-700 bg-emerald-50",
    progressColor: "bg-emerald-700",
  },
  {
    name: "Social Studies",
    description:
      "Understand Ghana's heritage, citizenship, and global dynamics.",
    exams: 10,
    score: "76%",
    status: "Recent: 76%",
    icon: <Target size={22} />,
    accent: "text-orange-700 bg-orange-50",
    progressColor: "bg-orange-500",
  },
];

const mockPapers = [
  {
    title: "Mathematics Mock Exam #1",
    set: "Set A • 2024",
    difficulty: "Medium",
    questions: 60,
    minutes: 90,
    status: "Completed • 92%",
    state: "completed",
    icon: <Sigma size={30} />,
    accent: "text-blue-700 bg-blue-50",
  },
  {
    title: "Mathematics Mock Exam #2",
    set: "Set B • 2024",
    difficulty: "Hard",
    questions: 45,
    minutes: 60,
    status: "In Progress: 14/45 Answered",
    state: "progress",
    icon: <Calculator size={30} />,
    accent: "text-orange-700 bg-orange-50",
  },
  {
    title: "Mathematics Mock Exam #3",
    set: "Set C • 2024",
    difficulty: "Easy",
    questions: 50,
    minutes: 75,
    status: "Not Taken",
    state: "new",
    icon: <Ruler size={30} />,
    accent: "text-slate-600 bg-slate-100",
  },
  {
    title: "Mathematics Mock Exam #4",
    set: "Set D • 2023",
    difficulty: "Medium",
    questions: 60,
    minutes: 90,
    status: "Not Taken",
    state: "new",
    icon: <Target size={30} />,
    accent: "text-slate-600 bg-slate-100",
  },
];

const answerOptions = [
  { letter: "A", value: "7.33 cm", selected: false },
  { letter: "B", value: "7.33 cm", selected: true },
  { letter: "C", value: "11.00 cm", selected: false },
  { letter: "D", value: "14.67 cm", selected: false },
];

function MockExams() {
  const [screen, setScreen] = useState("repository");

  if (screen === "exam") {
    return <ExamMode onBack={() => setScreen("list")} />;
  }

  if (screen === "list") {
    return (
      <SubjectMockList
        onBack={() => setScreen("repository")}
        onStart={() => setScreen("exam")}
      />
    );
  }

  return <MockRepository onStart={() => setScreen("list")} />;
}

function MockRepository({ onStart }) {
  return (
    <div className="space-y-8 pb-10">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            Mock Exam Repository
          </h1>
          <p className="mt-3 text-base text-gray-500">
            Select a subject to begin your timed practice session.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All Subjects", "Core Subjects", "Electives"].map((filter, index) => (
            <button
              key={filter}
              className={`rounded-full px-4 py-2 text-xs font-black ${
                index === 0
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-gray-600 hover:bg-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_280px]">
        <main className="space-y-5">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Clock3 size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-gray-950">Quick Resume</p>
              <p className="text-sm text-gray-500">
                Continue Integrated Science Mock #4 (35:12 remaining)
              </p>
            </div>
            <button
              onClick={onStart}
              className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-md shadow-blue-100 hover:bg-blue-800"
            >
              Resume Now
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {subjects.map((subject) => (
              <SubjectMockCard
                key={subject.name}
                subject={subject}
                onStart={onStart}
              />
            ))}
          </div>
        </main>

        <aside className="space-y-6">
          <PerformanceBySubject />
          <div className="rounded-3xl bg-blue-700 p-6 text-white shadow-lg shadow-blue-100">
            <h3 className="text-xl font-black">Exam Readiness</h3>
            <p className="mt-3 text-sm leading-relaxed text-blue-50">
              You have completed 45% of the total mock series available for JHS
              3.
            </p>
            <div className="mt-7 flex items-end gap-3">
              <p className="text-3xl font-black">78/150</p>
              <p className="pb-1 text-[11px] font-black uppercase text-blue-100">
                Mock papers done
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function SubjectMockList({ onBack, onStart }) {
  return (
    <div className="space-y-8 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-black text-blue-800 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Repository
      </button>

      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            Mathematics Mock Exams
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-500">
            Prepare for excellence with our curated collection of JHS
            Mathematics mock tests.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryCard value="85%" label="Subject Mastery" detail="Excellent Progress" />
          <SummaryCard value="12 / 24" label="Tests Completed" detail="Mocks" icon={<CheckCircle2 size={24} />} />
        </div>
      </section>

      <section className="space-y-4">
        {mockPapers.map((paper) => (
          <MockPaperRow key={paper.title} paper={paper} onStart={onStart} />
        ))}
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-indigo-100 p-7 md:p-10">
        <GraduationCap
          size={170}
          className="absolute right-12 top-6 hidden text-blue-200 md:block"
        />
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl font-black text-blue-900">
            Sharpen Your Geometry Skills
          </h2>
          <p className="mt-4 leading-relaxed text-gray-700">
            Our data shows you excel in Algebra but need a bit more practice in
            Geometry and Trigonometry. Try Mock #2 to challenge your spatial
            reasoning!
          </p>
          <button
            onClick={onStart}
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-4 text-sm font-black text-white shadow-md shadow-blue-100 hover:bg-blue-800"
          >
            Take Suggested Practice
            <TrendingUp size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

function ExamMode({ onBack }) {
  return (
    <div className="space-y-6 pb-10">
      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        <main className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-2xl font-black text-gray-950 md:text-3xl">
                  Mathematics Mock Exam #1
                </h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-gray-600">
                    Set A • 2024
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                    Core Subject
                  </span>
                </div>
              </div>
              <button className="rounded-xl bg-blue-700 px-7 py-4 text-sm font-black text-white shadow-md shadow-blue-100 hover:bg-blue-800">
                Submit Exam
              </button>
            </div>
          </div>

          <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-indigo-50/60 px-6 py-5">
              <p className="font-black uppercase tracking-wide text-blue-900">
                Question 14 of 60
              </p>
              <button className="flex items-center gap-2 text-sm font-black text-orange-900">
                <Flag size={17} />
                Flag for Review
              </button>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-lg font-medium leading-relaxed text-gray-950 md:text-xl">
                In the diagram below, O is the center of the circle. If the
                radius of the circle is 7cm and the angle subtended at the
                center by the arc AB is 60°, find the length of the minor arc
                AB. (Take π = 22/7)
              </h2>

              <div className="mx-auto mt-8 flex max-w-lg items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6">
                <CircleDiagram />
              </div>

              <div className="mt-9 grid gap-4 md:grid-cols-2">
                {answerOptions.map((option) => (
                  <button
                    key={`${option.letter}-${option.value}`}
                    className={`flex items-center gap-5 rounded-xl border-2 px-5 py-5 text-left transition ${
                      option.selected
                        ? "border-blue-700 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black ${
                        option.selected
                          ? "bg-blue-700 text-white"
                          : "bg-slate-100 text-gray-700"
                      }`}
                    >
                      {option.letter}
                    </span>
                    <span className="font-bold text-gray-950">
                      {option.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-5">
              <button
                onClick={onBack}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-gray-700 hover:border-blue-200 hover:text-blue-700"
              >
                <ArrowLeft size={17} />
                Previous
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-blue-700 px-7 py-3 text-sm font-black text-white shadow-md shadow-blue-100 hover:bg-blue-800">
                Next Question
                <ArrowRight size={17} />
              </button>
            </div>
          </article>
        </main>

        <ExamSidebar />
      </section>
    </div>
  );
}

function SubjectMockCard({ subject, onStart }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-8 flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${subject.accent}`}
        >
          {subject.icon}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-black ${
            subject.status === "Not Taken"
              ? "bg-slate-100 text-gray-500"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {subject.status}
        </span>
      </div>

      <h3 className="text-xl font-black text-gray-950">{subject.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-relaxed text-gray-600">
        {subject.description}
      </p>
      <p className="mt-5 flex items-center gap-2 text-sm font-medium text-gray-500">
        <FileQuestion size={15} />
        {subject.exams} Full Mock Exams
      </p>
      <button
        onClick={onStart}
        className="mt-6 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-md shadow-blue-100 hover:bg-blue-800"
      >
        Start Mock
      </button>
    </article>
  );
}

function PerformanceBySubject() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-xl font-black text-gray-950">
        Performance By Subject
      </h3>
      <div className="space-y-5">
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <p className="font-bold text-gray-700">{subject.name}</p>
              <p className="font-black text-blue-700">{subject.score}</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${subject.progressColor}`}
                style={{ width: subject.score }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 rounded-xl bg-indigo-50 p-4 text-center text-sm italic text-gray-700">
        "Success is the sum of small efforts, repeated day in and day out."
      </div>
    </div>
  );
}

function SummaryCard({ value, label, detail, icon }) {
  return (
    <div className="flex min-w-48 items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-blue-700">
        {icon || <span className="text-lg font-black text-emerald-600">{value}</span>}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="font-black text-gray-950">{detail}</p>
      </div>
    </div>
  );
}

function MockPaperRow({ paper, onStart }) {
  const isProgress = paper.state === "progress";
  const isComplete = paper.state === "completed";

  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm ${
        isProgress ? "border-l-4 border-l-orange-800" : "border-slate-100"
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${paper.accent}`}
          >
            {paper.icon}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">
                {paper.set}
              </span>
              <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-gray-500">
                {paper.difficulty}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-black text-gray-950">
              {paper.title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-5 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-2">
                <ListChecks size={16} /> {paper.questions} Questions
              </span>
              <span className="flex items-center gap-2">
                <Timer size={16} /> {paper.minutes} Minutes
              </span>
              <span
                className={`font-black ${
                  isComplete
                    ? "text-emerald-700"
                    : isProgress
                    ? "text-orange-900"
                    : "text-gray-400 italic"
                }`}
              >
                {paper.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          {isComplete && (
            <button className="rounded-xl border border-blue-900 px-6 py-4 text-sm font-black text-blue-900 hover:bg-blue-50">
              Review Results
            </button>
          )}
          <button
            onClick={onStart}
            className={`flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-black text-white shadow-md ${
              isProgress
                ? "bg-orange-800 shadow-orange-100 hover:bg-orange-900"
                : "bg-blue-700 shadow-blue-100 hover:bg-blue-800"
            }`}
          >
            {isProgress && <Play size={16} />}
            {isComplete ? "Retake Exam" : isProgress ? "Resume Mock" : "Start Mock"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ExamSidebar() {
  const answered = new Set([1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const flagged = new Set([4]);
  const current = 14;
  const visible = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <aside className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-black uppercase tracking-widest text-gray-600">
          Question Navigator
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {visible.map((item) => {
            const isCurrent = item === current;
            const isFlagged = flagged.has(item);
            const isAnswered = answered.has(item);

            return (
              <button
                key={item}
                className={`relative h-11 rounded-lg text-sm font-black ${
                  isFlagged
                    ? "bg-orange-900 text-white"
                    : isCurrent
                    ? "border-2 border-blue-700 bg-white text-blue-700"
                    : isAnswered
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-3">
          <button className="h-11 rounded-lg bg-slate-100 text-sm font-black text-slate-400">
            ...
          </button>
          <button className="h-11 rounded-lg bg-slate-100 text-sm font-black text-slate-400">
            60
          </button>
        </div>

        <div className="my-6 border-t border-slate-100" />
        <div className="mb-3 flex justify-between text-sm">
          <span className="font-medium text-gray-500">Answered</span>
          <span className="font-black text-gray-950">13 / 60</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[22%] rounded-full bg-emerald-700" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] font-black uppercase text-gray-500">
          <Legend color="bg-blue-700" label="Answered" />
          <Legend color="bg-slate-100" label="Pending" />
          <Legend color="bg-orange-900" label="Flagged" />
          <Legend outline label="Current" />
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="mb-5 text-lg font-black text-blue-900">
          Exam Resources
        </h3>
        <div className="space-y-4 text-sm font-bold text-blue-900">
          <p className="flex items-center gap-3">
            <Calculator size={17} /> Virtual Calculator
          </p>
          <p className="flex items-center gap-3">
            <NotebookPen size={17} /> Formula Sheet
          </p>
          <p className="flex items-center gap-3">
            <BarChart3 size={17} /> Scratchpad
          </p>
        </div>
      </div>
    </aside>
  );
}

function Legend({ color, label, outline = false }) {
  return (
    <span className="flex items-center gap-2">
      {outline ? (
        <span className="h-3 w-3 rounded-sm border-2 border-blue-700 bg-white" />
      ) : (
        <span className={`h-3 w-3 rounded-sm ${color}`} />
      )}
      {label}
    </span>
  );
}

function CircleDiagram() {
  return (
    <div className="relative h-56 w-72 rounded-lg border border-slate-300 bg-white shadow-lg">
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-500" />
      <div className="absolute left-1/2 top-8 h-40 border-l-2 border-slate-400" />
      <div className="absolute left-[70px] top-1/2 w-36 border-t-2 border-slate-400" />
      <div className="absolute left-1/2 top-1/2 h-24 origin-top rotate-[-45deg] border-l-2 border-slate-500" />
      <span className="absolute left-[66px] top-[106px] text-[10px] font-bold text-slate-600">
        AB
      </span>
      <span className="absolute right-[54px] top-[104px] text-[10px] font-bold text-slate-600">
        radius 7cm
      </span>
      <span className="absolute left-[145px] top-6 text-[10px] font-bold text-slate-600">
        O
      </span>
      <span className="absolute bottom-7 left-[142px] text-[10px] font-bold text-slate-600">
        7cm
      </span>
      <span className="absolute left-[118px] top-[86px] text-[10px] font-bold text-slate-600">
        60°
      </span>
    </div>
  );
}

export default MockExams;
