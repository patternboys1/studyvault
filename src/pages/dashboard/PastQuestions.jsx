import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Circle,
  Clock3,
  FileText,
  Lightbulb,
  Sigma,
  X,
  ClipboardCheck,
} from "lucide-react";
import {
  getPapers,
  getQuestionsByPaper,
  getSubjects,
} from "../../services/studyContentService";

// --- UTILS ---
const prepareQuestion = (question) => {
  if (!question || !question.options || question.options.length === 0) return question;
  const shuffled = [...question.options]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return { ...question, shuffledOptions: shuffled };
};

const normalizeOptions = (options = []) => {
  return options.map((label, index) => ({
    label,
    letter: String.fromCharCode(65 + index),
  }));
};

// --- MAIN COMPONENT ---
export default function PastQuestions() {
  const [mode, setMode] = useState("library");
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [filters, setFilters] = useState({
    subject: "All Subjects",
    year: "All Years",
    type: "All Types",
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const { data: firestorePapers = [], isLoading: papersLoading } = useQuery({
    queryKey: ["papers"],
    queryFn: getPapers,
  });

  const selectedPaper = firestorePapers.find((paper) => paper.id === selectedPaperId);

  // Debugging logs to verify Firestore handshake
  useEffect(() => {
    if (firestorePapers.length > 0) {
      console.log("Firestore Connection Active. Papers:", firestorePapers);
    }
  }, [firestorePapers]);

  const { data: rawQuestions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["questions", selectedPaper?.subjectId, selectedPaper?.year, filters.type],
    queryFn: () => getQuestionsByPaper(selectedPaper.subjectId, selectedPaper.year, filters.type),
    enabled: mode === "practice" && Boolean(selectedPaper?.subjectId),
  });

  const questions = useMemo(
    () => rawQuestions.map(prepareQuestion),
    [rawQuestions]
  );

  const displayPapers = useMemo(() => {
    return firestorePapers.filter((paper) => {
      if (!paper) return false;

      // 1. Robust Subject Matching (Case-insensitive)
      const matchSubject = 
        filters.subject === "All Subjects" || 
        paper.subjectName?.toLowerCase() === filters.subject.toLowerCase();

      // 2. Year Matching (Handles Firestore Number vs String mismatch)
      const matchYear = 
        filters.year === "All Years" || 
        String(paper.year) === String(filters.year);

      // 3. Type Matching (Allows "Theory + Objectives" to show for either filter)
      const matchType = 
        filters.type === "All Types" || 
        paper.type?.toLowerCase().includes(filters.type.toLowerCase().replace('s', '')); 

      return matchSubject && matchYear && matchType;
    });
  }, [firestorePapers, filters]);

  if (mode === "practice") {
    return (
      <PracticeMode
        isLoading={questionsLoading}
        onBack={() => setMode("library")}
        paper={selectedPaper}
        questions={questions}
      />
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-black text-gray-900 md:text-4xl">Past Questions Library</h1>
        <p className="mt-2 text-gray-500">Access BECE Pasco history. Built for the student Community.</p>
      </header>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm grid gap-3 md:grid-cols-4">
        <FilterDropdown 
          label="Subject" 
          value={filters.subject} 
          options={["All Subjects", ...subjects.map(s => s.name || s.title)]} 
          onChange={(v) => setFilters(f => ({ ...f, subject: v }))} 
        />
        <FilterDropdown 
          label="Year" 
          value={filters.year} 
          options={["All Years", "2025", "2024", "2023", "2022"]} 
          onChange={(v) => setFilters(f => ({ ...f, year: v }))} 
        />
        <FilterDropdown 
          label="Type" 
          value={filters.type} 
          options={["All Types", "Objectives", "Theory"]} 
          onChange={(v) => setFilters(f => ({ ...f, type: v }))} 
        />
        <button 
          onClick={() => setFilters({ subject: "All Subjects", year: "All Years", type: "All Types" })} 
          className="flex items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 font-bold transition hover:bg-red-100"
        >
          <X size={16} /> Reset
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {papersLoading ? (
          <div className="col-span-full py-20 text-center animate-pulse text-gray-400 font-bold">Synchronizing Repository...</div>
        ) : displayPapers.length > 0 ? (
          displayPapers.map(paper => (
            <PaperCard key={paper.id} paper={paper} onClick={() => { setSelectedPaperId(paper.id); setMode("practice"); }} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-gray-50">
            <p className="text-gray-400 font-bold">No papers found. Try resetting filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeMode({ onBack, paper, questions, isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});

  const question = questions[currentIndex];
  if (isLoading) return <div className="p-20 text-center font-bold">Loading questions...</div>;
  if (!question) return <div className="p-20 text-center">Questions offline.</div>;

  const isTheory = !question.options || question.options.length === 0;
  const questionId = question.id || `q-${currentIndex}`;
  const isSolutionVisible = !!revealedSolutions[questionId];

  return (
    <div className="space-y-6">
      <button className="flex items-center gap-2 text-blue-700 font-black" onClick={onBack}><ArrowLeft size={16} /> Exit Practice</button>
      
      <article className="rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm">
        <div className="flex justify-between mb-6">
          <span className="bg-blue-600 px-4 py-2 text-white font-black rounded-xl text-xs uppercase">
            {isTheory ? "Theory" : "Objective"} #{question.number || currentIndex + 1}
          </span>
          <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{paper?.subjectName} {paper?.year}</span>
        </div>

        <h2 className="text-xl font-bold mb-8 text-gray-900 leading-relaxed">{question.questionText}</h2>

        {question.imageUrl && (
          <div className="mb-8 rounded-2xl border bg-gray-50 p-6 flex justify-center">
            <img src={question.imageUrl} alt="Diagram" className="max-h-72 object-contain" />
          </div>
        )}

        {isTheory ? (
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 text-center">
            <ClipboardCheck className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500 font-semibold">Theory Question: Draft your answer before revealing the marking scheme.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {normalizeOptions(question.shuffledOptions || question.options).map((opt) => (
              <button 
                key={opt.letter}
                onClick={() => setSelectedAnswers(prev => ({ ...prev, [questionId]: opt.label }))}
                className={`p-5 rounded-2xl border-2 text-left flex justify-between transition-all ${selectedAnswers[questionId] === opt.label ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-blue-200"}`}
              >
                <span className="font-semibold"><span className="text-blue-600 font-bold mr-2">{opt.letter}.</span> {opt.label}</span>
                {selectedAnswers[questionId] === opt.label && <CheckCircle2 className="text-blue-600" size={20} />}
              </button>
            ))}
          </div>
        )}

        {isSolutionVisible && (
          <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
            <h4 className="flex items-center gap-2 text-emerald-800 font-black mb-3"><Lightbulb size={20} /> Verbatim Solution:</h4>
            <div className="text-emerald-900 whitespace-pre-wrap leading-relaxed font-medium">
              {isTheory ? question.modelAnswer : `Correct Answer: ${question.correctAnswer}`}
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t flex flex-col md:flex-row justify-between gap-4">
          <button 
            onClick={() => setRevealedSolutions(p => ({ ...p, [questionId]: true }))} 
            className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 transition hover:bg-emerald-700"
          >
            Reveal Marking Scheme
          </button>
          <div className="flex gap-3">
            <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)} className="p-4 border rounded-xl hover:bg-gray-50 disabled:opacity-20"><ChevronLeft /></button>
            <button disabled={currentIndex === questions.length - 1} onClick={() => setCurrentIndex(i => i + 1)} className="flex-1 md:flex-none px-10 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">Next Question</button>
          </div>
        </div>
      </article>
    </div>
  );
}


function FilterDropdown({ label, value, options, onChange }) {
  return (
    <div className="relative group">
      <span className="absolute top-2 left-4 text-[9px] font-black text-gray-400 uppercase tracking-tighter">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-4 pt-6 pb-2 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-800 appearance-none cursor-pointer focus:bg-white focus:border-blue-600 transition-all">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-4 bottom-3 text-gray-400 group-hover:text-blue-600 transition-colors" size={14} />
    </div>
  );
}

function PaperCard({ paper, onClick }) {
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 cursor-pointer transition-all group">
      <div className="flex justify-between mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><Sigma size={20} /></div>
        <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest">{paper.year}</span>
      </div>
      <h3 className="font-black text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{paper.subjectName}</h3>
      <p className="text-[11px] text-gray-400 font-bold uppercase mb-4 tracking-tight">{paper.type || "Theory + Objectives"}</p>
      <div className="flex gap-4 text-[11px] font-bold text-gray-500 pt-4 border-t border-gray-50">
        <span className="flex items-center gap-1"><FileText size={14} className="text-blue-600"/> {paper.questionCount || 0} Questions</span>
        <span className="flex items-center gap-1"><Clock3 size={14} className="text-blue-600"/> {paper.durationMinutes || 0} Min</span>
      </div>
    </div>
  );
}
