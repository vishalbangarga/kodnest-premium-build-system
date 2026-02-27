import React from 'react';

const THEME_COLORS = [
    { id: 'teal', value: 'hsl(168, 60%, 40%)' },
    { id: 'navy', value: 'hsl(220, 60%, 35%)' },
    { id: 'burgundy', value: 'hsl(345, 60%, 35%)' },
    { id: 'forest', value: 'hsl(150, 50%, 30%)' },
    { id: 'charcoal', value: 'hsl(0, 0%, 25%)' }
];

function ResumePreview({ resumeData, selectedTemplate, selectedColor }) {
    const currentColorValue = THEME_COLORS.find(c => c.id === selectedColor)?.value || 'hsl(168, 60%, 40%)';

    const renderHeader = () => (
        (resumeData.personal.fullName || resumeData.personal.email || resumeData.personal.phone || resumeData.personal.location || resumeData.links.github || resumeData.links.linkedin) && (
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
        )
    );

    const renderSummary = () => (
        resumeData.summary.trim() && (
            <section className="resume-section">
                <h2 className="resume-section-title">Professional Summary</h2>
                <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{resumeData.summary}</p>
            </section>
        )
    );

    const renderEducation = () => (
        resumeData.education.some(e => e.text.trim()) && (
            <section className="resume-section">
                <h2 className="resume-section-title">Education</h2>
                {resumeData.education.filter(e => e.text.trim()).map((edu, idx, arr) => (
                    <div className="resume-item" key={edu.id} style={{ marginBottom: idx === arr.length - 1 ? 0 : '12px' }}>
                        <div className="resume-item-title">{edu.text}</div>
                    </div>
                ))}
            </section>
        )
    );

    const renderExperience = () => (
        resumeData.experience.some(e => e.role.trim() || e.details.trim()) && (
            <section className="resume-section">
                <h2 className="resume-section-title">Experience</h2>
                {resumeData.experience.filter(e => e.role.trim() || e.details.trim()).map((exp, idx, arr) => (
                    <div className="resume-item" key={exp.id} style={{ marginBottom: idx === arr.length - 1 ? 0 : '16px' }}>
                        {exp.role.trim() && (
                            <div className="resume-item-header">
                                <div className="resume-item-title">{exp.role}</div>
                            </div>
                        )}
                        {exp.details.trim() && (
                            <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                                {exp.details}
                            </div>
                        )}
                    </div>
                ))}
            </section>
        )
    );

    const renderProjects = () => (
        resumeData.projects.some(p => p.name.trim() || p.details.trim()) && (
            <section className="resume-section">
                <h2 className="resume-section-title">Projects</h2>
                {resumeData.projects.filter(p => p.name.trim() || p.details.trim()).map((proj, idx, arr) => (
                    <div className="resume-item" key={proj.id} style={{ marginBottom: idx === arr.length - 1 ? 0 : '16px' }}>
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
                            <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', marginTop: '4px', marginBottom: proj.techStack.length ? '8px' : '0' }}>
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
        )
    );

    const renderSkills = () => (
        (resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 || resumeData.skills.tools.length > 0) && (
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
        )
    );

    if (selectedTemplate === 'modern') {
        return (
            <div className={`resume-document template-modern`} style={{ '--accent-color': currentColorValue, padding: 0, minHeight: '100%', background: 'transparent' }}>
                <aside className="resume-sidebar">
                    {resumeData.personal.fullName && <h1 className="resume-name resume-name-mobile" style={{ display: 'none' }}>{resumeData.personal.fullName}</h1>}

                    {(resumeData.personal.email || resumeData.personal.phone || resumeData.personal.location || resumeData.links.github || resumeData.links.linkedin) && (
                        <div className="resume-contact">
                            {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                            {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                            {resumeData.personal.location && <span>{resumeData.personal.location}</span>}
                            {resumeData.links.github && <span>{resumeData.links.github}</span>}
                            {resumeData.links.linkedin && <span>{resumeData.links.linkedin}</span>}
                        </div>
                    )}

                    {renderSkills()}
                </aside>
                <main className="resume-main-content">
                    {resumeData.personal.fullName && (
                        <header className="resume-header">
                            <h1 className="resume-name">{resumeData.personal.fullName}</h1>
                        </header>
                    )}
                    {renderSummary()}
                    {renderEducation()}
                    {renderExperience()}
                    {renderProjects()}
                </main>
            </div>
        );
    }

    return (
        <div className={`resume-document template-${selectedTemplate}`} style={{ '--accent-color': currentColorValue, padding: 0, minHeight: '100%', background: 'transparent' }}>
            <div style={{ padding: '40px', background: '#fff' }}>
                {renderHeader()}
                {renderSummary()}
                {renderEducation()}
                {renderExperience()}
                {renderProjects()}
                {renderSkills()}
            </div>
        </div>
    );
}

export default ResumePreview;
