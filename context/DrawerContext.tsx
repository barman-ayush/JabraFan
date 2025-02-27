// components/AuthDrawerContext.tsx
"use client";

import * as React from "react";

type AuthDrawerContextType = {
  openDrawer: (initialPhone?: string) => void;
  closeDrawer: () => void;
  isOpen: boolean;
};

const AuthDrawerContext = React.createContext<AuthDrawerContextType | null>(null);

export function useAuthDrawer() {
  const context = React.useContext(AuthDrawerContext);
  if (!context) {
    throw new Error("useAuthDrawer must be used within an AuthDrawerProvider");
  }
  return context;
}

export function AuthDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialPhone, setInitialPhone] = React.useState("");

  const openDrawer = React.useCallback((phone?: string) => {
    if (phone) {
      setInitialPhone(phone);
    }
    setIsOpen(true);
  }, []);

  const closeDrawer = React.useCallback(() => {
    setIsOpen(false);
    // Reset initialPhone after drawer closes
    setTimeout(() => setInitialPhone(""), 300);
  }, []);

  return (
    <AuthDrawerContext.Provider value={{ openDrawer, closeDrawer, isOpen }}>
      {children}
    </AuthDrawerContext.Provider>
  );
}