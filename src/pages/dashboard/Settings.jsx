import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
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
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

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
  { id: "timer", label: "Exam timer warning", options: ["5 minutes", "10 minutes", "15 minutes", "No warning"], default: "10 minutes" },
];

const defaultNotifications = Object.fromEntries(notificationOptions.map(({ id, default: value }) => [id, value]));
const defaultPreferences = Object.fromEntries(studyPreferencesOptions.map(({ id, default: value }) => [id, value]));

function Settings() {
  const { user, userProfile, isPremium } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [school, setSchool] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [securityMessage, setSecurityMessage] = useState("");

  useEffect(() => {
    let active = true;
    const loadSettings = async () => {
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (!active || !snapshot.exists()) return;
        const data = snapshot.data();
        setNotifications({ ...defaultNotifications, ...data.notificationSettings });
        setPreferences({ ...defaultPreferences, ...data.studyPreferences });
        setSchool(data.school || "");
        setClassLevel(data.classLevel || "");
      } catch (error) {
        if (active) setSaveStatus(`error:${error.message || "Unable to load saved settings."}`);
      } finally {
        if (active) setIsLoadingSettings(false);
      }
    };
    loadSettings();
    return () => { active = false; };
  }, [user.uid]);

  const handleNotificationToggle = (id) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePreferenceChange = (id, value) => {
    setPreferences((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (isLoadingSettings) return;
    setSaveStatus("saving");
    try {
      await setDoc(doc(db, "users", user.uid), {
        studyPreferences: preferences,
        notificationSettings: notifications,
        school: school.trim(),
        classLevel: classLevel.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSaveStatus("saved");
      window.setTimeout(() => setSaveStatus((status) => status === "saved" ? null : status), 3000);
    } catch (error) {
      setSaveStatus(`error:${error.message || "Unable to save settings."}`);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setSecurityMessage("This account does not have an email address for password recovery.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      setSecurityMessage(`Password reset email sent to ${user.email}.`);
    } catch (error) {
      setSecurityMessage(error.message || "Unable to send the password reset email.");
    }
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
          disabled={saveStatus === "saving" || isLoadingSettings}
          className={`flex w-fit items-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-white shadow-md transition ${
            saveStatus === "saved"
              ? "bg-emerald-700 hover:bg-emerald-800"
              : "bg-blue-700 hover:bg-blue-800 disabled:opacity-50"
          }`}
        >
          <Save size={16} />
          {isLoadingSettings ? "Loading..." : saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : saveStatus?.startsWith("error:") ? "Retry Save" : "Save Changes"}
        </button>
      </section>
      {saveStatus?.startsWith("error:") && <p role="alert" className="-mt-5 text-sm font-bold text-red-700">{saveStatus.slice(6)}</p>}

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <ProfileCard user={user} userProfile={userProfile} isPremium={isPremium} />
          <SecurityCard user={user} onPasswordReset={handlePasswordReset} message={securityMessage} />
          <ThemeCard isDark={isDark} toggleTheme={toggleTheme} />
        </aside>

        <main className="space-y-6">
          <AccountForm user={user} school={school} setSchool={setSchool} classLevel={classLevel} setClassLevel={setClassLevel} />
          <PreferencesCard preferences={preferences} onPreferenceChange={handlePreferenceChange} />
          <NotificationsCard notifications={notifications} onToggle={handleNotificationToggle} />
        </main>
      </section>
    </div>
  );
}

function ProfileCard({ user, userProfile, isPremium }) {
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
    </article>
  );
}

function SecurityCard({ user, onPasswordReset, message }) {
  const providers = user?.providerData?.map((provider) => provider.providerId) || [];
  const hasPasswordProvider = providers.includes("password");
  const hasGoogleProvider = providers.includes("google.com");
  const statuses = [
    ["Email verified", Boolean(user?.emailVerified)],
    ["Google sign-in enabled", hasGoogleProvider],
    ["Password recovery available", Boolean(user?.email && hasPasswordProvider)],
  ];
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
        {statuses.map(
          ([item, enabled]) => (
            <p
              key={item}
              className={`flex items-center gap-3 text-sm font-bold ${enabled ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}
            >
              <CheckCircle2 size={17} className={enabled ? "text-emerald-700 dark:text-emerald-400" : "text-gray-300 dark:text-gray-600"} />
              {item}: {enabled ? "Enabled" : "Not enabled"}
            </p>
          )
        )}
      </div>
      <button type="button" onClick={onPasswordReset} disabled={!user?.email || !hasPasswordProvider} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-gray-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600">
        <KeyRound size={16} />
        Send Password Reset Email
      </button>
      {message && <p role="status" className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">{message}</p>}
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

function AccountForm({ user, school, setSchool, classLevel, setClassLevel }) {
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
        <Field label="School" value={school} onChange={setSchool} placeholder="Enter your school" />
        <Field label="Class Level" value={classLevel} onChange={setClassLevel} placeholder="For example, JHS 3" />
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

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-gray-700 dark:text-gray-300">{label}</span>
      <input
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        readOnly={!onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300"
      />
    </label>
  );
}

export default Settings;
