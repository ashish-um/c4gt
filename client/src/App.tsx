import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

// --- Components ---
export default function App() {
  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <MainContent />
    </div>
  );
}
