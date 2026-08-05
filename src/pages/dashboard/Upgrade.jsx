import {
  ArrowRight,
  CheckCircle2,
  Crown,
  FileQuestion,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

const planFeatures = [
  "Unlimited mock exams",
  "AI feedback and focus recommendations",
  "Full past question explanations",
  "Parent-ready progress reports",
  "Advanced performance analytics",
  "Priority access to new papers",
];

const comparison = [
  ["Mock exams", "3 per month", "Unlimited"],
  ["Past question access", "Limited years", "All available years"],
  ["AI recommendations", "Basic", "Personalized"],
  ["Reports", "Monthly summary", "Detailed exports"],
];

function Upgrade() {
  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-blue-700 p-7 text-white shadow-xl shadow-blue-100 md:p-10">
        <GraduationCap
          size={220}
          className="absolute -right-8 top-4 hidden text-white/10 md:block"
        />
        <div className="relative z-10 max-w-2xl">
          <p className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-50">
            <Crown size={15} />
            Study Vault Pro
          </p>
          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            Upgrade your BECE preparation with smarter practice.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-blue-50">
            Unlock unlimited mock exams, AI-powered focus areas, detailed
            reports, and full access to Study Vault's growing past question
            library.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-blue-700 transition hover:bg-blue-50">
              Upgrade Now
              <ArrowRight size={17} />
            </button>
            <button className="rounded-xl border border-white/30 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10">
              Compare Plans
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <BenefitCard
              icon={<FileQuestion size={22} />}
              title="Unlimited Practice"
              body="Take as many subject mocks and past paper sessions as you need."
            />
            <BenefitCard
              icon={<Sparkles size={22} />}
              title="AI Focus"
              body="Get topic recommendations based on your wrong answers and scores."
            />
            <BenefitCard
              icon={<Trophy size={22} />}
              title="Exam Reports"
              body="Track readiness, strengths, weak spots, and mock history."
            />
          </div>

          <PlanComparison />
        </main>

        <aside className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <p className="text-sm font-bold text-emerald-300">Recommended</p>
            <h2 className="mt-2 text-2xl font-black">Pro Plan</h2>
            <div className="mt-5 flex items-end gap-2">
              <p className="text-5xl font-black">GHS 49</p>
              <p className="pb-2 text-sm text-slate-400">/ month</p>
            </div>
            <button className="mt-6 w-full rounded-xl bg-emerald-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-200">
              Start Pro Access
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {planFeatures.map((feature) => (
              <p
                key={feature}
                className="flex items-center gap-3 text-sm font-bold text-gray-700"
              >
                <CheckCircle2 size={18} className="text-emerald-700" />
                {feature}
              </p>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-blue-900">
              <ShieldCheck size={17} />
              Secure student billing
            </p>
            <p className="mt-2 text-sm leading-relaxed text-blue-800">
              Payment integration can be connected later when the product flow
              is ready.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function BenefitCard({ icon, title, body }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        {icon}
      </div>
      <h2 className="mt-5 text-lg font-black text-gray-950">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
    </article>
  );
}

function PlanComparison() {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Zap size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-950">Plan Comparison</h2>
          <p className="text-sm text-gray-500">
            See what changes when you move to Pro.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100">
        <div className="grid grid-cols-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase text-gray-500">
          <span>Feature</span>
          <span>Free</span>
          <span>Pro</span>
        </div>
        {comparison.map(([feature, free, pro]) => (
          <div
            key={feature}
            className="grid grid-cols-3 border-t border-slate-100 px-4 py-4 text-sm"
          >
            <span className="font-black text-gray-950">{feature}</span>
            <span className="text-gray-500">{free}</span>
            <span className="font-black text-emerald-700">{pro}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default Upgrade;
