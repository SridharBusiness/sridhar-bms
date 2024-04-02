"use client";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

type UserProfileData = {
  fullName: string;
  email: string;
  uid: string;
  role: string;
  photoURL?: string;
};

interface UserContextProps {
  user: UserProfileData | null;
}

const AuthContext = createContext<UserContextProps>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data() as UserProfileData;
          const storageRef = ref(storage, `profile-pictures/${user.uid}`);
          const photoURL = await getDownloadURL(storageRef);
          userData.photoURL = photoURL;
          setUser(userData);
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
