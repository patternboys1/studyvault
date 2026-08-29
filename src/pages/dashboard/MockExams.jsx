import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Flag,
  GraduationCap,
  ListChecks,
  Play,
  RotateCcw,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getPapers, getQuestionsByPaper, saveMockAttempt } from "../../services/studyContentService";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const getOptionLetter = (index) => String.fromCharCode(65 + index);

const isCorrect = (question, selectedAnswer) => {
  if (!selectedAnswer || !question.correctAnswer) return false;

  const answer = String(question.correctAnswer).trim();
  if (answer.toUpperCase() === selectedAnswer) return true;

  const selectedOption = question.options?.[selectedAnswer.charCodeAt(0) - 65];
  return selectedOption?.trim().toLowerCase() === answer.toLowerCase();
};

export default function MockExams() {
  const [activeExam, setActiveExam] = useState(null);
  const [view, setView] = useState("repository");

  const { data: papers = [], isLoading: papersLoading } = useQuery({
    queryKey: ["mock-exam-papers"],
    queryFn: getPapers,
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["mock-exam-questions", activeExam?.paper.subjectId, activeExam?.paper.year, activeExam?.section],
    queryFn: () => getQuestionsByPaper(activeExam.paper.subjectId, activeExam.paper.year, activeExam.section),
    enabled: Boolean(activeExam?.paper.subjectId),
  });

  const startExam = (paper, section) => {
    setActiveExam({ paper, section });
    setView("exam");
  };

  const exitExam = () => {
    setActiveExam(null);
    setView("repository");
  };

  if (view === "exam" && activeExam) {
    return <MockExamSession key={`${activeExam.paper.id}-${activeExam.section}`} paper={activeExam.paper} section={activeExam.section} questions={questions} isLoading={questionsLoading} onExit={exitExam} />;
  }

  return <MockExamRepository papers={papers} isLoading={papersLoading} onStart={startExam} />;
}

function MockExamRepository({ papers, isLoading, onStart }) {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const subjects = useMemo(() => [...new Set(papers.map((paper) => paper.subjectName).filter(Boolean))], [papers]);
  const availablePapers = papers.filter((paper) => selectedSubject === "All Subjects" || paper.subjectName === selectedSubject);

  return (
    <div className="space-y-8 pb-10">
      <section className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-200 md:p-9">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-blue-200"><Trophy size={16} /> Timed Assessment Centre</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Mock Exams built from your past questions</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300">Select a paper, answer every objective question under timed exam conditions, and receive an instant score with corrections.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-bold text-slate-300">Available papers</p>
            <p className="mt-1 text-4xl font-black">{papers.length}</p>
            <p className="mt-2 text-xs font-medium text-blue-200">Objective sections are automatically marked</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-950">Choose a paper</h2>
          <p className="mt-1 text-sm text-gray-500">Every available Firebase paper can be used as a timed mock exam.</p>
        </div>
        <label className="text-sm font-bold text-gray-700">
          Subject
          <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-gray-900 outline-none transition focus:border-blue-600 md:w-64">
            <option>All Subjects</option>
            {subjects.map((subject) => <option key={subject}>{subject}</option>)}
          </select>
        </label>
      </section>

      {isLoading ? <LoadingCard label="Loading available mock papers..." /> : availablePapers.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {availablePapers.map((paper) => <MockPaperCard key={paper.id} paper={paper} onStart={onStart} />)}
        </section>
      ) : <EmptyState />}
    </div>
  );
}

