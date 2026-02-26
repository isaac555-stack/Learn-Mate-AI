import "./App.css";
import Scanner from "./components/Scanner";
import ReloadPrompt from "./components/ReloadPrompt";
import { Analytics } from "@vercel/analytics/next";

function App() {
  return (
    <div>
      <Analytics />
      <ReloadPrompt></ReloadPrompt>
      <Scanner></Scanner>;
    </div>
  );
}

export default App;
