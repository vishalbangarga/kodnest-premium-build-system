import { useState, useEffect } from "react";

function Builder() {
    // 1. STATE INITIALIZATION (Local Storage)
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem("resumeBuilderData");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse resume data from local storage", e);
            }
        }
        return {
            personal: { fullName: "", email: "", phone: "", location: "" },
            summary: "",
            education: [{ id: 1, text: "" }],
            experience: [{ id: 1, role: "", details: "" }],
            projects: [{ id: 1, name: "", details: "" }],
            skills: "",
            links: { github: "", linkedin: "" }
        };
    });

    const [atsScore, setAtsScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);

    // 2. AUTO-SAVE & ATS CALCULATION
    useEffect(() => {
        // Save to local storage
        localStorage.setItem("resumeBuilderData", JSON.stringify(resumeData));

        // Calculate ATS Score
        let score = 0;
        let newSuggestions = [];

        // Summary: +15 if 40-120 words
        const summaryWords = resumeData.summary.trim() ? resumeData.summary.trim().split(/\s+/).length : 0;
        if (summaryWords >= 40 && summaryWords <= 120) {
            score += 15;
        } else {
            newSuggestions.push("Write a stronger summary (40–120 words).");
        }

        // Projects: +10 if >= 2 projects (with some text)
        const validProjects = resumeData.projects.filter(p => p.name.trim() || p.details.trim());
        if (validProjects.length >= 2) {
            score += 10;
        } else {
            newSuggestions.push("Add at least 2 projects.");
        }

        // Experience: +10 if >= 1 entry
        const validExp = resumeData.experience.filter(e => e.role.trim() || e.details.trim());
        if (validExp.length >= 1) {
            score += 10;
        } else {
            newSuggestions.push("Add at least 1 experience entry.");
        }

        // Skills: +10 if >= 8 items
        const skillsList = resumeData.skills.split(',').map(s => s.trim()).filter(s => s);
        if (skillsList.length >= 8) {
            score += 10;
        } else {
            newSuggestions.push("Add more skills (target 8+).");
        }

        // Links: +10 if github or linkedin exists
        if (resumeData.links.github.trim() || resumeData.links.linkedin.trim()) {
            score += 10;
        } else {
            newSuggestions.push("Add your GitHub or LinkedIn profile link.");
        }

        // Numbers in experience/projects: +15
        const expProjText = [...resumeData.experience.map(e => e.details), ...resumeData.projects.map(p => p.details)].join(" ");
        if (/\d|%|k\b|m\b/i.test(expProjText)) {
            score += 15;
        } else {
            newSuggestions.push("Add measurable impact (numbers, %, etc.) in bullets.");
        }

        // Education: +10 if complete
        const validEdu = resumeData.education.filter(e => e.text.trim());
        if (validEdu.length >= 1) {
            score += 10;
        } else {
            newSuggestions.push("Add education details.");
        }

        setAtsScore(Math.min(100, score));
        setSuggestions(newSuggestions.slice(0, 3)); // Max 3 suggestions
    }, [resumeData]);

    // Handlers
    const handlePersonalChange = (field, value) => {
        setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    };

    const handleLinksChange = (field, value) => {
        setResumeData(prev => ({ ...prev, links: { ...prev.links, [field]: value } }));
    };

    const handlePlainChange = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setResumeData(prev => {
            const newArray = [...prev[section]];
            if (field === null) {
                newArray[index] = { ...newArray[index], text: value };
            } else {
                newArray[index] = { ...newArray[index], [field]: value };
            }
            return { ...prev, [section]: newArray };
        });
    };

    const addArrayItem = (section, defaultObj) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], { id: Date.now(), ...defaultObj }]
        }));
    };

    return (
        <main className="main-layout">
            <section className="context-header">
                <div>
                    <h1 className="context-header__title">
                        Resume Builder
                    </h1>
                    <p className="context-header__subtitle">
                        Input your details into the structured fields below. The live preview will adapt automatically.
                    </p>
                </div>
            </section>

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
                                    <input className="text-input" type="text" placeholder="e.g. Holden Caulfield" value={resumeData.personal.fullName} onChange={(e) => handlePersonalChange('fullName', e.target.value)} />
                                </div>
                                <div className="field-group__item">
                                    <label className="field-label">Email</label>
                                    <input className="text-input" type="email" placeholder="e.g. holden@example.com" value={resumeData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                                </div>
                            </div>
                            <div className="field-group field-group--inline">
                                <div className="field-group__item">
                                    <label className="field-label">Phone</label>
                                    <input className="text-input" type="text" placeholder="e.g. +1 234 567 890" value={resumeData.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
                                </div>
                                <div className="field-group__item">
                                    <label className="field-label">Location</label>
                                    <input className="text-input" type="text" placeholder="e.g. New York, NY" value={resumeData.personal.location} onChange={(e) => handlePersonalChange('location', e.target.value)} />
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
                                <textarea className="text-area" placeholder="Direct, high-impact summary of your professional narrative." value={resumeData.summary} onChange={(e) => handlePlainChange('summary', e.target.value)}></textarea>
                            </div>
                        </div>
                    </article>

                    {/* Education */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Education</h2>
                            <button className="btn btn--secondary" style={{ padding: '4px 12px', fontSize: '13px' }} onClick={() => addArrayItem('education', { text: "" })}>+ Add</button>
                        </header>
                        <div className="card__body">
                            {resumeData.education.map((edu, idx) => (
                                <div className="field-group" key={edu.id}>
                                    <label className="field-label">{idx === 0 ? "Institution / Degree" : `Education ${idx + 1}`}</label>
                                    <input className="text-input" type="text" placeholder="e.g. B.S. in Computer Science - University of State" value={edu.text} onChange={(e) => handleArrayChange('education', idx, null, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </article>

                    {/* Experience */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Experience</h2>
                            <button className="btn btn--secondary" style={{ padding: '4px 12px', fontSize: '13px' }} onClick={() => addArrayItem('experience', { role: "", details: "" })}>+ Add</button>
                        </header>
                        <div className="card__body">
                            {resumeData.experience.map((exp, idx) => (
                                <div key={exp.id} style={{ marginBottom: idx < resumeData.experience.length - 1 ? '16px' : '0', paddingBottom: idx < resumeData.experience.length - 1 ? '16px' : '0', borderBottom: idx < resumeData.experience.length - 1 ? '1px dashed rgba(17,17,17,0.1)' : 'none' }}>
                                    <div className="field-group" style={{ marginBottom: '8px' }}>
                                        <label className="field-label">Role & Company</label>
                                        <input className="text-input" type="text" placeholder="e.g. Senior Software Engineer at Tech Corp" value={exp.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} />
                                    </div>
                                    <div className="field-group">
                                        <textarea className="text-area" placeholder="Built scalable systems. Improved performance by 30%..." value={exp.details} onChange={(e) => handleArrayChange('experience', idx, 'details', e.target.value)}></textarea>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>

                    {/* Projects */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Projects</h2>
                            <button className="btn btn--secondary" style={{ padding: '4px 12px', fontSize: '13px' }} onClick={() => addArrayItem('projects', { name: "", details: "" })}>+ Add</button>
                        </header>
                        <div className="card__body">
                            {resumeData.projects.map((proj, idx) => (
                                <div key={proj.id} style={{ marginBottom: idx < resumeData.projects.length - 1 ? '16px' : '0', paddingBottom: idx < resumeData.projects.length - 1 ? '16px' : '0', borderBottom: idx < resumeData.projects.length - 1 ? '1px dashed rgba(17,17,17,0.1)' : 'none' }}>
                                    <div className="field-group" style={{ marginBottom: '8px' }}>
                                        <label className="field-label">Project Name</label>
                                        <input className="text-input" type="text" placeholder="e.g. Premium Build System" value={proj.name} onChange={(e) => handleArrayChange('projects', idx, 'name', e.target.value)} />
                                    </div>
                                    <div className="field-group">
                                        <textarea className="text-area" placeholder="Architected a scalable resume platform using Vite and React." value={proj.details} onChange={(e) => handleArrayChange('projects', idx, 'details', e.target.value)}></textarea>
                                    </div>
                                </div>
                            ))}
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
                                <textarea className="text-area" style={{ minHeight: '60px' }} placeholder="React, Node.js, Systems Design..." value={resumeData.skills} onChange={(e) => handlePlainChange('skills', e.target.value)}></textarea>
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
                                    <input className="text-input" type="text" placeholder="github.com/username" value={resumeData.links.github} onChange={(e) => handleLinksChange('github', e.target.value)} />
                                </div>
                                <div className="field-group__item">
                                    <label className="field-label">LinkedIn</label>
                                    <input className="text-input" type="text" placeholder="linkedin.com/in/username" value={resumeData.links.linkedin} onChange={(e) => handleLinksChange('linkedin', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </article>

                </section>

                {/* Secondary Panel (Preview + Profile Score - Right) */}
                <aside className="secondary-panel">

                    {/* ATS Score Meter Component */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '24px',
                        border: '1px solid rgba(17,17,17,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                        marginBottom: '8px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>ATS Readiness Score</h3>
                            <span style={{
                                fontSize: '24px',
                                fontWeight: 600,
                                color: atsScore >= 80 ? '#4f6f52' : (atsScore >= 50 ? '#c58b2b' : '#8b0000'),
                                fontFamily: 'Georgia, serif'
                            }}>{atsScore}<span style={{ fontSize: '14px', color: '#666' }}>/100</span></span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                            <div style={{
                                height: '100%',
                                width: `${atsScore}%`,
                                backgroundColor: atsScore >= 80 ? '#4f6f52' : (atsScore >= 50 ? '#c58b2b' : '#8b0000'),
                                transition: 'width 0.3s ease, background-color 0.3s ease'
                            }}></div>
                        </div>

                        {/* Suggestions List */}
                        {suggestions.length > 0 ? (
                            <div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggestions to improve</h4>
                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#333' }}>
                                    {suggestions.map((s, i) => (
                                        <li key={i} style={{ marginBottom: '4px' }}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div style={{ fontSize: '14px', color: '#4f6f52', fontWeight: 500 }}>
                                ✓ Your resume looks great!
                            </div>
                        )}
                    </div>

                    <div className="preview-shell">
                        <div style={{ color: '#000', fontSize: '14px', lineHeight: 1.6, wordBreak: 'break-word' }}>
                            {/* Personal Header */}
                            {resumeData.personal.fullName && (
                                <h1 style={{ fontSize: '24px', margin: '0 0 10px 0', fontFamily: 'Georgia, serif', borderBottom: '1px solid currentColor', paddingBottom: '8px', textTransform: 'uppercase' }}>
                                    {resumeData.personal.fullName}
                                </h1>
                            )}

                            {(resumeData.personal.email || resumeData.personal.location || resumeData.links.github || resumeData.links.linkedin || resumeData.personal.phone) && (
                                <p style={{ margin: '0 0 20px 0', fontSize: '12px' }}>
                                    {[
                                        resumeData.personal.email,
                                        resumeData.personal.phone,
                                        resumeData.personal.location,
                                        resumeData.links.github,
                                        resumeData.links.linkedin
                                    ].filter(Boolean).join(" | ")}
                                </p>
                            )}

                            {/* Summary */}
                            {resumeData.summary.trim() && (
                                <>
                                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px', marginBottom: '8px' }}>SUMMARY</h2>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{resumeData.summary}</p>
                                </>
                            )}

                            {/* Education */}
                            {resumeData.education.some(e => e.text.trim()) && (
                                <>
                                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '24px', marginBottom: '8px' }}>EDUCATION</h2>
                                    {resumeData.education.filter(e => e.text.trim()).map(edu => (
                                        <div key={edu.id} style={{ marginBottom: '8px' }}>
                                            {edu.text}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Experience */}
                            {resumeData.experience.some(e => e.role.trim() || e.details.trim()) && (
                                <>
                                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '24px', marginBottom: '8px' }}>EXPERIENCE</h2>
                                    {resumeData.experience.filter(e => e.role.trim() || e.details.trim()).map(exp => (
                                        <div key={exp.id} style={{ marginBottom: '12px' }}>
                                            {exp.role.trim() && <strong style={{ display: 'block' }}>{exp.role}</strong>}
                                            {exp.details.trim() && <div style={{ whiteSpace: 'pre-wrap' }}>{exp.details}</div>}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Projects */}
                            {resumeData.projects.some(p => p.name.trim() || p.details.trim()) && (
                                <>
                                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '24px', marginBottom: '8px' }}>PROJECTS</h2>
                                    {resumeData.projects.filter(p => p.name.trim() || p.details.trim()).map(proj => (
                                        <div key={proj.id} style={{ marginBottom: '12px' }}>
                                            {proj.name.trim() && <strong style={{ display: 'block' }}>{proj.name}</strong>}
                                            {proj.details.trim() && <div style={{ whiteSpace: 'pre-wrap' }}>{proj.details}</div>}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Skills */}
                            {resumeData.skills.trim() && (
                                <>
                                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '24px', marginBottom: '8px' }}>SKILLS</h2>
                                    <p>{resumeData.skills}</p>
                                </>
                            )}
                        </div>
                    </div>
                </aside>

            </section>
        </main>
    );
}

export default Builder;