function MockPaperCard({ paper, onStart }) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><GraduationCap size={23} /></div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{paper.year}</span>
      </div>
      <h3 className="mt-7 text-xl font-black text-gray-950">{paper.subjectName}</h3>
      <p className="mt-2 text-sm font-medium text-gray-500">{paper.type || "Theory + Objectives"}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 border-y border-slate-100 py-5 text-sm">
        <span className="flex items-center gap-2 font-bold text-gray-600"><FileQuestion size={16} className="text-blue-700" />{paper.questionCount || 0} questions</span>
        <span className="flex items-center gap-2 font-bold text-gray-600"><Timer size={16} className="text-blue-700" />{paper.durationMinutes || 60} min</span>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-gray-500">Choose objective questions for automatic marking or theory questions for structured written practice.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => onStart(paper, "Objectives")} className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-black text-white shadow-md shadow-blue-100 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100">
          <Play size={16} fill="currentColor" /> Objectives
        </button>
        <button type="button" onClick={() => onStart(paper, "Theory")} className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm font-black text-blue-800 transition hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100">
          <FileQuestion size={16} /> Theory
        </button>
      </div>
    </article>
  );
}

function MockExamSession({ paper, section, questions, isLoading, onExit }) {
  const { user } = useAuth();

  if (section === "Theory") {
    return <TheoryExamSession paper={paper} questions={questions} isLoading={isLoading} onExit={onExit} />;
  }

  return <ObjectiveExamSession paper={paper} questions={questions} isLoading={isLoading} userId={user?.uid} onExit={onExit} />;
}

