import "./App.css";
import Scanner from "./components/Scanner";
import ReloadPrompt from "./components/ReloadPrompt";

function App() {
  return (
    <div>
      <ReloadPrompt></ReloadPrompt>
      <Scanner></Scanner>;
    </div>
  );
}

export default App;
