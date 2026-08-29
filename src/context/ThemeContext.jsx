import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Monitor auth state and load theme from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // User is logged in - load theme from Firebase
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().darkMode !== undefined) {
            const isDarkMode = userSnap.data().darkMode;
            setIsDark(isDarkMode);
            updateDOM(isDarkMode);
            console.log("Theme loaded from Firebase:", isDarkMode ? "dark" : "light");
          } else {
            // New user or no preference - check system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDark(prefersDark);
            updateDOM(prefersDark);
            console.log("Using system preference:", prefersDark ? "dark" : "light");
          }
        } catch (error) {
          console.error("Error loading theme from Firebase:", error);
          // Fall back to system preference
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          setIsDark(prefersDark);
          updateDOM(prefersDark);
        }
      } else {
        // User is not logged in - use system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(prefersDark);
        updateDOM(prefersDark);
        console.log("User logged out, using system preference");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateDOM = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    updateDOM(newValue);

    // Save to Firebase if user is logged in
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { darkMode: newValue }, { merge: true });
        console.log("Theme saved to Firebase:", newValue ? "dark" : "light");
      } catch (error) {
        console.error("Error saving theme to Firebase:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