function ObjectiveExamSession({ paper, questions, isLoading, userId, onExit }) {
  const durationInSeconds = (paper.durationMinutes || 60) * 60;
  const [attemptId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${paper.id}-${Date.now()}`
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(durationInSeconds);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);

  useEffect(() => {
    if (hasSubmitted || isLoading || questions.length === 0) return undefined;
    const interval = window.setInterval(() => {
      setTimeRemaining((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          setHasSubmitted(true);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [hasSubmitted, isLoading, questions.length]);

  if (isLoading) return <LoadingCard label="Preparing your mock exam..." />;

  if (questions.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <button type="button" onClick={onExit} className="flex items-center gap-2 text-sm font-black text-blue-700 hover:underline"><ArrowLeft size={16} /> Back to mock exams</button>
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <FileQuestion className="mx-auto text-slate-300" size={42} />
          <h1 className="mt-4 text-2xl font-black text-gray-950">No objective questions found</h1>
          <p className="mx-auto mt-3 max-w-md text-gray-500">Upload the objective JSON file for this paper before starting its mock exam.</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter((question) => isCorrect(question, answers[question.id])).length;
  const restartExam = () => {
    setCurrentIndex(0);
    setAnswers({});
    setFlaggedQuestions({});
    setTimeRemaining(durationInSeconds);
    setHasSubmitted(false);
    setShowSubmitPrompt(false);
  };

  if (hasSubmitted) return <MockResults paper={paper} questions={questions} answers={answers} correctCount={correctCount} attemptId={attemptId} userId={userId} onRestart={restartExam} onExit={onExit} />;

  const question = questions[currentIndex];
  const selectedAnswer = answers[question.id];
  const completion = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button type="button" onClick={onExit} className="mb-3 flex items-center gap-2 text-sm font-black text-blue-700 hover:underline"><ArrowLeft size={16} /> Exit mock exam</button>
            <h1 className="text-2xl font-black text-gray-950 md:text-3xl">{paper.subjectName} {paper.year} Mock Exam</h1>
            <p className="mt-1 text-sm text-gray-500">Objective paper • Answers save while you navigate</p>
          </div>
          <div className="flex items-center justify-between gap-5 rounded-2xl bg-slate-950 px-5 py-4 text-white lg:min-w-56">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300"><Clock3 size={16} /> Time left</span>
            <span className="text-2xl font-black tabular-nums">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </section>

      {showSubmitPrompt && (
        <section className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 md:flex-row md:items-center md:justify-between">
          <div><p className="font-black text-amber-950">Ready to submit your answers?</p><p className="mt-1 text-sm text-amber-900">You have answered {answeredCount} of {questions.length} questions.</p></div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowSubmitPrompt(false)} className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-black text-amber-900">Keep working</button>
            <button type="button" onClick={() => setHasSubmitted(true)} className="rounded-xl bg-amber-700 px-4 py-3 text-sm font-black text-white hover:bg-amber-800">Submit now</button>
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-black text-gray-950">Question {currentIndex + 1} <span className="text-gray-400">of {questions.length}</span></p>
            <button type="button" onClick={() => setFlaggedQuestions((currentFlags) => ({ ...currentFlags, [question.id]: !currentFlags[question.id] }))} className={`flex items-center gap-2 text-sm font-black transition ${flaggedQuestions[question.id] ? "text-amber-700" : "text-gray-500 hover:text-amber-700"}`}>
              <Flag size={17} fill={flaggedQuestions[question.id] ? "currentColor" : "none"} />{flaggedQuestions[question.id] ? "Flagged for review" : "Flag for review"}
            </button>
          </div>

          <div className="p-6 md:p-9">
            <h2 className="text-lg font-bold leading-relaxed text-gray-950 md:text-xl">{question.questionText}</h2>
            {question.imageUrl && <div className="mt-7 flex justify-center rounded-2xl border bg-slate-50 p-5"><img src={question.imageUrl} alt="Question diagram" className="max-h-80 object-contain" /></div>}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {question.options?.map((option, index) => {
                const letter = getOptionLetter(index);
                const isSelected = selectedAnswer === letter;
                return (
                  <button key={letter} type="button" onClick={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: letter }))} className={`flex min-h-20 items-center gap-4 rounded-2xl border-2 p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${isSelected ? "border-blue-700 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${isSelected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700"}`}>{letter}</span>
                    <span className="font-semibold leading-relaxed text-gray-900">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-5">
            <button type="button" onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))} disabled={currentIndex === 0} className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={17} /> Previous</button>
            <button type="button" onClick={() => setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))} disabled={currentIndex === questions.length - 1} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-md shadow-blue-100 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">Next <ArrowRight size={17} /></button>
          </div>
        </main>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between"><h3 className="font-black text-gray-950">Question navigator</h3><span className="text-sm font-black text-blue-700">{answeredCount}/{questions.length}</span></div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {questions.map((item, index) => {
                const isCurrent = index === currentIndex;
                const isFlagged = flaggedQuestions[item.id];
                const isAnswered = answers[item.id];
                return <button key={item.id} type="button" onClick={() => setCurrentIndex(index)} aria-label={`Go to question ${index + 1}`} className={`relative h-10 rounded-lg text-sm font-black transition ${isCurrent ? "ring-2 ring-blue-700 ring-offset-2" : isFlagged ? "bg-amber-500 text-white" : isAnswered ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{index + 1}</button>;
              })}
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${completion}%` }} /></div>
            <p className="mt-3 text-sm text-gray-500">{completion}% completed</p>
          </div>

          <div className="rounded-3xl bg-blue-700 p-6 text-white shadow-lg shadow-blue-100">
            <ListChecks size={24} className="text-blue-100" />
            <h3 className="mt-4 text-xl font-black">Finish your exam</h3>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">Check your flagged questions before submitting for instant marking.</p>
            <button type="button" onClick={() => setShowSubmitPrompt(true)} className="mt-6 w-full rounded-xl bg-white px-4 py-3.5 text-sm font-black text-blue-700 transition hover:bg-blue-50">Submit exam</button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function TheoryExamSession({ paper, questions, isLoading, onExit }) {
  const durationInSeconds = (paper.durationMinutes || 60) * 60;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(durationInSeconds);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);

  useEffect(() => {
    if (hasSubmitted || isLoading || questions.length === 0) return undefined;
    const interval = window.setInterval(() => {
      setTimeRemaining((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          setHasSubmitted(true);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [hasSubmitted, isLoading, questions.length]);

  if (isLoading) return <LoadingCard label="Preparing your theory mock..." />;

  if (questions.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <button type="button" onClick={onExit} className="flex items-center gap-2 text-sm font-black text-blue-700 hover:underline"><ArrowLeft size={16} /> Back to mock exams</button>
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <FileQuestion className="mx-auto text-slate-300" size={42} />
          <h1 className="mt-4 text-2xl font-black text-gray-950">No theory questions found</h1>
          <p className="mx-auto mt-3 max-w-md text-gray-500">Upload the theory JSON file for this paper before starting its theory mock.</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.values(responses).filter((response) => response.trim()).length;
  const question = questions[currentIndex];
  const completion = Math.round((answeredCount / questions.length) * 100);
  const restartExam = () => {
    setCurrentIndex(0);
    setResponses({});
    setFlaggedQuestions({});
    setTimeRemaining(durationInSeconds);
    setHasSubmitted(false);
    setShowSubmitPrompt(false);
  };

  if (hasSubmitted) {
    return <TheoryResults paper={paper} questions={questions} responses={responses} onRestart={restartExam} onExit={onExit} />;
  }

  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button type="button" onClick={onExit} className="mb-3 flex items-center gap-2 text-sm font-black text-blue-700 hover:underline"><ArrowLeft size={16} /> Exit theory mock</button>
            <h1 className="text-2xl font-black text-gray-950 md:text-3xl">{paper.subjectName} {paper.year} Theory Mock</h1>
            <p className="mt-1 text-sm text-gray-500">Write your response, then compare it with the marking guide after submission.</p>
          </div>
          <div className="flex items-center justify-between gap-5 rounded-2xl bg-slate-950 px-5 py-4 text-white lg:min-w-56">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300"><Clock3 size={16} /> Time left</span>
            <span className="text-2xl font-black tabular-nums">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </section>

      {showSubmitPrompt && (
        <section className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 md:flex-row md:items-center md:justify-between">
          <div><p className="font-black text-amber-950">Ready to review the marking guide?</p><p className="mt-1 text-sm text-amber-900">You have drafted {answeredCount} of {questions.length} responses.</p></div>
          <div className="flex gap-3"><button type="button" onClick={() => setShowSubmitPrompt(false)} className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-black text-amber-900">Keep writing</button><button type="button" onClick={() => setHasSubmitted(true)} className="rounded-xl bg-amber-700 px-4 py-3 text-sm font-black text-white hover:bg-amber-800">Review answers</button></div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-black text-gray-950">Question {currentIndex + 1} <span className="text-gray-400">of {questions.length}</span></p>
            <button type="button" onClick={() => setFlaggedQuestions((currentFlags) => ({ ...currentFlags, [question.id]: !currentFlags[question.id] }))} className={`flex items-center gap-2 text-sm font-black transition ${flaggedQuestions[question.id] ? "text-amber-700" : "text-gray-500 hover:text-amber-700"}`}><Flag size={17} fill={flaggedQuestions[question.id] ? "currentColor" : "none"} />{flaggedQuestions[question.id] ? "Flagged for review" : "Flag for review"}</button>
          </div>
          <div className="p-6 md:p-9">
            <h2 className="text-lg font-bold leading-relaxed text-gray-950 md:text-xl">{question.questionText}</h2>
            {question.imageUrl && <div className="mt-7 flex justify-center rounded-2xl border bg-slate-50 p-5"><img src={question.imageUrl} alt="Question diagram" className="max-h-80 object-contain" /></div>}
            <label className="mt-8 block text-sm font-black text-gray-800">
              Your response
              <textarea value={responses[question.id] || ""} onChange={(event) => setResponses((currentResponses) => ({ ...currentResponses, [question.id]: event.target.value }))} placeholder="Write your answer here. Your response stays available while you move between questions." className="mt-3 min-h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-base font-medium leading-relaxed text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50" />
            </label>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-5">
            <button type="button" onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))} disabled={currentIndex === 0} className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={17} /> Previous</button>
            <button type="button" onClick={() => setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))} disabled={currentIndex === questions.length - 1} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-md shadow-blue-100 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">Next <ArrowRight size={17} /></button>
          </div>
        </main>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between"><h3 className="font-black text-gray-950">Question navigator</h3><span className="text-sm font-black text-blue-700">{answeredCount}/{questions.length}</span></div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {questions.map((item, index) => {
                const isCurrent = index === currentIndex;
                const isFlagged = flaggedQuestions[item.id];
                const isAnswered = responses[item.id]?.trim();
                return <button key={item.id} type="button" onClick={() => setCurrentIndex(index)} aria-label={`Go to question ${index + 1}`} className={`relative h-10 rounded-lg text-sm font-black transition ${isCurrent ? "ring-2 ring-blue-700 ring-offset-2" : isFlagged ? "bg-amber-500 text-white" : isAnswered ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{index + 1}</button>;
              })}
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${completion}%` }} /></div>
            <p className="mt-3 text-sm text-gray-500">{completion}% drafted</p>
          </div>
          <div className="rounded-3xl bg-blue-700 p-6 text-white shadow-lg shadow-blue-100">
            <ListChecks size={24} className="text-blue-100" /><h3 className="mt-4 text-xl font-black">Review your work</h3><p className="mt-2 text-sm leading-relaxed text-blue-100">Submit when you are ready to compare each response with the model answer.</p>
            <button type="button" onClick={() => setShowSubmitPrompt(true)} className="mt-6 w-full rounded-xl bg-white px-4 py-3.5 text-sm font-black text-blue-700 transition hover:bg-blue-50">Review marking guide</button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function TheoryResults({ paper, questions, responses, onRestart, onExit }) {
  const draftedCount = Object.values(responses).filter((response) => response.trim()).length;

  return (
    <div className="space-y-7 pb-10">
      <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-200 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">Theory mock complete</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><h1 className="text-3xl font-black md:text-4xl">{paper.subjectName} {paper.year}</h1><p className="mt-2 text-slate-300">Compare your work carefully against the marking guide.</p></div><p className="text-4xl font-black text-emerald-300">{draftedCount}/{questions.length}</p></div>
      </section>
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h2 className="text-2xl font-black text-gray-950">Model answers</h2><p className="mt-1 text-sm text-gray-500">Use the points below to self-assess and improve your response.</p></div><div className="flex flex-wrap gap-3"><button type="button" onClick={onExit} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-gray-700 hover:border-blue-200 hover:text-blue-700">Back to papers</button><button type="button" onClick={onRestart} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-md shadow-blue-100 hover:bg-blue-800"><RotateCcw size={16} /> Retake theory</button></div></div>
        <div className="mt-7 space-y-5">
          {questions.map((question, index) => <article key={question.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5"><p className="text-sm font-black text-blue-700">Question {question.number || index + 1}</p><p className="mt-2 font-bold leading-relaxed text-gray-900">{question.questionText}</p>{question.imageUrl && <div className="mt-4 flex justify-center rounded-2xl border bg-white p-5"><img src={question.imageUrl} alt="Question diagram" className="max-h-80 object-contain" /></div>}{responses[question.id]?.trim() && <div className="mt-4 rounded-xl border border-blue-100 bg-white p-4"><p className="text-xs font-black uppercase tracking-widest text-blue-700">Your response</p><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{responses[question.id]}</p></div>}<div className="mt-4 rounded-xl bg-emerald-50 p-4"><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Model answer</p><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-emerald-950">{question.modelAnswer || "No model answer has been added yet."}</p></div></article>)}
        </div>
      </section>
    </div>
  );
}

function MockResults({ paper, questions, answers, correctCount, attemptId, userId, onRestart, onExit }) {
  const score = Math.round((correctCount / questions.length) * 100);
  const missedQuestions = questions.filter((question) => !isCorrect(question, answers[question.id]));

  useEffect(() => {
    if (!userId) return undefined;

    saveMockAttempt(userId, {
      id: attemptId,
      paperId: paper.id,
      subjectId: paper.subjectId,
      subjectName: paper.subjectName,
      year: paper.year,
      section: "Objectives",
      score,
      correctCount,
      answeredCount: Object.keys(answers).length,
      totalQuestions: questions.length,
    }).catch((error) => console.error("Unable to save mock attempt:", error));

    return undefined;
  }, [answers, attemptId, correctCount, paper.id, paper.subjectId, paper.subjectName, paper.year, questions.length, score, userId]);

  return (
    <div className="space-y-7 pb-10">
      <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-200 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">Mock exam complete</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><h1 className="text-3xl font-black md:text-4xl">{paper.subjectName} {paper.year}</h1><p className="mt-2 text-slate-300">Your objective-paper score is ready and saved to Performance.</p></div><p className="text-6xl font-black text-emerald-300">{score}%</p></div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <ResultStat label="Correct" value={correctCount} icon={<CheckCircle2 size={22} />} color="text-emerald-700 bg-emerald-50" />
        <ResultStat label="Incorrect" value={questions.length - correctCount} icon={<XCircle size={22} />} color="text-red-700 bg-red-50" />
        <ResultStat label="Answered" value={`${Object.keys(answers).length}/${questions.length}`} icon={<FileQuestion size={22} />} color="text-blue-700 bg-blue-50" />
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-2xl font-black text-gray-950">Review corrections</h2><p className="mt-1 text-sm text-gray-500">Use the correct answers below to guide your revision.</p></div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onExit} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-gray-700 hover:border-blue-200 hover:text-blue-700">Back to papers</button>
            <button type="button" onClick={onRestart} className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-md shadow-blue-100 hover:bg-blue-800"><RotateCcw size={16} /> Retake exam</button>
          </div>
        </div>

        {missedQuestions.length > 0 ? <div className="mt-7 space-y-4">
          {missedQuestions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const correctAnswer = String(question.correctAnswer || "").toUpperCase();
            const correctOption = question.options?.[correctAnswer.charCodeAt(0) - 65];
            return (
              <article key={question.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm font-black text-blue-700">Question {question.number || index + 1}</p>
                <p className="mt-2 font-bold leading-relaxed text-gray-900">{question.questionText}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2"><p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">Your answer: {selectedAnswer || "Not answered"}</p><p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">Correct answer: {correctAnswer}{correctOption ? ` — ${correctOption}` : ""}</p></div>
                {question.explanation && <p className="mt-4 text-sm leading-relaxed text-gray-600">{question.explanation}</p>}
              </article>
            );
          })}
        </div> : <div className="mt-7 rounded-2xl bg-emerald-50 p-8 text-center text-emerald-900"><CheckCircle2 className="mx-auto" size={36} /><p className="mt-3 text-lg font-black">Excellent work — every answer is correct.</p></div>}
      </section>
    </div>
  );
}

function ResultStat({ label, value, icon, color }) {
  return <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>{icon}</div><p className="mt-5 text-3xl font-black text-gray-950">{value}</p><p className="mt-1 text-sm font-bold text-gray-500">{label}</p></article>;
}

function LoadingCard({ label }) {
  return <div className="rounded-3xl border border-slate-100 bg-white p-16 text-center shadow-sm"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" /><p className="mt-5 font-black text-gray-700">{label}</p></div>;
}

function EmptyState() {
  return <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-14 text-center"><FileQuestion className="mx-auto text-slate-300" size={44} /><h2 className="mt-4 text-2xl font-black text-gray-950">No mock papers available yet</h2><p className="mx-auto mt-3 max-w-lg text-gray-500">Upload a past-question paper to Firebase and it will appear here automatically.</p></div>;
}
