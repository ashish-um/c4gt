import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- Components ---
export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen font-sans">
        <Sidebar />
        <Routes>
          <Route path="/" element={<MainContent />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
