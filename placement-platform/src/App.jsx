import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import AppShell from "./components/AppShell.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Practice from "./pages/Practice.jsx";
import Assessments from "./pages/Assessments.jsx";
import Resources from "./pages/Resources.jsx";
import Profile from "./pages/Profile.jsx";
import Results from "./pages/Results.jsx";
import TestChecklist from "./pages/TestChecklist.jsx";
import ShipGate from "./pages/ShipGate.jsx";

// Rb Track
import RbLayout from "./components/RbLayout.jsx";
import RbStep from "./pages/rb/RbStep.jsx";
import RbProof from "./pages/rb/RbProof.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Release / Ship routes */}
        <Route path="/prp/07-test" element={<TestChecklist />} />
        <Route path="/prp/08-ship" element={<ShipGate />} />

        {/* Main Application */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
          <Route path="results" element={<Results />} />
        </Route>

        {/* AI Resume Builder Build Track */}
        <Route path="/rb" element={<RbLayout />}>
          <Route path="01-problem" element={<RbStep />} />
          <Route path="02-market" element={<RbStep />} />
          <Route path="03-architecture" element={<RbStep />} />
          <Route path="04-hld" element={<RbStep />} />
          <Route path="05-lld" element={<RbStep />} />
          <Route path="06-build" element={<RbStep />} />
          <Route path="07-test" element={<RbStep />} />
          <Route path="08-ship" element={<RbStep />} />
          <Route path="proof" element={<RbProof />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

