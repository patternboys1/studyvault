import {
  Bell,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  Mail,
  MonitorSmartphone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const notificationOptions = [
  ["Mock exam reminders", true],
  ["Weekly performance summary", true],
  ["New past question uploads", false],
  ["Parent report emails", true],
];

const studyPreferences = [
  ["Default subject", "Mathematics"],
  ["Practice mode", "Show answers after attempt"],
  ["Daily question target", "25 questions"],
  ["Exam timer warning", "10 minutes remaining"],
];

function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-10">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-500">
            Manage your profile, study preferences, alerts, and account security.
          </p>
        </div>
        <button className="flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-md shadow-blue-100 transition hover:bg-blue-800">
          <Save size={16} />
          Save Changes
        </button>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <ProfileCard user={user} />
          <SecurityCard />
        </aside>

        <main className="space-y-6">
          <AccountForm user={user} />
          <PreferencesCard />
          <NotificationsCard />
        </main>
      </section>
    </div>
  );
}

function ProfileCard({ user }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
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
      <h2 className="mt-4 text-xl font-black text-gray-950">
        {user?.displayName || "Study Vault Student"}
      </h2>
      <p className="mt-1 text-sm font-medium text-gray-500">
        JHS 3 Student • Greater Accra
      </p>
      <button className="mt-6 w-full rounded-xl border border-blue-900 px-4 py-3 text-sm font-black text-blue-900 transition hover:bg-blue-50">
        Change Photo
      </button>
    </article>
  );
}

function SecurityCard() {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 className="font-black text-gray-950">Account Security</h2>
          <p className="text-sm text-gray-500">Your account is protected</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {["Email verified", "Google sign-in enabled", "Password recovery ready"].map(
          (item) => (
            <p
              key={item}
              className="flex items-center gap-3 text-sm font-bold text-gray-600"
            >
              <CheckCircle2 size={17} className="text-emerald-700" />
              {item}
            </p>
          )
        )}
      </div>
      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-gray-700 transition hover:bg-slate-200">
        <KeyRound size={16} />
        Change Password
      </button>
    </article>
  );
}

function AccountForm({ user }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <User size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-950">Profile Details</h2>
          <p className="text-sm text-gray-500">
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

function PreferencesCard() {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-blue-700">
          <MonitorSmartphone size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-950">Study Preferences</h2>
          <p className="text-sm text-gray-500">
            Control how practice and mock exams behave.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {studyPreferences.map(([label, value]) => (
          <button
            key={label}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-left transition hover:border-blue-100 hover:bg-blue-50/50"
          >
            <span>
              <span className="block text-sm font-black text-gray-950">
                {label}
              </span>
              <span className="mt-1 block text-sm text-gray-500">{value}</span>
            </span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        ))}
      </div>
    </article>
  );
}

function NotificationsCard() {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
          <Bell size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-950">Notifications</h2>
          <p className="text-sm text-gray-500">
            Choose which learning alerts you want to receive.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notificationOptions.map(([label, enabled]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-4"
          >
            <p className="flex items-center gap-3 text-sm font-bold text-gray-700">
              <Mail size={16} className="text-gray-400" />
              {label}
            </p>
            <button
              className={`relative h-7 w-12 rounded-full transition ${
                enabled ? "bg-blue-700" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  enabled ? "left-6" : "left-1"
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
      <span className="mb-2 block text-sm font-black text-gray-700">{label}</span>
      <input
        value={value}
        readOnly
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export default Settings;
