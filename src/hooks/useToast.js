import { useContext } from "react";
import { ToastContext } from "../context/ToastContext"; // Import from the .js file

export const useToast = () => {
  return useContext(ToastContext);
};
