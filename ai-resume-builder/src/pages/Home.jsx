import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="main-layout" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <section className="context-header" style={{ maxWidth: '800px' }}>
                <h1 className="context-header__title" style={{ fontSize: '64px', marginBottom: '24px' }}>
                    Build a Resume That Gets Read.
                </h1>
                <p className="context-header__subtitle" style={{ fontSize: '20px', margin: '0 auto 40px auto', maxWidth: '600px' }}>
                    Experience a calm, predictable workspace designed to help you architect your career profile without the noise.
                </p>

                <Link to="/builder" className="btn btn--primary" style={{ fontSize: '18px', padding: '12px 32px' }}>
                    Start Building
                </Link>
            </section>
        </main>
    );
}

export default Home;
