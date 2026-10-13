import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  Mail,
  MonitorSmartphone,
  Moon,
  Save,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const notificationOptions = [
  { id: "mocks", label: "Mock exam reminders", default: true },
  { id: "weekly", label: "Weekly performance summary", default: true },
  { id: "questions", label: "New past question uploads", default: false },
  { id: "parent", label: "Parent report emails", default: true },
];

const studyPreferencesOptions = [
  { id: "subject", label: "Default subject", options: ["Mathematics", "English", "Science", "Social Studies", "RME"], default: "Mathematics" },
  { id: "practice", label: "Practice mode", options: ["Show answers immediately", "Show answers after attempt", "No answers until review"], default: "Show answers after attempt" },
  { id: "target", label: "Daily question target", options: ["10 questions", "15 questions", "25 questions", "50 questions"], default: "25 questions" },
  { id: "timer", label: "Exam timer warning", options: ["5 minutes", "10 minutes", "15 minutes", "No warning"], default: "10 minutes remaining" },
];

function Settings() {
  const { user, userProfile, isPremium, setUserPlan } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(
    notificationOptions.reduce((acc, opt) => ({ ...acc, [opt.id]: opt.default }), {})
  );
  const [preferences, setPreferences] = useState(
    studyPreferencesOptions.reduce((acc, opt) => ({ ...acc, [opt.id]: opt.default }), {})
  );
  const [saveStatus, setSaveStatus] = useState(null);

  const handleNotificationToggle = (id) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePreferenceChange = (id, value) => {
    setPreferences((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-10 dark:bg-slate-900">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white md:text-4xl">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-500 dark:text-gray-400">
            Manage your profile, study preferences, alerts, and account security.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`flex w-fit items-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-white shadow-md transition ${
            saveStatus === "saved"
              ? "bg-emerald-700 hover:bg-emerald-800"
              : "bg-blue-700 hover:bg-blue-800 disabled:opacity-50"
          }`}
        >
          <Save size={16} />
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Changes"}
        </button>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <ProfileCard user={user} userProfile={userProfile} isPremium={isPremium} onTogglePremium={setUserPlan} />
          <SecurityCard />
          <ThemeCard isDark={isDark} toggleTheme={toggleTheme} />
        </aside>

        <main className="space-y-6">
          <AccountForm user={user} />
          <PreferencesCard preferences={preferences} onPreferenceChange={handlePreferenceChange} />
          <NotificationsCard notifications={notifications} onToggle={handleNotificationToggle} />
        </main>
      </section>
    </div>
  );
}

function ProfileCard({ user, userProfile, isPremium, onTogglePremium }) {
  const planLabel = isPremium ? "Premium" : "Free";

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <img
        src={
          user?.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.displayName || "Study Vault"
          )}&background=1d4ed8&color=fff`
        }
        alt=""
        className="mx-auto h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
      />
      <h2 className="mt-4 text-xl font-black text-gray-950 dark:text-white">
        {user?.displayName || "Study Vault Student"}
      </h2>
      <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
        {userProfile?.plan ? `${planLabel} plan` : "JHS 3 Student • Greater Accra"}
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
          isPremium ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
        }`}>
          {planLabel}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onTogglePremium(isPremium ? "free" : "premium", isPremium ? null : "monthly")}
        className="mt-6 w-full rounded-xl border border-blue-900 px-4 py-3 text-sm font-black text-blue-900 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30"
      >
        {isPremium ? "Switch to Free" : "Enable Test Premium"}
      </button>
    </article>
  );
}

function SecurityCard() {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 className="font-black text-gray-950 dark:text-white">Account Security</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your account is protected</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {["Email verified", "Google sign-in enabled", "Password recovery ready"].map(
          (item) => (
            <p
              key={item}
              className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300"
            >
              <CheckCircle2 size={17} className="text-emerald-700 dark:text-emerald-400" />
              {item}
            </p>
          )
        )}
      </div>
      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-gray-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600">
        <KeyRound size={16} />
        Change Password
      </button>
    </article>
  );
}

function ThemeCard({ isDark, toggleTheme }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          isDark ? "bg-purple-900/30 text-purple-400" : "bg-yellow-50 text-yellow-700"
        }`}>
          {isDark ? <Moon size={22} /> : <Sun size={22} />}
        </div>
        <div>
          <h2 className="font-black text-gray-950 dark:text-white">Appearance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Theme settings</p>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-xl border-2 border-slate-200 px-4 py-4 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-700"
        >
          <span className="flex items-center gap-3 text-sm font-black text-gray-700 dark:text-gray-200">
            {isDark ? (
              <>
                <Moon size={16} className="text-purple-400" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun size={16} className="text-yellow-600" />
                Light Mode
              </>
            )}
          </span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Change</span>
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {isDark ? "Dark mode is enabled. Your eyes will thank you!" : "Light mode is active. Perfect for bright environments."}
      </p>
    </article>
  );
}

function AccountForm({ user }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <User size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white">Profile Details</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            These details help personalize your dashboard.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full Name" value={user?.displayName || "Study Vault Student"} />
        <Field label="Email Address" value={user?.email || "student@studyvault.app"} />
        <Field label="School" value="Accra Junior High School" />
        <Field label="Class Level" value="JHS 3" />
      </div>
    </article>
  );
}

function PreferencesCard({ preferences, onPreferenceChange }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-blue-700 dark:bg-indigo-900/30 dark:text-indigo-400">
          <MonitorSmartphone size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white">Study Preferences</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Control how practice and mock exams behave.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {studyPreferencesOptions.map((pref) => (
          <div key={pref.id}>
            <label className="block text-sm font-black text-gray-700 mb-2 dark:text-gray-300">{pref.label}</label>
            <select
              value={preferences[pref.id]}
              onChange={(e) => onPreferenceChange(pref.id, e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500"
            >
              {pref.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </article>
  );
}

function NotificationsCard({ notifications, onToggle }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          <Bell size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white">Notifications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose which learning alerts you want to receive.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notificationOptions.map((opt) => (
          <div
            key={opt.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-4 dark:border-slate-700"
          >
            <p className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
              <Mail size={16} className="text-gray-400 dark:text-gray-500" />
              {opt.label}
            </p>
            <button
              onClick={() => onToggle(opt.id)}
              className={`relative h-7 w-12 rounded-full transition ${
                notifications[opt.id] ? "bg-blue-700 dark:bg-blue-600" : "bg-slate-200 dark:bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  notifications[opt.id] ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}

function Field({ label, value }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{label}</span>
      <input
        value={value}
        readOnly
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300"
      />
    </label>
  );
}

export default Settings;
