import { useState, useEffect } from "react";
import { RB_STEPS } from "../../components/RbLayout.jsx";

function RbProof() {
    const [lovableLink, setLovableLink] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [deployLink, setDeployLink] = useState("");
    const [stepStatuses, setStepStatuses] = useState([]);

    useEffect(() => {
        // Check all 8 steps
        const statuses = RB_STEPS.map((step, idx) => {
            const artifact = window.localStorage.getItem(`rb_step_${idx + 1}_artifact`);
            return {
                id: step.id,
                title: step.title,
                completed: !!(artifact && artifact.trim() !== ""),
                artifact
            };
        });
        setStepStatuses(statuses);

        // Load links if previously saved
        setLovableLink(window.localStorage.getItem('rb_proof_lovable') || "");
        setGithubLink(window.localStorage.getItem('rb_proof_github') || "");
        setDeployLink(window.localStorage.getItem('rb_proof_deploy') || "");
    }, []);

    const handleCopySubmission = () => {
        const report = `
AI Resume Builder Track - Final Submission
---------------------------------------
Lovable Link: ${lovableLink}
GitHub Link: ${githubLink}
Deploy Link: ${deployLink}

Steps Completed:
${stepStatuses.map(s => `[${s.completed ? 'x' : ' '}] ${s.title} -> ${s.artifact || 'MISSING'}`).join('\n')}
    `.trim();

        navigator.clipboard.writeText(report).then(() => {
            alert("Submission copied to clipboard!");
        });
    };

    const syncLinks = (setter, key, val) => {
        setter(val);
        window.localStorage.setItem(key, val);
    };

    return (
        <main className="rb-main-layout">
            {/* Context Header */}
            <section className="rb-context-header">
                <h1 className="rb-context-header__title">
                    Final Proof Submission
                </h1>
                <p className="rb-context-header__subtitle">
                    Verify your completed steps and bundle your project links.
                </p>
            </section>

            {/* Primary + Secondary Columns */}
            <section className="rb-workspace-layout">
                {/* Primary Workspace (70%) */}
                <section className="rb-primary-workspace">
                    <article className="rb-card">
                        <header className="rb-card__header">
                            <h2 className="rb-card__title">Project Links</h2>
                            <p className="rb-card__description">
                                Link to your final repositories and deployed versions.
                            </p>
                        </header>
                        <div className="rb-card__body">
                            <div className="rb-field-group">
                                <label className="rb-field-label" htmlFor="lovable-link">
                                    Lovable Project Link
                                </label>
                                <input
                                    id="lovable-link"
                                    className="rb-text-input"
                                    type="text"
                                    placeholder="https://lovable.dev/projects/..."
                                    value={lovableLink}
                                    onChange={(e) => syncLinks(setLovableLink, 'rb_proof_lovable', e.target.value)}
                                />
                            </div>

                            <div className="rb-field-group">
                                <label className="rb-field-label" htmlFor="github-link">
                                    GitHub Repository Link
                                </label>
                                <input
                                    id="github-link"
                                    className="rb-text-input"
                                    type="text"
                                    placeholder="https://github.com/..."
                                    value={githubLink}
                                    onChange={(e) => syncLinks(setGithubLink, 'rb_proof_github', e.target.value)}
                                />
                            </div>

                            <div className="rb-field-group">
                                <label className="rb-field-label" htmlFor="deploy-link">
                                    Deployed App Link
                                </label>
                                <input
                                    id="deploy-link"
                                    className="rb-text-input"
                                    type="text"
                                    placeholder="https://..."
                                    value={deployLink}
                                    onChange={(e) => syncLinks(setDeployLink, 'rb_proof_deploy', e.target.value)}
                                />
                            </div>

                            <div className="rb-card__actions mt-4">
                                <button
                                    className="rb-btn rb-btn--primary"
                                    type="button"
                                    onClick={handleCopySubmission}
                                >
                                    Copy Final Submission
                                </button>
                            </div>
                        </div>
                    </article>
                </section>

                {/* Secondary Panel (30%) */}
                <aside className="rb-secondary-panel">
                    <section className="rb-secondary-panel__section">
                        <h2 className="rb-secondary-panel__title">Step Status</h2>
                        <div className="mt-4 flex flex-col gap-2">
                            {stepStatuses.map((s, i) => (
                                <div key={s.id} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full ${s.completed ? 'bg-[#4f6f52]' : 'bg-[#111111]/20'}`}></div>
                                    <span className="text-sm font-medium">{i + 1}. {s.title}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </section>
        </main>
    );
}

export default RbProof;
