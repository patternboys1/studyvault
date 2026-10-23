/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
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

  useEffect(() => {
    const initialTick = window.setTimeout(() => setClock(Date.now()), 0);
    const interval = window.setInterval(() => setClock(Date.now()), 60_000);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(interval);
    };
  }, []);

  const refreshUserProfile = async (currentUser) => {
    if (!currentUser) {
      setUserProfile(null);
      return null;
    }

    const userRef = doc(db, "users", currentUser.uid);
    let entitlements = null;
    try {
      entitlements = await getMyEntitlements();
    } catch (error) {
      console.warn("Unable to refresh account entitlements:", error.message);
    }
    const userSnap = await getDoc(userRef);
    const profile = normalizeUserProfile(currentUser, userSnap, entitlements);

    await setDoc(
      userRef,
      {
        uid: currentUser.uid,
        email: currentUser.email || profile.email,
        displayName: currentUser.displayName || profile.displayName,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setUserProfile(profile);
    return profile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          await refreshUserProfile(currentUser);
        } catch (error) {
          console.error("Error loading user profile:", error);
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
      } else {
        setUserProfile(null);
      }

      setLoading(false);
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
