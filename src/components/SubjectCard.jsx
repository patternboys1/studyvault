import { BookOpen } from "lucide-react";

const SubjectCard = ({ name, lastScore, mastery, icon, status, onReview, onPractice }) => {
  const statusStyles = {
    Strong: { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" },
    Average: { bg: "bg-orange-100", text: "text-orange-700", bar: "bg-orange-500" },
    Critical: { bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500" },
  };

  const style = statusStyles[status] || statusStyles.Average;

  const handleClick = () => {
    if (status === "Critical" && onReview) {
      onReview(name);
      return;
    }

    if (onPractice) {
      onPractice(name);
    }
  };

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
            {icon || <BookOpen size={20} />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
            <p className="text-[11px] text-gray-400 font-medium">Last score: {lastScore}%</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
          {status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-gray-400">Mastery</span>
          <span className="text-gray-900">{mastery}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${style.bar}`} 
            style={{ width: `${mastery}%` }}
          ></div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className={`w-full mt-5 py-2 rounded-lg text-xs font-bold transition-colors ${
          status === "Critical"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-blue-100 text-blue-700 hover:bg-blue-50 bg-white"
        }`}
      >
        {status === "Critical" ? "Review Errors" : "Practice"}
      </button>
    </div>
  );
};

export default SubjectCard;
