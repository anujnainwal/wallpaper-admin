import toast, { type ToastOptions } from "react-hot-toast";

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: "top-right",
};

export const notifySuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const notifyError = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

export const notifyLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, { ...defaultOptions, ...options });
};

export const dismissToast = (toastId?: string) => {
  toast.dismiss(toastId);
};
