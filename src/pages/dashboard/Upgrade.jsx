import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Crown,
  FileQuestion,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
  X,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const getPlanAmount = (planId) => {
  if (planId === "monthly") return 49;
  if (planId === "yearly") return 499;
  return 0;
};

let paystackScriptPromise;

const loadPaystackScript = () => {
  if (window.PaystackPop) return Promise.resolve();
  if (paystackScriptPromise) return paystackScriptPromise;

  paystackScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => {
      if (window.PaystackPop) {
        resolve();
      } else {
        paystackScriptPromise = null;
        reject(new Error("Paystack checkout loaded without its payment API."));
      }
    };
    script.onerror = () => {
      paystackScriptPromise = null;
      reject(new Error("Unable to load Paystack checkout. Check your connection or content blocker."));
    };
    document.body.appendChild(script);
  });

  return paystackScriptPromise;
};

const pricingPlans = [
  {
    id: "free",
    name: "Free Plan",
    description: "Perfect for getting started",
    price: "0",
    period: "Forever",
    color: "slate",
    buttonText: "Get Started",
    badge: null,
    features: [
      { text: "3 mock exams per month", included: true },
      { text: "Basic performance tracking", included: true },
      { text: "Limited past questions (2020-2021)", included: true },
      { text: "Study calendar", included: true },
      { text: "Monthly summary reports", included: false },
      { text: "AI focus recommendations", included: false },
      { text: "Detailed question explanations", included: false },
      { text: "Priority support", included: false },
      { text: "Parent progress reports", included: false },
    ],
  },
  {
    id: "monthly",
    name: "Pro Monthly",
    description: "Best for consistent preparation",
    price: "49",
    period: "month",
    color: "blue",
    buttonText: "Start Monthly",
    badge: null,
    features: [
      { text: "Unlimited mock exams", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Full past question library", included: true },
      { text: "AI-powered focus areas", included: true },
      { text: "Detailed exam readiness reports", included: true },
      { text: "Topic-wise explanations", included: true },
      { text: "Priority support", included: true },
      { text: "Parent progress reports", included: false },
      { text: "Cancel anytime", included: true },
    ],
  },
  {
    id: "yearly",
    name: "Pro Yearly",
    description: "Maximum savings & commitment",
    price: "499",
    period: "year",
    color: "emerald",
    buttonText: "Get Yearly Access",
    badge: "Save 16%",
    featured: true,
    features: [
      { text: "Unlimited mock exams", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Full past question library", included: true },
      { text: "AI-powered focus recommendations", included: true },
      { text: "Detailed exam readiness reports", included: true },
      { text: "Topic-wise explanations", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Parent progress reports (3 exports/month)", included: true },
      { text: "Early access to new papers", included: true },
    ],
  },
];

const planFeatures = [
  "Unlimited mock exams",
  "AI feedback and focus recommendations",
  "Full past question explanations",
  "Parent-ready progress reports",
  "Advanced performance analytics",
  "Priority access to new papers",
];

const comparison = [
  ["Mock exams per month", "3", "Unlimited", "Unlimited"],
  ["Past question years", "2020-2021", "All available", "All available"],
  ["AI recommendations", "No", "Yes", "Yes"],
  ["Performance reports", "Monthly only", "Unlimited", "Unlimited"],
  ["Question explanations", "No", "Yes", "Yes"],
  ["Parent sharing", "No", "No", "Yes"],
  ["Priority support", "No", "Yes", "Yes"],
];

function Upgrade() {
  const navigate = useNavigate();
  const { user, userProfile, setUserPlan, isPremium } = useAuth();
  const [processingPlan, setProcessingPlan] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    loadPaystackScript().catch((error) => {
      setPaymentMessage(error.message || "Unable to load Paystack checkout.");
    });
  }, []);

  const handleSelectPlan = async (planId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (planId === "free") {
      await setUserPlan("free", null);
      navigate("/dashboard");
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const verifyEndpoint = import.meta.env.VITE_PAYSTACK_VERIFY_ENDPOINT;

    if (!publicKey) {
      setPaymentMessage("Add your Paystack public key in VITE_PAYSTACK_PUBLIC_KEY to enable live payments.");
      return;
    }

    if (!verifyEndpoint) {
      setPaymentMessage("Set VITE_PAYSTACK_VERIFY_ENDPOINT to your deployed Cloud Function URL before enabling premium payments.");
      return;
    }

    if (!window.PaystackPop) {
      setPaymentMessage("Paystack checkout is still loading. Please try again in a moment.");
      return;
    }

    try {
      setProcessingPlan(planId);
      setPaymentMessage("");

      const amount = getPlanAmount(planId) * 100;
      const popup = new window.PaystackPop();
      popup.newTransaction({
        key: publicKey,
        email: user.email || "student@studyvault.app",
        amount,
        currency: "GHS",
        reference: `studyvault-${user.uid}-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: planId },
            { display_name: "User UID", variable_name: "user_uid", value: user.uid },
          ],
        },
        onSuccess: (response) => {
          const reference = response.reference || response.trxref;
          const verifyPayment = async () => {
            const token = await user.getIdToken();
            const verificationResponse = await fetch(verifyEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ reference, planId }),
            });

            const verificationData = await verificationResponse.json();
            if (!verificationResponse.ok) {
              const providerMessage = verificationData?.details?.message
                || verificationData?.details?.data?.gateway_response;
              const amountMismatch = verificationData?.expectedAmount != null
                ? `Expected GHS ${(verificationData.expectedAmount / 100).toFixed(2)}, received ${verificationData.receivedCurrency || "unknown currency"} ${((verificationData.receivedAmount || 0) / 100).toFixed(2)}.`
                : "";
              const message = [
                verificationData?.error || "Payment verification failed.",
                providerMessage,
                amountMismatch,
                `(HTTP ${verificationResponse.status})`,
              ].filter(Boolean).join(" ");

              throw new Error(message);
            }

            await setUserPlan("premium", planId);
            setPaymentMessage(`Payment verified successfully. Reference: ${reference}`);
            navigate("/dashboard");
          };

          verifyPayment()
            .catch((error) => {
              setPaymentMessage(error.message || "Payment verification failed. Please contact support.");
            })
            .finally(() => setProcessingPlan(null));
        },
        onCancel: () => {
          setProcessingPlan(null);
          setPaymentMessage("Payment window closed. No charge was made.");
        },
        onError: (error) => {
          setProcessingPlan(null);
          setPaymentMessage(error.message || "Paystack could not start this transaction.");
        },
      });
    } catch (error) {
      setPaymentMessage(error.message || "Payment failed. Please try again.");
      setProcessingPlan(null);
    }
  };

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-600 to-blue-800 p-7 text-white shadow-xl shadow-blue-100 md:p-12">
        <GraduationCap
          size={280}
          className="absolute -right-12 top-2 hidden text-white/8 md:block"
        />
        <Sparkles size={40} className="absolute left-8 top-8 text-blue-300/20" />
        <div className="relative z-10 max-w-2xl">
          <p className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-100">
            <Crown size={15} />
            Study Vault Pro
          </p>
          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            Unlock your full BECE potential today.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-blue-100">
            From free practice to unlimited access—choose the plan that fits your study goals. AI recommendations, detailed analytics, and full exam papers await.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-700">Current account status</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">
              {isPremium ? "Premium access unlocked" : "Free plan active"}
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
            <Crown size={16} />
            {isPremium ? "Pro member" : "Upgrade available"}
          </div>
        </div>

        {paymentMessage && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
            {paymentMessage}
          </div>
        )}
      </section>

      {/* Pricing Cards */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-950">Flexible Plans For Every Student</h2>
          <p className="mt-2 text-gray-600">Start free or upgrade for unlimited practice and expert insights</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={
                plan.id === "free"
                  ? !isPremium
                  : isPremium && userProfile?.billingCycle === plan.id
              }
              onSelectPlan={handleSelectPlan}
              isProcessing={processingPlan === plan.id}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-950">Why Upgrade?</h2>
          <p className="mt-2 text-gray-600">Access premium features designed for BECE success</p>
        </div>
        
        <div className="grid gap-5 md:grid-cols-3">
          <BenefitCard
            icon={<FileQuestion size={22} />}
            title="Unlimited Practice"
            body="Take as many subject mocks and past paper sessions as you need to master every topic."
          />
          <BenefitCard
            icon={<Sparkles size={22} />}
            title="AI-Powered Focus"
            body="Get intelligent topic recommendations based on your performance and weakest areas."
          />
          <BenefitCard
            icon={<Trophy size={22} />}
            title="Detailed Reports"
            body="Track readiness scores, exam strengths, weak spots, and full performance history."
          />
        </div>
      </section>

      {/* Comparison Table */}
      <PlanComparison />

      {/* Security Note */}
      <section className="rounded-2xl bg-blue-50 p-6">
        <div className="flex gap-4">
          <ShieldCheck size={24} className="shrink-0 text-blue-700" />
          <div>
            <h3 className="font-black text-blue-900">Secure Payment & Billing</h3>
            <p className="mt-1 text-sm leading-relaxed text-blue-800">
              All transactions are encrypted and secure. Payment integration will be connected when ready. Start with free or monthly plans risk-free.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingCard({ plan, isCurrentPlan, onSelectPlan, isProcessing }) {
  const colorClasses = {
    slate: {
      bg: "bg-white",
      border: "border-slate-200",
      badge: "bg-slate-100 text-slate-700",
      button: "bg-slate-900 hover:bg-slate-800 text-white",
      accent: "text-slate-700",
    },
    blue: {
      bg: "bg-white",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      accent: "text-blue-700",
    },
    emerald: {
      bg: "bg-gradient-to-b from-slate-950 to-slate-900",
      border: "border-emerald-500",
      badge: "bg-emerald-500 text-white",
      button: "bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black",
      accent: "text-emerald-400",
      textColor: "text-white",
    },
  };

  const colors = colorClasses[plan.color];

  return (
    <article
      className={`relative rounded-3xl border-2 ${colors.border} ${colors.bg} p-6 shadow-lg transition hover:shadow-xl ${
        plan.featured ? "lg:scale-105 lg:shadow-2xl" : ""
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className={`rounded-full ${colors.badge} px-4 py-1 text-xs font-black`}>
            {plan.badge}
          </div>
        </div>
      )}

      <div className={plan.featured ? "text-white" : ""}>
        {/* Plan Header */}
        <div>
          <h3 className={`text-lg font-black ${plan.featured ? "text-emerald-400" : colors.accent}`}>
            {plan.name}
          </h3>
          <p className={`mt-1 text-sm ${plan.featured ? "text-gray-300" : "text-gray-600"}`}>
            {plan.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-6 flex items-baseline gap-2">
          <span className={`text-4xl font-black ${plan.featured ? "text-white" : "text-gray-950"}`}>
            GHS {plan.price}
          </span>
          <span className={`text-sm font-bold ${plan.featured ? "text-gray-400" : "text-gray-500"}`}>
            /{plan.period}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelectPlan(plan.id)}
          disabled={isCurrentPlan || isProcessing}
          className={`mt-6 w-full rounded-xl px-5 py-3 text-sm font-black transition ${
            isCurrentPlan || isProcessing ? "cursor-default bg-slate-200 text-slate-500" : colors.button
          }`}
        >
          {isCurrentPlan ? "Current Plan" : isProcessing ? "Processing..." : plan.buttonText}
          {!isCurrentPlan && !isProcessing && <ArrowRight size={16} className="ml-2 inline" />}
        </button>

        {/* Features */}
        <div className="mt-7 space-y-3 border-t border-gray-200 pt-7">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {feature.included ? (
                <Check
                  size={18}
                  className={`shrink-0 font-bold ${
                    plan.featured ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              ) : (
                <X size={18} className="shrink-0 text-gray-300" />
              )}
              <span
                className={`text-sm font-bold ${
                  feature.included
                    ? plan.featured
                      ? "text-white"
                      : "text-gray-900"
                    : plan.featured
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function BenefitCard({ icon, title, body }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-blue-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        {icon}
      </div>
      <h2 className="mt-5 text-lg font-black text-gray-950">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </article>
  );
}

function PlanComparison() {
  return (
    <article className="rounded-3xl border-2 border-slate-100 bg-white p-8 shadow-lg">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <TrendingUp size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-950">Detailed Comparison</h2>
          <p className="mt-1 text-sm text-gray-600">
            See what you get with each plan
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50">
              <th className="px-4 py-4 text-left text-xs font-black uppercase text-gray-600">
                Feature
              </th>
              <th className="px-4 py-4 text-center text-xs font-black uppercase text-gray-600">
                Free
              </th>
              <th className="px-4 py-4 text-center text-xs font-black uppercase text-gray-600">
                Pro Monthly
              </th>
              <th className="px-4 py-4 text-center text-xs font-black uppercase text-blue-700">
                Pro Yearly ⭐
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-4 py-4 text-sm font-black text-gray-900">
                  {row[0]}
                </td>
                <td className="px-4 py-4 text-center text-sm text-gray-600">
                  {row[1]}
                </td>
                <td className="px-4 py-4 text-center text-sm">
                  <span className="font-bold text-blue-700">{row[2]}</span>
                </td>
                <td className="px-4 py-4 text-center text-sm">
                  <span className="font-black text-emerald-700">{row[3]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl bg-emerald-50 p-4">
        <p className="text-sm font-bold text-emerald-900">
          ✨ Yearly plan includes early access to new papers and priority support
        </p>
      </div>
    </article>
  );
}

export default Upgrade;
