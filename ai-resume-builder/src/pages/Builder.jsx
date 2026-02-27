import { useState, useEffect } from "react";

function Builder() {
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
                    githubUrl: p.githubUrl || "",
                    isExpanded: p.isExpanded !== undefined ? p.isExpanded : true
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
            projects: [{ id: 1, name: "", details: "", techStack: [], liveUrl: "", githubUrl: "", isExpanded: true }],
            skills: { technical: [], soft: [], tools: [] },
            links: { github: "", linkedin: "" }
        };
    });

    const [selectedTemplate, setSelectedTemplate] = useState(() => {
        return localStorage.getItem("resumeTemplate") || "classic";
    });

    const [atsScore, setAtsScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);

    // UI State
    const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

    // Skill Input States
    const [skillInputs, setSkillInputs] = useState({ technical: "", soft: "", tools: "" });
    // Project Tech Input States - keyed by project id
    const [projectTechInputs, setProjectTechInputs] = useState({});

    // 2. AUTO-SAVE & ATS CALCULATION
    useEffect(() => {
        // Save to local storage
        localStorage.setItem("resumeBuilderData", JSON.stringify(resumeData));
        localStorage.setItem("resumeTemplate", selectedTemplate);

        // Calculate ATS Score
        let score = 0;
        let newSuggestions = [];

        // Summary: +15 if 40-120 words
        const summaryWords = resumeData.summary.trim() ? resumeData.summary.trim().split(/\s+/).length : 0;
        if (summaryWords >= 40 && summaryWords <= 120) {
            score += 15;
        } else {
            newSuggestions.push("Expand summary to 40+ words.");
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
            newSuggestions.push("Add experience or internship work.");
        }

        // Skills: +10 if >= 8 items
        const totalSkills = resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.tools.length;
        if (totalSkills >= 8) {
            score += 10;
        } else {
            newSuggestions.push("Expand skills list to 8+ items.");
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
            newSuggestions.push("Add measurable impact (numbers).");
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
    }, [resumeData, selectedTemplate]);

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

    const removeArrayItem = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    // Skills Handlers
    const handleSkillInputKeyDown = (e, category) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = skillInputs[category].trim();
            if (val && !resumeData.skills[category].includes(val)) {
                setResumeData(prev => ({
                    ...prev,
                    skills: {
                        ...prev.skills,
                        [category]: [...prev.skills[category], val]
                    }
                }));
            }
            setSkillInputs(prev => ({ ...prev, [category]: "" }));
        }
    };

    const removeSkill = (category, skillToRemove) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter(s => s !== skillToRemove)
            }
        }));
    };

    const suggestSkills = () => {
        setIsSuggestingSkills(true);
        setTimeout(() => {
            setResumeData(prev => {
                const addUnique = (arr, newItems) => {
                    const set = new Set(arr);
                    newItems.forEach(item => set.add(item));
                    return Array.from(set);
                };
                return {
                    ...prev,
                    skills: {
                        technical: addUnique(prev.skills.technical, ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"]),
                        soft: addUnique(prev.skills.soft, ["Team Leadership", "Problem Solving"]),
                        tools: addUnique(prev.skills.tools, ["Git", "Docker", "AWS"])
                    }
                };
            });
            setIsSuggestingSkills(false);
        }, 1000);
    };

    // Project Tech Stack Handlers
    const handleProjectTechKeyDown = (e, projId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = (projectTechInputs[projId] || "").trim();
            if (val) {
                setResumeData(prev => {
                    const newProjects = prev.projects.map(p => {
                        if (p.id === projId) {
                            if (!p.techStack.includes(val)) {
                                return { ...p, techStack: [...p.techStack, val] };
                            }
                        }
                        return p;
                    });
                    return { ...prev, projects: newProjects };
                });
            }
            setProjectTechInputs(prev => ({ ...prev, [projId]: "" }));
        }
    };

    const removeProjectTech = (projId, techToRemove) => {
        setResumeData(prev => {
            const newProjects = prev.projects.map(p => {
                if (p.id === projId) {
                    return { ...p, techStack: p.techStack.filter(t => t !== techToRemove) };
                }
                return p;
            });
            return { ...prev, projects: newProjects };
        });
    };

    const toggleProjectAccordion = (projId) => {
        setResumeData(prev => {
            const newProjects = prev.projects.map(p => {
                if (p.id === projId) {
                    return { ...p, isExpanded: !p.isExpanded };
                }
                return p;
            });
            return { ...prev, projects: newProjects };
        });
    };


    // Guidance Check Logic
    const actionVerbs = ["Built", "Developed", "Designed", "Implemented", "Led", "Improved", "Created", "Optimized", "Automated", "Engineered", "Managed", "Architected", "Spearheaded", "Directed", "Executed", "Launched", "Resolved", "Reduced", "Increased"];

    const checkBulletGuidance = (text) => {
        if (!text || !text.trim()) return { missingVerb: false, missingNumber: false };
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        let missingVerb = false;
        let missingNumber = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            const cleanLine = trimmed.replace(/^[-*•\s]+/, '');
            if (cleanLine) {
                const firstWord = cleanLine.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
                if (firstWord && !actionVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase())) {
                    missingVerb = true;
                }
                if (!/\d|%|k\b|m\b/i.test(cleanLine)) {
                    missingNumber = true;
                }
            }
        });

        return { missingVerb, missingNumber };
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label className="field-label">{idx === 0 ? "Institution / Degree" : `Education ${idx + 1}`}</label>
                                        <button className="btn" style={{ padding: '2px 8px', fontSize: '12px', color: '#8b0000' }} onClick={() => removeArrayItem('education', edu.id)}>Remove</button>
                                    </div>
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
                            {resumeData.experience.map((exp, idx) => {
                                const { missingVerb, missingNumber } = checkBulletGuidance(exp.details);
                                return (
                                    <div key={exp.id} style={{ marginBottom: idx < resumeData.experience.length - 1 ? '16px' : '0', paddingBottom: idx < resumeData.experience.length - 1 ? '16px' : '0', borderBottom: idx < resumeData.experience.length - 1 ? '1px dashed rgba(17,17,17,0.1)' : 'none' }}>
                                        <div className="field-group" style={{ marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <label className="field-label">Role & Company</label>
                                                <button className="btn" style={{ padding: '2px 8px', fontSize: '12px', color: '#8b0000' }} onClick={() => removeArrayItem('experience', exp.id)}>Remove</button>
                                            </div>
                                            <input className="text-input" type="text" placeholder="e.g. Senior Software Engineer at Tech Corp" value={exp.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} />
                                        </div>
                                        <div className="field-group">
                                            <textarea className="text-area" placeholder="Built scalable systems. Improved performance by 30%..." value={exp.details} onChange={(e) => handleArrayChange('experience', idx, 'details', e.target.value)}></textarea>
                                            {(missingVerb || missingNumber) && (
                                                <div className="guidance-msg">
                                                    <span className="guidance-msg-icon">💡</span>
                                                    <div className="guidance-msg-content">
                                                        {missingVerb && <div>Start bullets with a strong action verb.</div>}
                                                        {missingNumber && <div>Add measurable impact (numbers/metrics).</div>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </article>

                    {/* Projects (Accordion) */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Projects</h2>
                            <button className="btn btn--secondary" style={{ padding: '4px 12px', fontSize: '13px' }} onClick={() => addArrayItem('projects', { name: "New Project", details: "", techStack: [], liveUrl: "", githubUrl: "", isExpanded: true })}>+ Add Project</button>
                        </header>
                        <div className="card__body">
                            {resumeData.projects.map((proj, idx) => {
                                const { missingVerb, missingNumber } = checkBulletGuidance(proj.details);
                                return (
                                    <div key={proj.id} style={{ marginBottom: idx < resumeData.projects.length - 1 ? '16px' : '0', borderBottom: idx < resumeData.projects.length - 1 ? '1px dashed rgba(17,17,17,0.1)' : 'none' }}>
                                        <div className={`accordion-header ${proj.isExpanded ? 'is-open' : ''}`} onClick={() => toggleProjectAccordion(proj.id)}>
                                            <div className="accordion-title">
                                                <span className="accordion-toggle-icon">▼</span>
                                                {proj.name || "Untitled Project"}
                                            </div>
                                            <button className="btn" style={{ padding: '2px 8px', fontSize: '12px', color: '#8b0000', margin: 0 }} onClick={(e) => { e.stopPropagation(); removeArrayItem('projects', proj.id); }}>Remove</button>
                                        </div>

                                        {proj.isExpanded && (
                                            <div className="accordion-body">
                                                <div className="field-group" style={{ marginBottom: '12px' }}>
                                                    <label className="field-label">Project Title</label>
                                                    <input className="text-input" type="text" placeholder="e.g. AI Resume Builder" value={proj.name} onChange={(e) => handleArrayChange('projects', idx, 'name', e.target.value)} />
                                                </div>

                                                <div className="field-group field-group--inline" style={{ marginBottom: '12px' }}>
                                                    <div className="field-group__item">
                                                        <label className="field-label">Live URL (Optional)</label>
                                                        <input className="text-input" type="text" placeholder="https://..." value={proj.liveUrl} onChange={(e) => handleArrayChange('projects', idx, 'liveUrl', e.target.value)} />
                                                    </div>
                                                    <div className="field-group__item">
                                                        <label className="field-label">GitHub URL (Optional)</label>
                                                        <input className="text-input" type="text" placeholder="https://github.com/..." value={proj.githubUrl} onChange={(e) => handleArrayChange('projects', idx, 'githubUrl', e.target.value)} />
                                                    </div>
                                                </div>

                                                <div className="field-group" style={{ marginBottom: '12px' }}>
                                                    <label className="field-label">Tech Stack</label>
                                                    <div className="tag-input-container">
                                                        {proj.techStack.map(tech => (
                                                            <div className="tag-pill" key={tech}>
                                                                {tech}
                                                                <button onClick={() => removeProjectTech(proj.id, tech)}>×</button>
                                                            </div>
                                                        ))}
                                                        <input
                                                            className="tag-input"
                                                            type="text"
                                                            placeholder="Type & Enter"
                                                            value={projectTechInputs[proj.id] || ""}
                                                            onChange={(e) => setProjectTechInputs(prev => ({ ...prev, [proj.id]: e.target.value }))}
                                                            onKeyDown={(e) => handleProjectTechKeyDown(e, proj.id)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="field-group">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <label className="field-label">Description</label>
                                                        <span style={{ fontSize: '12px', color: proj.details.length >= 200 ? '#8b0000' : '#888' }}>{proj.details.length}/200</span>
                                                    </div>
                                                    <textarea className="text-area" maxLength={200} placeholder="Architected a scalable resume platform using Vite and React." value={proj.details} onChange={(e) => handleArrayChange('projects', idx, 'details', e.target.value)}></textarea>
                                                    {(missingVerb || missingNumber) && (
                                                        <div className="guidance-msg">
                                                            <span className="guidance-msg-icon">💡</span>
                                                            <div className="guidance-msg-content">
                                                                {missingVerb && <div>Start bullets with a strong action verb.</div>}
                                                                {missingNumber && <div>Add measurable impact (numbers/metrics).</div>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </article>

                    {/* Skills */}
                    <article className="card">
                        <header className="card__header">
                            <h2 className="card__title">Skills</h2>
                            <button
                                className="btn btn--secondary"
                                style={{ padding: '4px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                onClick={suggestSkills}
                                disabled={isSuggestingSkills}
                            >
                                {isSuggestingSkills ? <span className="spinner">⌛</span> : "✨"} Suggest Skills
                            </button>
                        </header>

                        <div className="card__body">
                            {/* Technical Skills */}
                            <div className="field-group" style={{ marginBottom: '8px' }}>
                                <label className="field-label">Technical Skills ({resumeData.skills.technical.length})</label>
                                <div className="tag-input-container">
                                    {resumeData.skills.technical.map(skill => (
                                        <div className="tag-pill" key={skill}>
                                            {skill}
                                            <button onClick={() => removeSkill('technical', skill)}>×</button>
                                        </div>
                                    ))}
                                    <input
                                        className="tag-input"
                                        type="text"
                                        placeholder="Add skill & press Enter"
                                        value={skillInputs.technical}
                                        onChange={(e) => setSkillInputs(prev => ({ ...prev, technical: e.target.value }))}
                                        onKeyDown={(e) => handleSkillInputKeyDown(e, 'technical')}
                                    />
                                </div>
                            </div>

                            {/* Soft Skills */}
                            <div className="field-group" style={{ marginBottom: '8px' }}>
                                <label className="field-label">Soft Skills ({resumeData.skills.soft.length})</label>
                                <div className="tag-input-container">
                                    {resumeData.skills.soft.map(skill => (
                                        <div className="tag-pill" key={skill}>
                                            {skill}
                                            <button onClick={() => removeSkill('soft', skill)}>×</button>
                                        </div>
                                    ))}
                                    <input
                                        className="tag-input"
                                        type="text"
                                        placeholder="Add skill & press Enter"
                                        value={skillInputs.soft}
                                        onChange={(e) => setSkillInputs(prev => ({ ...prev, soft: e.target.value }))}
                                        onKeyDown={(e) => handleSkillInputKeyDown(e, 'soft')}
                                    />
                                </div>
                            </div>

                            {/* Tools & Technologies */}
                            <div className="field-group">
                                <label className="field-label">Tools & Technologies ({resumeData.skills.tools.length})</label>
                                <div className="tag-input-container">
                                    {resumeData.skills.tools.map(skill => (
                                        <div className="tag-pill" key={skill}>
                                            {skill}
                                            <button onClick={() => removeSkill('tools', skill)}>×</button>
                                        </div>
                                    ))}
                                    <input
                                        className="tag-input"
                                        type="text"
                                        placeholder="Add tool & press Enter"
                                        value={skillInputs.tools}
                                        onChange={(e) => setSkillInputs(prev => ({ ...prev, tools: e.target.value }))}
                                        onKeyDown={(e) => handleSkillInputKeyDown(e, 'tools')}
                                    />
                                </div>
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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
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
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top 3 Improvements</h4>
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

                    {/* Template Selection Tabs */}
                    <div className="template-tabs">
                        <button className={`template-tab ${selectedTemplate === 'classic' ? 'active' : ''}`} onClick={() => setSelectedTemplate('classic')}>Classic</button>
                        <button className={`template-tab ${selectedTemplate === 'modern' ? 'active' : ''}`} onClick={() => setSelectedTemplate('modern')}>Modern</button>
                        <button className={`template-tab ${selectedTemplate === 'minimal' ? 'active' : ''}`} onClick={() => setSelectedTemplate('minimal')}>Minimal</button>
                    </div>

                    {/* Real-time Preview Area */}
                    <div className="preview-shell">
                        <div className={`resume-document template-${selectedTemplate}`} style={{ padding: 0, minHeight: '100%', background: 'transparent' }}>

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
                                    <h2 className="resume-section-title">Summary</h2>
                                    <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{resumeData.summary}</p>
                                </section>
                            )}

                            {/* Education */}
                            {resumeData.education.some(e => e.text.trim()) && (
                                <section className="resume-section">
                                    <h2 className="resume-section-title">Education</h2>
                                    {resumeData.education.filter(e => e.text.trim()).map((edu, idx) => (
                                        <div className="resume-item" key={edu.id} style={{ marginBottom: idx === resumeData.education.length - 1 ? 0 : '12px' }}>
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
                                        <div className="resume-item" key={exp.id} style={{ marginBottom: idx === resumeData.experience.length - 1 ? 0 : '16px' }}>
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
                            )}

                            {/* Projects */}
                            {resumeData.projects.some(p => p.name.trim() || p.details.trim()) && (
                                <section className="resume-section">
                                    <h2 className="resume-section-title">Projects</h2>
                                    {resumeData.projects.filter(p => p.name.trim() || p.details.trim()).map((proj, idx) => (
                                        <div className="resume-item" key={proj.id} style={{ marginBottom: idx === resumeData.projects.length - 1 ? 0 : '16px' }}>
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
                                            {proj.techStack.length > 0 && (
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
                </aside>

            </section>
        </main>
    );
}

export default Builder;
