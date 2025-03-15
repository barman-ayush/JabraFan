// components/Flash.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cva} from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define variants for flash notification styles
const flashVariants = cva(
  "fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-lg p-4 shadow-lg border text-sm border-l-[5px]",
  {
    variants: {
      variant: {
        default: "bg-background border-border border-l-gray-500",
        success: "bg-green-50 text-green-900 border-green-200 border-l-green-600 dark:bg-green-950 dark:text-green-50 dark:border-green-800 dark:border-l-green-500",
        error: "bg-red-50 text-red-900 border-red-200 border-l-red-600 dark:bg-red-950 dark:text-red-50 dark:border-red-800 dark:border-l-red-500",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200 border-l-yellow-600 dark:bg-yellow-950 dark:text-yellow-50 dark:border-yellow-800 dark:border-l-yellow-500",
        info: "bg-blue-50 text-blue-900 border-blue-200 border-l-blue-600 dark:bg-blue-950 dark:text-blue-50 dark:border-blue-800 dark:border-l-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type FlashContextType = {
  flash: (message: string, options?: FlashOptions) => void;
  dismiss: () => void;
};

type FlashOptions = {
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
};

const FlashContext = React.createContext<FlashContextType | null>(null);

export const useFlash = () => {
  const context = React.useContext(FlashContext);
  if (!context) {
    throw new Error("useFlash must be used within a FlashProvider");
  }
  return context;
};

export function FlashProvider({ children }: { children: React.ReactNode }) {
  const [flashState, setFlashState] = React.useState<{
    message: string;
    visible: boolean;
    variant: "default" | "success" | "error" | "warning" | "info";
    duration: number;
  }>({
    message: "",
    visible: false,
    variant: "default",
    duration: 5000,
  });

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const flash = React.useCallback((message: string, options?: FlashOptions) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setFlashState({
      message,
      visible: true,
      variant: options?.variant || "default",
      duration: options?.duration || 5000,
    });

    // Auto-dismiss
    if ((options?.duration || 5000) > 0) {
      timeoutRef.current = setTimeout(() => {
        setFlashState((prev) => ({ ...prev, visible: false }));
      }, options?.duration || 5000);
    }
  }, []);

  const dismiss = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setFlashState((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <FlashContext.Provider value={{ flash, dismiss }}>
      {children}
      <AnimatePresence>
        {flashState.visible && (
          <motion.div
            className={cn(flashVariants({ variant: flashState.variant }))}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex-1">{flashState.message}</span>
            <button
              type="button"
              onClick={() => dismiss()}
              className="ml-2 inline-flex h-6 w-6 hover:cursor-pointer items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
              aria-label="Close notification"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </FlashContext.Provider>
  );
}