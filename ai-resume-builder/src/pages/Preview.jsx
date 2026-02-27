import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Preview() {
    // 1. STATE INITIALIZATION (Local Storage)
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem("resumeBuilderData");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Backwards compatibility for skills (string -> object)
                if (typeof parsed.skills === 'string') {
                    const oldSkills = parsed.skills.split(',').map(s => s.trim()).filter(Boolean);
                    parsed.skills = { technical: oldSkills, soft: [], tools: [] };
                }

                // Backwards compatibility for projects structure
                parsed.projects = parsed.projects.map(p => ({
                    ...p,
                    techStack: p.techStack || [],
                    liveUrl: p.liveUrl || "",
                    githubUrl: p.githubUrl || ""
                }));

                return parsed;
            } catch (e) {
                console.error("Failed to parse resume data from local storage", e);
            }
        }
        return {
            personal: { fullName: "", email: "", phone: "", location: "" },
            summary: "",
            education: [{ id: 1, text: "" }],
            experience: [{ id: 1, role: "", details: "" }],
            projects: [{ id: 1, name: "", details: "", techStack: [], liveUrl: "", githubUrl: "" }],
            skills: { technical: [], soft: [], tools: [] },
            links: { github: "", linkedin: "" }
        };
    });

    const [selectedTemplate, setSelectedTemplate] = useState(() => {
        return localStorage.getItem("resumeTemplate") || "classic";
    });

    const [copyStatus, setCopyStatus] = useState("Copy Resume as Text");

    useEffect(() => {
        localStorage.setItem("resumeTemplate", selectedTemplate);
    }, [selectedTemplate]);

    // Validation Check for Warnings
    const isMissingName = !resumeData.personal.fullName.trim();
    const hasValidExp = resumeData.experience.some(e => e.role.trim() || e.details.trim());
    const hasValidProj = resumeData.projects.some(p => p.name.trim() || p.details.trim());
    const isMissingExpAndProj = !hasValidExp && !hasValidProj;
    const showWarning = isMissingName || isMissingExpAndProj;

    // Export Handlers
    const handlePrint = () => {
        window.print();
    };

    const handleCopyText = () => {
        const { personal, summary, education, experience, projects, skills, links } = resumeData;
        let textResult = [];

        // Name & Contact
        if (personal.fullName) textResult.push(personal.fullName.toUpperCase());

        const contactLine = [
            personal.email,
            personal.phone,
            personal.location,
            links.github,
            links.linkedin
        ].filter(Boolean).join(" | ");

        if (contactLine) textResult.push(contactLine);
        textResult.push(""); // Spacing

        // Summary
        if (summary.trim()) {
            textResult.push("SUMMARY");
            textResult.push(summary.trim());
            textResult.push("");
        }

        // Education
        const validEdu = education.filter(e => e.text.trim());
        if (validEdu.length > 0) {
            textResult.push("EDUCATION");
            validEdu.forEach(edu => textResult.push(`• ${edu.text.trim()}`));
            textResult.push("");
        }

        // Experience
        const validExp = experience.filter(e => e.role.trim() || e.details.trim());
        if (validExp.length > 0) {
            textResult.push("EXPERIENCE");
            validExp.forEach(exp => {
                if (exp.role.trim()) textResult.push(exp.role.trim());
                if (exp.details.trim()) textResult.push(exp.details.trim());
                textResult.push(""); // Spacing between jobs
            });
        }

        // Projects
        const validProj = projects.filter(p => p.name.trim() || p.details.trim());
        if (validProj.length > 0) {
            textResult.push("PROJECTS");
            validProj.forEach(proj => {
                let projTitleLine = proj.name.trim();
                if (proj.liveUrl) projTitleLine += ` (Live: ${proj.liveUrl})`;
                if (proj.githubUrl) projTitleLine += ` (GitHub: ${proj.githubUrl})`;

                if (projTitleLine) textResult.push(projTitleLine);
                if (proj.details.trim()) textResult.push(proj.details.trim());
                if (proj.techStack && proj.techStack.length > 0) {
                    textResult.push(`Tech Stack: ${proj.techStack.join(", ")}`);
                }
                textResult.push(""); // Spacing between projects
            });
        }

        // Skills
        const hasSkills = skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0;
        if (hasSkills) {
            textResult.push("SKILLS");
            if (skills.technical.length > 0) textResult.push(`Technical: ${skills.technical.join(", ")}`);
            if (skills.soft.length > 0) textResult.push(`Soft Skills: ${skills.soft.join(", ")}`);
            if (skills.tools.length > 0) textResult.push(`Tools & Technologies: ${skills.tools.join(", ")}`);
            textResult.push("");
        }

        const compiledText = textResult.join("\n").trim();

        navigator.clipboard.writeText(compiledText).then(() => {
            setCopyStatus("Copied!");
            setTimeout(() => setCopyStatus("Copy Resume as Text"), 2000);
        });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '40px' }} className="preview-container">

            {/* Validation Warning Navbar */}
            {showWarning && (
                <div className="print-hidden" style={{ maxWidth: '800px', margin: '0 auto 16px auto', backgroundColor: 'rgba(197, 139, 43, 0.1)', border: '1px solid #c58b2b', color: '#8b5a00', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <span><strong>Your resume may look incomplete.</strong> Ensure you have provided your name and at least one experience or project entry.</span>
                </div>
            )}

            {/* Print-hidden control bar */}
            <div className="print-hidden" style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link to="/builder" className="btn btn--secondary" style={{ backgroundColor: '#fff' }}>← Back to Builder</Link>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Template Selection Tabs */}
                    <div className="template-tabs" style={{ margin: 0 }}>
                        <button className={`template-tab ${selectedTemplate === 'classic' ? 'active' : ''}`} onClick={() => setSelectedTemplate('classic')}>Classic</button>
                        <button className={`template-tab ${selectedTemplate === 'modern' ? 'active' : ''}`} onClick={() => setSelectedTemplate('modern')}>Modern</button>
                        <button className={`template-tab ${selectedTemplate === 'minimal' ? 'active' : ''}`} onClick={() => setSelectedTemplate('minimal')}>Minimal</button>
                    </div>

                    <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(17,17,17,0.1)' }}></div>

                    {/* Export Controls */}
                    <button className="btn btn--secondary" style={{ backgroundColor: '#fff' }} onClick={handleCopyText}>
                        📄 {copyStatus}
                    </button>
                    <button className="btn btn--primary" onClick={handlePrint}>
                        🖨️ Print / Save as PDF
                    </button>
                </div>
            </div>

            {/* Printable Document Area */}
            <div className={`resume-document template-${selectedTemplate}`}>
                {/* Personal Header */}
                {(resumeData.personal.fullName || resumeData.personal.email || resumeData.personal.phone || resumeData.personal.location || resumeData.links.github || resumeData.links.linkedin) && (
                    <header className="resume-header">
                        {resumeData.personal.fullName && <h1 className="resume-name">{resumeData.personal.fullName}</h1>}
                        {(resumeData.personal.email || resumeData.personal.location || resumeData.links.github || resumeData.links.linkedin || resumeData.personal.phone) && (
                            <div className="resume-contact">
                                {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                                {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                                {resumeData.personal.location && <span>{resumeData.personal.location}</span>}
                                {resumeData.links.github && <span>{resumeData.links.github}</span>}
                                {resumeData.links.linkedin && <span>{resumeData.links.linkedin}</span>}
                            </div>
                        )}
                    </header>
                )}

                {/* Summary */}
                {resumeData.summary.trim() && (
                    <section className="resume-section">
                        <h2 className="resume-section-title">Professional Summary</h2>
                        <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{resumeData.summary}</p>
                    </section>
                )}

                {/* Education */}
                {resumeData.education.some(e => e.text.trim()) && (
                    <section className="resume-section">
                        <h2 className="resume-section-title">Education</h2>
                        {resumeData.education.filter(e => e.text.trim()).map((edu, idx) => (
                            <div className="resume-item" key={edu.id} style={{ marginBottom: idx === resumeData.education.length - 1 ? 0 : '15px' }}>
                                <div className="resume-item-title">{edu.text}</div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Experience */}
                {hasValidExp && (
                    <section className="resume-section">
                        <h2 className="resume-section-title">Experience</h2>
                        {resumeData.experience.filter(e => e.role.trim() || e.details.trim()).map((exp, idx) => (
                            <div className="resume-item" key={exp.id} style={{ marginBottom: idx === resumeData.experience.length - 1 ? 0 : '20px' }}>
                                {exp.role.trim() && (
                                    <div className="resume-item-header">
                                        <div className="resume-item-title">{exp.role}</div>
                                    </div>
                                )}
                                {exp.details.trim() && (
                                    <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', marginTop: '6px' }}>
                                        {exp.details}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Projects */}
                {hasValidProj && (
                    <section className="resume-section">
                        <h2 className="resume-section-title">Projects</h2>
                        {resumeData.projects.filter(p => p.name.trim() || p.details.trim()).map((proj, idx) => (
                            <div className="resume-item" key={proj.id} style={{ marginBottom: idx === resumeData.projects.length - 1 ? 0 : '20px' }}>
                                {proj.name.trim() && (
                                    <div className="resume-item-header">
                                        <div className="resume-item-title">
                                            {proj.name}
                                            {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="icon-link">🐙 Repo</a>}
                                            {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="icon-link">🔗 Live</a>}
                                        </div>
                                    </div>
                                )}
                                {proj.details.trim() && (
                                    <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', marginTop: '6px', marginBottom: proj.techStack.length ? '8px' : '0' }}>
                                        {proj.details}
                                    </div>
                                )}
                                {proj.techStack && proj.techStack.length > 0 && (
                                    <div>
                                        {proj.techStack.map(tech => (
                                            <span key={tech} className="tech-pill">{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills */}
                {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 || resumeData.skills.tools.length > 0) && (
                    <section className="resume-section">
                        <h2 className="resume-section-title">Skills</h2>

                        {resumeData.skills.technical.length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Technical</strong>
                                <div>
                                    {resumeData.skills.technical.map(skill => (
                                        <span key={skill} className="skill-pill">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {resumeData.skills.soft.length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Soft Skills</strong>
                                <div>
                                    {resumeData.skills.soft.map(skill => (
                                        <span key={skill} className="skill-pill">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {resumeData.skills.tools.length > 0 && (
                            <div>
                                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Tools & Technologies</strong>
                                <div>
                                    {resumeData.skills.tools.map(skill => (
                                        <span key={skill} className="skill-pill">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

            </div>
        </div>
    );
}

export default Preview;
