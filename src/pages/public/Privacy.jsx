import { Link } from "react-router-dom";

const sections = [
  {
    title: "Information we use",
    paragraphs: [
      "When you create or use an account, Study Vault processes your name, email address, account identifier, and the sign-in information managed by Firebase Authentication.",
      "To provide study features, we store information such as mock exam activity, scores, progress, preferences, and account settings. If you make a Pro purchase, we store the payment reference and related plan and verification details.",
    ],
  },
  {
    title: "How information is used",
    paragraphs: [
      "We use this information to operate your account, show your study progress, provide the features you request, manage Pro access, and protect the service.",
      "If you use AI recommendations or AI Study Chat, the relevant study scores or the message and recent conversation context you submit are sent to Google Gemini to generate a response. AI chat messages are not saved to your Study Vault account database by the chat service.",
    ],
  },
  {
    title: "Service providers",
    paragraphs: [
      "Study Vault uses Firebase services for authentication and data storage. Paystack processes payments; Study Vault receives payment verification details such as a transaction reference and plan information, not your full card details.",
      "These providers process information under their own privacy terms. Please review their policies when using their services.",
    ],
  },
  {
    title: "Your choices and account",
    paragraphs: [
      "You can choose whether to use optional AI features. You can contact us to ask about your account information or request help with your account.",
      "Study Vault is designed for BECE students, including minors. Students should use the service with guidance from a parent, guardian, or teacher where appropriate.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      "We may update this policy as the service changes. The current version will be available on this page.",
    ],
  },
];

function Privacy() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <Link to="/" className="text-sm font-bold text-blue-700 hover:text-blue-800">
          Study Vault
        </Link>
        <h1 className="mt-5 text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="mt-3 leading-7 text-slate-600">
          This policy explains what information Study Vault uses and how it supports the study, account, and payment features you choose to use.
        </p>

        <div className="mt-8 space-y-8">
          {sections.map(({ title, paragraphs }) => (
            <section key={title}>
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <div className="mt-2 space-y-3 text-sm leading-7 text-slate-600">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 border-t border-slate-100 pt-6 text-sm leading-7 text-slate-600">
          Questions about privacy or your account? Visit our{" "}
          <Link to="/contact" className="font-bold text-blue-700 hover:text-blue-800">
            Contact page
          </Link>
          .
        </p>
      </article>
    </main>
  );
}

export default Privacy;
