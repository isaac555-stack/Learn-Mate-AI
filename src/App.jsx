import "./App.css";
import { ToastProvider } from "./context/ToastContext";
import Scanner from "./components/Scanner";
import ReloadPrompt from "./components/ReloadPrompt";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div>
      <ToastProvider>
        {" "}
        <Analytics />
        <ReloadPrompt></ReloadPrompt>
        <Scanner></Scanner>
      </ToastProvider>
    </div>
  );
}

export default App;
