function Proof() {
    return (
        <main className="main-layout" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <section className="context-header">
                <h1 className="context-header__title">
                    Final Proof Submission
                </h1>
                <p className="context-header__subtitle">
                    Verify your completed steps and bundle your project links.
                </p>
            </section>

            <section className="workspace-layout">
                <article className="card" style={{ width: '100%' }}>
                    <header className="card__header">
                        <h2 className="card__title">Project Links</h2>
                        <p className="card__description">
                            Link to your final repositories and deployed versions.
                        </p>
                    </header>
                    <div className="card__body">
                        <div className="field-group">
                            <label className="field-label" htmlFor="lovable-link">
                                Lovable Project Link
                            </label>
                            <input
                                id="lovable-link"
                                className="text-input"
                                type="text"
                                placeholder="https://lovable.dev/projects/..."
                            />
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="github-link">
                                GitHub Repository Link
                            </label>
                            <input
                                id="github-link"
                                className="text-input"
                                type="text"
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="deploy-link">
                                Deployed App Link
                            </label>
                            <input
                                id="deploy-link"
                                className="text-input"
                                type="text"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="card__actions" style={{ marginTop: '16px' }}>
                            <button
                                className="btn btn--primary"
                                type="button"
                            >
                                Copy Final Submission
                            </button>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    );
}

export default Proof;
