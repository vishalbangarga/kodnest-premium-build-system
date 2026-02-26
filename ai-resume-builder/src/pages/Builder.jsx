import { useState } from "react";

function Builder() {
    // Simple skeletal state to represent loaded data vs empty data
    const [dataLoaded, setDataLoaded] = useState(false);

    const handleLoadSample = () => {
        setDataLoaded(true);
    };

    return (
        <main className="main-layout">
            {/* Context Header */}
            <section className="context-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="context-header__title">
                            Resume Builder
                        </h1>
                        <p className="context-header__subtitle">
                            Input your details into the structured fields below. The live preview will adapt automatically.
                        </p>
                    </div>
                    <button className="btn btn--secondary" onClick={handleLoadSample}>
                        {dataLoaded ? "Sample Data Loaded" : "Load Sample Data"}
                    </button>
                </div>
            </section>

            {/* Primary + Secondary Columns */}
            <section className="workspace-layout">

                {/* Primary Workspace (Forms - Left) */}
                <section className="primary-workspace">

                    {/* Personal Info */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Personal Info</h2>
                        </header>
                        <div className="card__body">
                            <div className="field-group field-group--inline">
                                <div className="field-group__item">
                                    <label className="field-label">Full Name</label>
                                    <input className="text-input" type="text" placeholder="e.g. Holden Caulfield" defaultValue={dataLoaded ? "Vishal" : ""} />
                                </div>
                                <div className="field-group__item">
                                    <label className="field-label">Email</label>
                                    <input className="text-input" type="email" placeholder="e.g. holden@example.com" defaultValue={dataLoaded ? "vishal@example.com" : ""} />
                                </div>
                            </div>
                            <div className="field-group field-group--inline">
                                <div className="field-group__item">
                                    <label className="field-label">Phone</label>
                                    <input className="text-input" type="text" placeholder="e.g. +1 234 567 890" defaultValue={dataLoaded ? "+91 9876543210" : ""} />
                                </div>
                                <div className="field-group__item">
                                    <label className="field-label">Location</label>
                                    <input className="text-input" type="text" placeholder="e.g. New York, NY" defaultValue={dataLoaded ? "Bangalore, India" : ""} />
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Summary */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Summary</h2>
                        </header>
                        <div className="card__body">
                            <div className="field-group">
                                <textarea className="text-area" placeholder="Direct, high-impact summary of your professional narrative." defaultValue={dataLoaded ? "Software Engineer specializing in modern frontend architectures and premium user experiences." : ""}></textarea>
                            </div>
                        </div>
                    </article>

                    {/* Education */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Education</h2>
                            <button className="btn btn--secondary" style={{ padding: '4px 12px', fontSize: '13px' }}>+ Add</button>
                        </header>
                        <div className="card__body">
                            <div className="field-group">
                                <label className="field-label">Institution / Degree</label>
                                <input className="text-input" type="text" placeholder="e.g. B.S. in Computer Science - University of State" defaultValue={dataLoaded ? "B.E. Computer Science, KodNest University" : ""} />
                            </div>
                        </div>
                    </article>

                    {/* Experience */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Experience</h2>
                            <button className="btn btn--secondary" style={{ padding: '4px 12px', fontSize: '13px' }}>+ Add</button>
                        </header>
                        <div className="card__body">
                            <div className="field-group">
                                <label className="field-label">Role & Company</label>
                                <input className="text-input" type="text" placeholder="e.g. Senior Software Engineer at Tech Corp" defaultValue={dataLoaded ? "Frontend Engineer at KodNest" : ""} />
                            </div>
                            <div className="field-group">
                                <textarea className="text-area" placeholder="Built scalable systems. Improved performance by 30%..." defaultValue={dataLoaded ? "Developed premium UI systems reducing time to market by 40%." : ""}></textarea>
                            </div>
                        </div>
                    </article>

                    {/* Projects */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Projects</h2>
                            <button className="btn btn--secondary" style={{ padding: '4px 12px', fontSize: '13px' }}>+ Add</button>
                        </header>
                        <div className="card__body">
                            <div className="field-group">
                                <label className="field-label">Project Name</label>
                                <input className="text-input" type="text" placeholder="e.g. Premium Build System" defaultValue={dataLoaded ? "AI Resume Builder" : ""} />
                            </div>
                            <div className="field-group">
                                <textarea className="text-area" placeholder="Architected a scalable resume platform using Vite and React." defaultValue={dataLoaded ? "Implemented skeletal premium layout with vanilla CSS." : ""}></textarea>
                            </div>
                        </div>
                    </article>

                    {/* Skills */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Skills</h2>
                        </header>
                        <div className="card__body">
                            <div className="field-group">
                                <label className="field-label">Comma separated list</label>
                                <textarea className="text-area" style={{ minHeight: '60px' }} placeholder="React, Node.js, Systems Design..." defaultValue={dataLoaded ? "JavaScript, React, Vite, CSS Architecture, UI Design" : ""}></textarea>
                            </div>
                        </div>
                    </article>

                    {/* Links */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Links</h2>
                        </header>
                        <div className="card__body">
                            <div className="field-group field-group--inline">
                                <div className="field-group__item">
                                    <label className="field-label">GitHub</label>
                                    <input className="text-input" type="text" placeholder="github.com/username" defaultValue={dataLoaded ? "github.com/vishal" : ""} />
                                </div>
                                <div className="field-group__item">
                                    <label className="field-label">LinkedIn</label>
                                    <input className="text-input" type="text" placeholder="linkedin.com/in/username" defaultValue={dataLoaded ? "linkedin.com/in/vishal" : ""} />
                                </div>
                            </div>
                        </div>
                    </article>

                </section>

                {/* Secondary Panel (Preview Placeholder - Right) */}
                <aside className="secondary-panel">
                    <div className="preview-shell">
                        {dataLoaded ? (
                            <div style={{ color: '#000', fontSize: '14px', lineHeight: 1.6 }}>
                                <h1 style={{ fontSize: '24px', margin: '0 0 10px 0', fontFamily: 'Georgia, serif', borderBottom: '1px solid currentColor', paddingBottom: '8px' }}>
                                    VISHAL
                                </h1>
                                <p style={{ margin: '0 0 20px 0', fontSize: '12px' }}>vishal@example.com | Bangalore, India | github.com/vishal</p>
                                <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px', marginBottom: '8px' }}>SUMMARY</h2>
                                <p>Software Engineer specializing in modern frontend architectures and premium user experiences.</p>
                                <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '24px', marginBottom: '8px' }}>EXPERIENCE</h2>
                                <div style={{ marginBottom: '12px' }}>
                                    <strong style={{ display: 'block' }}>Frontend Engineer | KodNest</strong>
                                    <em>Developed premium UI systems reducing time to market by 40%.</em>
                                </div>
                                <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '24px', marginBottom: '8px' }}>SKILLS</h2>
                                <p>JavaScript, React, Vite, CSS Architecture, UI Design</p>
                            </div>
                        ) : (
                            <div className="preview-skeleton">
                                <span>Live Preview Generated Here</span>
                            </div>
                        )}
                    </div>
                </aside>

            </section>
        </main>
    );
}

export default Builder;
