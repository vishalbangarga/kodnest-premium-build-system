import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Preview() {
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

    const [selectedTemplate, setSelectedTemplate] = useState(() => {
        return localStorage.getItem("resumeTemplate") || "classic";
    });

    useEffect(() => {
        localStorage.setItem("resumeTemplate", selectedTemplate);
    }, [selectedTemplate]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '40px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/builder" className="btn btn--secondary" style={{ backgroundColor: '#fff' }}>← Back to Builder</Link>

                {/* Template Selection Tabs */}
                <div className="template-tabs" style={{ margin: 0 }}>
                    <button className={`template-tab ${selectedTemplate === 'classic' ? 'active' : ''}`} onClick={() => setSelectedTemplate('classic')}>Classic</button>
                    <button className={`template-tab ${selectedTemplate === 'modern' ? 'active' : ''}`} onClick={() => setSelectedTemplate('modern')}>Modern</button>
                    <button className={`template-tab ${selectedTemplate === 'minimal' ? 'active' : ''}`} onClick={() => setSelectedTemplate('minimal')}>Minimal</button>
                </div>
            </div>

            <div className={`resume-document template-${selectedTemplate}`}>
                {/* Personal Header */}
                {resumeData.personal.fullName && (
                    <header className="resume-header">
                        <h1 className="resume-name">{resumeData.personal.fullName}</h1>
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
                {resumeData.experience.some(e => e.role.trim() || e.details.trim()) && (
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
                {resumeData.projects.some(p => p.name.trim() || p.details.trim()) && (
                    <section className="resume-section">
                        <h2 className="resume-section-title">Projects</h2>
                        {resumeData.projects.filter(p => p.name.trim() || p.details.trim()).map((proj, idx) => (
                            <div className="resume-item" key={proj.id} style={{ marginBottom: idx === resumeData.projects.length - 1 ? 0 : '20px' }}>
                                {proj.name.trim() && (
                                    <div className="resume-item-header">
                                        <div className="resume-item-title">{proj.name}</div>
                                    </div>
                                )}
                                {proj.details.trim() && (
                                    <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', marginTop: '6px' }}>
                                        {proj.details}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills */}
                {resumeData.skills.trim() && (
                    <section className="resume-section">
                        <h2 className="resume-section-title">Skills</h2>
                        <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{resumeData.skills}</p>
                    </section>
                )}

            </div>
        </div>
    );
}

export default Preview;
