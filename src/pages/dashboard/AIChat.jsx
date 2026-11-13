import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Crown, LoaderCircle, MessageCircle, RotateCcw, Send, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAIChatStatus, sendAIChatMessage } from "../../services/aiRecommendationService";

const DAILY_MESSAGE_LIMIT = 15;

export default function AIChat() {
  const { isPremium, userProfile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [remainingToday, setRemainingToday] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  useEffect(() => {
    if (!isPremium) return;
    getAIChatStatus()
      .then((status) => setRemainingToday(status.remainingToday))
      .catch(() => setError("We couldn't load your daily message count. You can still send a question; your limit will be checked when you send."));
  }, [isPremium]);

  if (authLoading || !userProfile) {
    return <div className="flex min-h-64 items-center justify-center text-sm font-semibold text-slate-500">Loading your account…</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || isSending || !isPremium) return;

    setDraft("");
    setError("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setIsSending(true);

    try {
      const response = await sendAIChatMessage(message, messages);
      setMessages((current) => [...current, { role: "assistant", content: response.reply }]);
      setRemainingToday(response.remainingToday);
    } catch (requestError) {
      setError(requestError.message || "AI Study Chat couldn't reply. Please try again.");
      if (Number.isFinite(requestError.remainingToday)) {
        setRemainingToday(requestError.remainingToday);
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!isPremium) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <MessageCircle size={30} />
        </div>
        <span className="mt-6 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-900">
          <Crown size={14} /> Pro feature
        </span>
        <h1 className="mt-4 text-3xl font-black text-slate-950">Meet your AI Study Tutor</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Ask questions about BECE subjects, get clear explanations, and plan what to study next. Pro includes up to 15 chat messages each day.
        </p>
        <Link to="/dashboard/upgrade" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800">
          Explore Pro <ArrowRight size={17} />
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[min(75vh,760px)] max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 md:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white"><Bot size={25} /></div>
          <div>
            <div className="flex items-center gap-2"><h1 className="text-xl font-black text-slate-950">AI Study Tutor</h1><span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900">Pro</span></div>
            <p className="mt-1 text-xs text-slate-500">Ask a BECE study question and get a clear explanation.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">{remainingToday === null ? `Up to ${DAILY_MESSAGE_LIMIT} messages per day` : `${remainingToday} messages left today`}</span>
          <button type="button" onClick={() => { setMessages([]); setError(""); }} disabled={!messages.length || isSending} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Clear chat">
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/70 p-4 md:p-7" aria-live="polite" aria-label="Chat messages">
        {!messages.length && (
          <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
            <Sparkles className="mx-auto text-blue-700" size={25} />
            <h2 className="mt-3 font-black text-slate-900">What are you studying today?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Try “Explain photosynthesis in simple terms” or “How do I find the area of a triangle?”</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${message.role === "user" ? "bg-slate-200 text-slate-700" : "bg-blue-100 text-blue-800"}`}>
              {message.role === "user" ? <UserRound size={16} /> : <Bot size={17} />}
            </div>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-tr-sm bg-blue-700 text-white" : "rounded-tl-sm border border-slate-200 bg-white text-slate-800"}`}>
              {message.content}
            </div>
          </div>
        ))}
        {isSending && <div className="flex items-center gap-2 text-sm font-medium text-slate-500"><LoaderCircle size={17} className="animate-spin" /> Your tutor is thinking…</div>}
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-4 md:p-5">
        <label htmlFor="ai-chat-message" className="sr-only">Your study question</label>
        <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <textarea id="ai-chat-message" value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 1500))} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={2} maxLength={1500} placeholder="Ask your study question…" disabled={isSending || remainingToday === 0} className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50" />
          <button type="submit" disabled={isSending || !draft.trim() || remainingToday === 0} className="mb-0.5 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300">
            <Send size={16} /><span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-2 px-1 text-[11px] text-slate-500">
          <span>Up to 15 messages per day. Chats stay in this browser session and aren’t saved to your account.</span>
          <span>{draft.length}/1500</span>
        </div>
        <p className="mt-2 px-1 text-[11px] text-slate-400">AI can make mistakes. Check important answers against your class notes and textbooks.</p>
      </form>
    </section>
  );
}
