import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../rb-styles.css"; // Ensure styles are scoped/loaded

export const RB_STEPS = [
  { id: "01-problem", title: "Problem Definition" },
  { id: "02-market", title: "Market Research" },
  { id: "03-architecture", title: "Architecture" },
  { id: "04-hld", title: "High-Level Design" },
  { id: "05-lld", title: "Low-Level Design" },
  { id: "06-build", title: "Build & Implementation" },
  { id: "07-test", title: "Testing & QA" },
  { id: "08-ship", title: "Ship Readiness" }
];

function RbLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const isProofPage = location.pathname === "/rb/proof";

  useEffect(() => {
    // Determine current step index from URL
    const stepId = location.pathname.split("/").pop();
    const index = RB_STEPS.findIndex(s => s.id === stepId);
    
    if (index !== -1) {
      setCurrentStepIndex(index);
    }
    
    // Check gating logic
    if (index > 0 && !isProofPage) {
      // Check if previous step completed
      const prevStep = RB_STEPS[index - 1];
      const prevArtifact = window.localStorage.getItem(`rb_step_${index}_artifact`);
      
      if (!prevArtifact || prevArtifact.trim() === "") {
        // Enforce gating: send back to first incompleted step or simply previous step
        navigate(`/rb/${prevStep.id}`, { replace: true });
      }
    } else if (isProofPage) {
       // On proof page, ensure all 8 steps are done
       for (let i = 1; i <= 8; i++) {
         const artifact = window.localStorage.getItem(`rb_step_${i}_artifact`);
         if (!artifact || artifact.trim() === "") {
           navigate(`/rb/${RB_STEPS[i-1].id}`, { replace: true });
           break;
         }
       }
    }
  }, [location.pathname, navigate, isProofPage]);

  // For proof page, we handle it slightly outside the normal max 8 steps label
  const stepDisplay = isProofPage ? "Proof" : `Step ${currentStepIndex + 1} of 8`;
  const isComplete = isProofPage || window.localStorage.getItem(`rb_step_${currentStepIndex + 1}_artifact`);
  const statusClass = isComplete ? "rb-status-badge--shipped" : "rb-status-badge--in-progress";
  const statusText = isComplete ? "Completed" : "In Progress";

  return (
    <div className="rb-layout">
      {/* Top Bar */}
      <header className="rb-top-bar">
        <div className="rb-top-bar__left">
          <span className="rb-top-bar__project-name">AI Resume Builder</span>
        </div>
        <div className="rb-top-bar__center">
          <span className="rb-top-bar__progress">Project 3 — {stepDisplay}</span>
        </div>
        <div className="rb-top-bar__right">
          <span className={`rb-status-badge ${statusClass}`}>{statusText}</span>
        </div>
      </header>

      {/* Main Content (Injected Step) */}
      <Outlet context={{ currentStepIndex, isProofPage }} />

      {/* Proof Footer (Only visible on Steps, omitted or adjusted for Proof page) */}
      {!isProofPage && (
        <footer className="rb-proof-footer">
          <div className="rb-proof-footer__content">
            <div className="rb-proof-item">
              <label className="rb-proof-item__label">
                <input className="rb-proof-item__checkbox" type="checkbox" readOnly checked={!!window.localStorage.getItem(`rb_step_${currentStepIndex + 1}_artifact`)} />
                <span className="rb-proof-item__title">Artifact Saved</span>
              </label>
              <input
                className="rb-text-input rb-text-input--compact"
                type="text"
                readOnly
                value={window.localStorage.getItem(`rb_step_${currentStepIndex + 1}_artifact`) ? "Stored in localStorage" : "Waiting for submission..."}
              />
            </div>
            
             <div className="rb-proof-item">
              <label className="rb-proof-item__label">
                <input className="rb-proof-item__checkbox" type="checkbox" disabled />
                <span className="rb-proof-item__title">Logic Working</span>
              </label>
            </div>

            <div className="rb-proof-item">
              <label className="rb-proof-item__label">
                <input className="rb-proof-item__checkbox" type="checkbox" disabled />
                <span className="rb-proof-item__title">Test Passed</span>
              </label>
            </div>

            <div className="rb-proof-item">
              <label className="rb-proof-item__label">
                <input className="rb-proof-item__checkbox" type="checkbox" disabled />
                <span className="rb-proof-item__title">Deployed</span>
              </label>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default RbLayout;
