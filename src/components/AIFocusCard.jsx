import { Zap, ArrowRight } from "lucide-react";

const AIFocusCard = () => {
  const recommendations = [
    {
      label: "Focus Topic",
      title: "Quadratic Equations (Math)",
      body: "You missed 4 similar questions in your last practice.",
      tag: "15 mins",
    },
    {
      label: "Suggested Resource",
      title: "Science Past Papers (2022)",
      body: "Master the Integrated Science trends from last year.",
      tag: "40 questions",
    },
  ];

  return (
    <div className="bg-slate-950 rounded-3xl p-6 text-white shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="text-emerald-400" size={21} />
        <h3 className="font-bold text-lg">AI Focus</h3>
      </div>

      <div className="space-y-4 flex-1">
        {recommendations.map((item, index) => (
          <div key={index} className="bg-white/10 border border-white/10 p-4 rounded-xl hover:bg-white/15 transition-colors cursor-pointer group">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 mb-2">
              {item.label}
            </p>
            <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.body}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase bg-emerald-300 text-emerald-950 px-3 py-1 rounded">
                {item.tag}
              </span>
              <ArrowRight size={15} className="text-slate-400 group-hover:text-white" />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-4 bg-emerald-300 hover:bg-emerald-200 rounded-xl text-sm font-black text-slate-950 flex items-center justify-center gap-2 transition-all">
        Generate Personal Mock
      </button>
    </div>
  );
};

export default AIFocusCard;
