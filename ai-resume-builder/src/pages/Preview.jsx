function Preview() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '40px' }}>
            <div className="resume-document">

                <header className="resume-header">
                    <h1 className="resume-name">VISHAL</h1>
                    <div className="resume-contact">
                        <span>vishal@example.com</span>
                        <span>+91 9876543210</span>
                        <span>Bangalore, India</span>
                        <span>github.com/vishal</span>
                    </div>
                </header>

                <section className="resume-section">
                    <h2 className="resume-section-title">Professional Summary</h2>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        Software Engineer specializing in modern frontend architectures and premium user experiences. Consistent track record of delivering scalable web applications with a focus on clean code and pixel-perfect implementation.
                    </p>
                </section>

                <section className="resume-section">
                    <h2 className="resume-section-title">Experience</h2>

                    <div className="resume-item">
                        <div className="resume-item-header">
                            <div className="resume-item-title">Frontend Engineer, KodNest</div>
                            <div className="resume-item-date">2024 - Present</div>
                        </div>
                        <div className="resume-item-subtitle">Bangalore, India</div>
                        <ul className="resume-list">
                            <li>Developed premium UI development systems, reducing time to market by 40%.</li>
                            <li>Architected reusable vanilla CSS frameworks strictly following high-end design requirements.</li>
                            <li>Led the integration of local first architectures.</li>
                        </ul>
                    </div>
                </section>

                <section className="resume-section">
                    <h2 className="resume-section-title">Projects</h2>

                    <div className="resume-item">
                        <div className="resume-item-header">
                            <div className="resume-item-title">AI Resume Builder</div>
                            <div className="resume-item-date">2025</div>
                        </div>
                        <ul className="resume-list">
                            <li>Implemented skeletal premium layout utilizing a monochromatic palette and classic serif typographies.</li>
                            <li>Created isolated scalable micro-frontends via React and Vite tooling.</li>
                        </ul>
                    </div>
                </section>

                <section className="resume-section">
                    <h2 className="resume-section-title">Education</h2>

                    <div className="resume-item">
                        <div className="resume-item-header">
                            <div className="resume-item-title">B.E. Computer Science</div>
                            <div className="resume-item-date">2024</div>
                        </div>
                        <div className="resume-item-subtitle">KodNest University</div>
                    </div>
                </section>

                <section className="resume-section">
                    <h2 className="resume-section-title">Skills</h2>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        <strong>Languages & Technologies:</strong> JavaScript, React, Node.js, Vite, CSS Architecture<br />
                        <strong>Concepts:</strong> Systems Design, Local-First Data, UI/UX Implementation
                    </p>
                </section>

            </div>
        </div>
    );
}

export default Preview;
