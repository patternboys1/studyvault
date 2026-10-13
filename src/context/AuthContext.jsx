/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

const normalizeUserProfile = (currentUser, userSnapshot) => {
  const data = userSnapshot?.exists ? userSnapshot.data() : {};
  const plan = data.plan || "free";
  const isPremium = Boolean(data.isPremium || plan === "premium");

  return {
    uid: currentUser?.uid || data.uid || null,
    email: currentUser?.email || data.email || "",
    displayName: currentUser?.displayName || data.displayName || "Student",
    plan,
    isPremium,
    billingCycle: data.billingCycle || null,
    darkMode: data.darkMode ?? false,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async (currentUser) => {
    if (!currentUser) {
      setUserProfile(null);
      return null;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    const profile = normalizeUserProfile(currentUser, userSnap);

    await setDoc(
      userRef,
      {
        uid: currentUser.uid,
        email: currentUser.email || profile.email,
        displayName: currentUser.displayName || profile.displayName,
        plan: profile.plan,
        isPremium: profile.isPremium,
        billingCycle: profile.billingCycle,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setUserProfile(profile);
    return profile;
  };

  const setUserPlan = async (plan = "free", billingCycle = null) => {
    if (!user) return false;

    const normalizedPlan = plan === "premium" ? "premium" : "free";
    const nextProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Student",
      plan: normalizedPlan,
      isPremium: normalizedPlan === "premium",
      billingCycle: normalizedPlan === "premium" ? billingCycle : null,
      updatedAt: serverTimestamp(),
    };

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, nextProfile, { merge: true });
    setUserProfile((current) => ({ ...(current || {}), ...nextProfile }));
    return true;
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
        isPremium: Boolean(userProfile?.isPremium),
        refreshUserProfile,
        setUserPlan,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
