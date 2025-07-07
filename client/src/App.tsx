import Sidebar from "./components/Sidebar";
import AnalyticsPage from "./pages/AnalyticsPage";
import CoursePage from "./pages/CoursePage";
import DocsPage from "./pages/DocsPage";
import HelpPage from "./pages/HelpPage";
import AboutPage from "./pages/AboutPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CertificationPage from "./pages/CertificationPage";

// --- Components ---
export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen font-sans">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<CoursePage />} />
            <Route path="/certifications" element={<CertificationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
