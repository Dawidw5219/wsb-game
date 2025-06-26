import { toast } from "sonner";
import type { ToastType, ToastOptions } from "@/types";

export const useToast = () => {
  const showToast = (
    message: string,
    type: ToastType = "info",
    options: ToastOptions = {}
  ) => {
    const defaultOptions = {
      position: "bottom-right" as const,
      duration: 3000,
      ...options,
    };

    switch (type) {
      case "success":
        toast.success(message, defaultOptions);
        break;
      case "error":
        toast.error(message, defaultOptions);
        break;
      case "warning":
        toast.warning(message, defaultOptions);
        break;
      default:
        toast(message, defaultOptions);
        break;
    }
  };

  return { showToast };
};
