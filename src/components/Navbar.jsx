import { useEffect, useState } from "react";
import { Menu, Search, Bell, HelpCircle, CheckCheck } from "lucide-react";
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [notificationSnapshot, setNotificationSnapshot] = useState({ uid: null, items: [] });
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }
    const notificationsQuery = query(
      collection(db, "users", user.uid, "notifications"),
      where("visibleInApp", "==", true),
      orderBy("createdAt", "desc"),
      limit(15),
    );
    return onSnapshot(notificationsQuery, (snapshot) => {
      setNotificationSnapshot({
        uid: user.uid,
        items: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
      });
    }, (error) => console.error("Unable to load in-app notifications:", error));
  }, [user?.uid]);

  const notifications = notificationSnapshot.uid === user?.uid ? notificationSnapshot.items : [];
  const unreadCount = notifications.filter((item) => !item.read).length;
  const markNotificationRead = async (notification) => {
    if (notification.read || !user?.uid) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "notifications", notification.id), { read: true });
    } catch (error) {
      console.error("Unable to mark notification as read:", error);
    }
  };

  return (
    <header className="h-20 bg-white border-b px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 lg:gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar - Hidden on very small screens to make room for name */}
        <div className="relative hidden sm:block w-48 md:w-64 lg:w-96">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      {/* Right Side Tools & Identity */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Icons - Hidden on small mobile to prioritize the Name */}
        <div className="flex items-center gap-4 border-r pr-4 md:pr-6 border-gray-100 text-gray-400">
          <div className="relative">
            <button type="button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={isNotificationPanelOpen} onClick={() => setIsNotificationPanelOpen((open) => !open)} className="relative rounded-lg p-2 transition hover:bg-gray-100 hover:text-blue-600">
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 text-[10px] font-black text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
            {isNotificationPanelOpen && <div className="absolute right-0 top-12 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left text-gray-800 shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <div><h2 className="text-sm font-black text-gray-900 dark:text-white">Notifications</h2><p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{unreadCount ? `${unreadCount} unread` : "You are all caught up"}</p></div>
                {unreadCount > 0 && <button type="button" onClick={async () => { await Promise.all(notifications.filter((item) => !item.read).map(markNotificationRead)); }} className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300"><CheckCheck size={14} /> Mark read</button>}
              </div>
              <div className="max-h-[min(60vh,420px)] overflow-y-auto">
                {notifications.length ? notifications.map((notification) => <Link key={notification.id} to={notification.href || "/dashboard"} onClick={() => { markNotificationRead(notification); setIsNotificationPanelOpen(false); }} className={`block border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 ${notification.read ? "opacity-70" : ""}`}>
                  <span className="flex items-start gap-3"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.read ? "bg-transparent" : "bg-blue-600"}`} /><span><span className="block text-sm font-bold text-gray-900 dark:text-white">{notification.title}</span><span className="mt-1 block text-xs leading-relaxed text-gray-600 dark:text-gray-300">{notification.message}</span><span className="mt-1 block text-[10px] font-medium text-gray-400">{notification.createdAt?.toDate?.().toLocaleString?.() || "Just now"}</span></span></span>
                </Link>) : <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">New study alerts will appear here.</p>}
              </div>
              <Link to="/dashboard/settings" onClick={() => setIsNotificationPanelOpen(false)} className="block bg-slate-50 px-4 py-3 text-center text-xs font-bold text-blue-700 hover:bg-blue-50 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-700">Manage notification preferences</Link>
            </div>}
          </div>
          <button className="hover:text-blue-600">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* User Identity - ALWAYS VISIBLE NOW */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right">
            <p className="text-[13px] md:text-sm font-bold text-gray-900 leading-tight">
              {user?.displayName || "Student"}
            </p>
            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">
              JHS 3 Student
            </p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-blue-600 p-0.5 shadow-sm">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=2563eb&color=fff`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
