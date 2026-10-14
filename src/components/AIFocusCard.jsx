import { useEffect, useState } from "react";
import { Zap, ArrowRight, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStudyRecommendations } from "../services/aiRecommendationService";

const AIFocusCard = ({ attempts = [], isPremium = true }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationProvider, setRecommendationProvider] = useState("rules");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRecommendations = async () => {
      setIsLoading(true);
      const result = await getStudyRecommendations(attempts, {
        user,
        allowRemote: isPremium,
      });

      if (active) {
        setRecommendations(result.recommendations);
        setRecommendationProvider(result.provider);
        setIsLoading(false);
      }
    };

    loadRecommendations();

    return () => {
      active = false;
    };
  }, [attempts, user, isPremium]);

  const handleAiAction = () => {
    if (isPremium) {
      navigate("/dashboard/mock-exams");
      return;
    }

    navigate("/dashboard/upgrade");
  };

  return (
    <div className="bg-slate-950 rounded-3xl p-6 text-white shadow-xl h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Zap className="text-emerald-400" size={21} />
          <h3 className="font-bold text-lg">AI Focus</h3>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
            {isPremium ? <Crown size={12} /> : <Sparkles size={12} />}
            {isPremium ? "Pro" : "Lite"}
          </span>
          <span
            role="status"
            className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${
              isLoading
                ? "bg-white/10 text-slate-300"
                : recommendationProvider === "gemini"
                  ? "bg-emerald-300 text-emerald-950"
                  : "bg-amber-300 text-amber-950"
            }`}
          >
            {isLoading
              ? "Checking AI"
              : recommendationProvider === "gemini"
                ? "Gemini 3.8 Flash"
                : recommendationProvider === "rules" && isPremium
                  ? "Rule fallback"
                  : recommendationProvider === "rules"
                    ? "Rule preview"
                    : "Source unknown"}
          </span>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 rounded-xl bg-white/10" />
            <div className="h-20 rounded-xl bg-white/10" />
          </div>
        ) : (
          recommendations.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={handleAiAction}
              className="w-full rounded-xl border border-white/10 bg-white/10 p-4 text-left transition-colors hover:bg-white/15 group"
            >
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                {item.label}
              </p>
              <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.body}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded bg-emerald-300 px-3 py-1 text-[10px] font-black uppercase text-emerald-950">
                  {item.tag}
                </span>
                <ArrowRight size={15} className="text-slate-400 group-hover:text-white" />
              </div>
            </button>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={handleAiAction}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 py-4 text-sm font-black text-slate-950 transition-all hover:bg-emerald-200"
      >
        {isPremium ? "Generate Personal Mock" : "Upgrade to Pro"}
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default AIFocusCard;
