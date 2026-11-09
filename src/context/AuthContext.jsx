/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { getMyEntitlements } from "../services/studyContentService";

const AuthContext = createContext();

const normalizeUserProfile = (currentUser, userSnapshot, entitlements = null) => {
  const data = userSnapshot?.exists ? userSnapshot.data() : {};
  const premiumExpiresAt = entitlements?.premiumExpiresAt
    ?? data.premiumExpiresAt?.toDate?.()?.getTime?.()
    ?? null;
  const isPremium = entitlements?.isPremium
    ?? Boolean((data.isPremium || data.plan === "premium") && premiumExpiresAt && premiumExpiresAt > Date.now());
  const plan = isPremium ? "premium" : "free";

  return {
    uid: currentUser?.uid || data.uid || null,
    email: currentUser?.email || data.email || "",
    displayName: currentUser?.displayName || data.displayName || "Student",
    plan,
    isPremium,
    billingCycle: data.billingCycle || null,
    premiumExpiresAt,
    freeMocksRemaining: entitlements?.freeMocksRemaining,
    parentExportsRemaining: entitlements?.parentExportsRemaining,
    darkMode: data.darkMode ?? false,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState(0);
  const profileRequestId = useRef(0);

  useEffect(() => {
    const initialTick = window.setTimeout(() => setClock(Date.now()), 0);
    const interval = window.setInterval(() => setClock(Date.now()), 60_000);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(interval);
    };
  }, []);

  const refreshUserProfile = async (currentUser) => {
    const requestId = ++profileRequestId.current;
    if (!currentUser) {
      setUserProfile(null);
      return null;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const [entitlementsResult, userResult] = await Promise.allSettled([
      getMyEntitlements(),
      getDoc(userRef),
    ]);
    const entitlements = entitlementsResult.status === "fulfilled"
      ? entitlementsResult.value
      : null;
    if (entitlementsResult.status === "rejected") {
      console.warn("Unable to refresh account entitlements:", entitlementsResult.reason?.message);
    }
    if (userResult.status === "rejected") throw userResult.reason;

    const userSnap = userResult.value;
    const profile = normalizeUserProfile(currentUser, userSnap, entitlements);
    if (
      requestId === profileRequestId.current
      && auth.currentUser?.uid === currentUser.uid
    ) setUserProfile(profile);
    return profile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        profileRequestId.current += 1;
        setUserProfile(null);
        return;
      }

      setUserProfile(null);
      refreshUserProfile(currentUser).catch((error) => {
        console.error("Error loading user profile:", error);
        if (auth.currentUser?.uid === currentUser.uid) {
          setUserProfile({
            uid: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || "Student",
            plan: "free",
            isPremium: false,
            billingCycle: null,
            premiumExpiresAt: null,
            freeMocksRemaining: 3,
            parentExportsRemaining: 0,
            darkMode: false,
          });
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isPremium: Boolean(
          userProfile?.isPremium
          && userProfile.premiumExpiresAt
          && userProfile.premiumExpiresAt > clock,
        ),
        refreshUserProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
