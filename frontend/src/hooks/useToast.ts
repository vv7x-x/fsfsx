import { useState, useCallback } from "react";

interface UseToastOptions {
  duration?: number;
}

export const useToast = (options: UseToastOptions = {}) => {
  const { duration = 3000 } = options;
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | "info">("info");

  const show = useCallback(
    (msg: string, msgType: "success" | "error" | "info" = "info") => {
      setMessage(msg);
      setType(msgType);
      setTimeout(() => setMessage(null), duration);
    },
    [duration]
  );

  return { message, type, show };
};
