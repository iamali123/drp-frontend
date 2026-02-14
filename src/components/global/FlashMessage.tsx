import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type FlashType = "success" | "error" | "info";

interface FlashMessageProps {
  message: string;
  type?: FlashType;
  duration?: number;
  onDismiss?: () => void;
}

export function FlashMessage({
  message,
  type = "success",
  duration = 5000,
  onDismiss,
}: FlashMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  if (!visible || !message) return null;

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 z-[100] w-full max-w-md -translate-x-1/2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg transition-opacity duration-300",
        type === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800",
        type === "error" && "border-red-200 bg-red-50 text-red-800",
        type === "info" && "border-sky-200 bg-sky-50 text-sky-800"
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
