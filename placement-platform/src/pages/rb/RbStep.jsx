import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { RB_STEPS } from "../../components/RbLayout.jsx";

function RbStep() {
    const { currentStepIndex } = useOutletContext();
    const step = RB_STEPS[currentStepIndex];
    const navigate = useNavigate();

    const storageKey = `rb_step_${currentStepIndex + 1}_artifact`;
    const [artifactUrl, setArtifactUrl] = useState("");
    const [copyFeedback, setCopyFeedback] = useState("");

    const isLastStep = currentStepIndex === RB_STEPS.length - 1;

    useEffect(() => {
        // Load existing artifact if any
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
            setArtifactUrl(saved);
        } else {
            setArtifactUrl("");
        }
        setCopyFeedback("");
    }, [currentStepIndex, storageKey]);

    const handleSave = () => {
        if (artifactUrl.trim() === "") return;
        window.localStorage.setItem(storageKey, artifactUrl.trim());

        // Auto-navigate to next step, or proof page if done
        if (isLastStep) {
            navigate("/rb/proof");
        } else {
            const nextStepId = RB_STEPS[currentStepIndex + 1].id;
            navigate(`/rb/${nextStepId}`);
        }
    };

    const handleCopy = () => {
        const promptText = `Generate Lovable component for AI Resume Builder step ${currentStepIndex + 1}: ${step.title}`;
        navigator.clipboard.writeText(promptText).then(() => {
            setCopyFeedback("Copied!");
            setTimeout(() => setCopyFeedback(""), 2000);
        }).catch(() => {
            setCopyFeedback("Failed to copy");
        });
    };

    return (
        <main className="rb-main-layout">
            {/* Context Header */}
            <section className="rb-context-header">
                <h1 className="rb-context-header__title">
                    {step.title}
                </h1>
                <p className="rb-context-header__subtitle">
                    Complete this step by generating and verifying your artifact in Lovable.
                </p>
            </section>

            {/* Primary + Secondary Columns */}
            <section className="rb-workspace-layout">
                {/* Primary Workspace (70%) */}
                <section className="rb-primary-workspace">
                    <article className="rb-card">
                        <header className="rb-card__header">
                            <h2 className="rb-card__title">Artifact Submission</h2>
                            <p className="rb-card__description">
                                Paste the URL or ID of the artifact you generated for this step to unlock the next section.
                            </p>
                        </header>
                        <div className="rb-card__body">
                            <div className="rb-field-group">
                                <label className="rb-field-label" htmlFor="artifact-url">
                                    Artifact URL / ID
                                </label>
                                <input
                                    id="artifact-url"
                                    className="rb-text-input"
                                    type="text"
                                    placeholder="https://lovable.dev/projects/... or simply a confirmation note"
                                    value={artifactUrl}
                                    onChange={(e) => setArtifactUrl(e.target.value)}
                                />
                            </div>

                            <div className="rb-card__actions">
                                <button
                                    className="rb-btn rb-btn--primary"
                                    type="button"
                                    onClick={handleSave}
                                    disabled={artifactUrl.trim() === ""}
                                >
                                    {isLastStep ? "Finish and go to Proof" : "Save and Continue"}
                                </button>
                            </div>
                        </div>
                    </article>
                </section>

                {/* Secondary Panel (30%) */}
                <aside className="rb-secondary-panel">
                    <section className="rb-secondary-panel__section">
                        <h2 className="rb-secondary-panel__title">This step</h2>
                        <p className="rb-secondary-panel__body">
                            Build out the {step.title} functionality. We use this layout to keep every build step clear and measurable.
                        </p>
                    </section>

                    <section className="rb-secondary-panel__section">
                        <h3 className="rb-secondary-panel__subtitle">Prompt for this step</h3>
                        <div className="rb-prompt-box">
                            <p>
                                Generate Lovable component for AI Resume Builder step {currentStepIndex + 1}: {step.title}
                            </p>
                        </div>
                        <div className="rb-secondary-panel__actions">
                            <button className="rb-btn rb-btn--secondary" type="button" onClick={handleCopy}>
                                {copyFeedback || "Copy"}
                            </button>
                            <button className="rb-btn rb-btn--secondary" type="button">
                                Build in Lovable
                            </button>
                        </div>
                    </section>

                    <section className="rb-secondary-panel__section">
                        <h3 className="rb-secondary-panel__subtitle">Outcome</h3>
                        <div className="rb-secondary-panel__actions rb-secondary-panel__actions--stacked">
                            <button className="rb-btn rb-btn--secondary" type="button">
                                It Worked
                            </button>
                            <button className="rb-btn rb-btn--secondary" type="button">
                                Error
                            </button>
                            <button className="rb-btn rb-btn--secondary" type="button">
                                Add Screenshot
                            </button>
                        </div>
                    </section>
                </aside>
            </section>
        </main>
    );
}

export default RbStep;
