import { Link, useLocation } from "react-router-dom";

function TopNav() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <header className="top-bar">
            <div className="top-bar__left">
                <Link to="/" className="top-bar__project-name">AI Resume Builder</Link>
            </div>
            <div className="top-bar__center">
                {/* Nav Links */}
                <Link
                    to="/builder"
                    className={`top-bar__nav-link ${currentPath === '/builder' ? 'active' : ''}`}
                >
                    Builder
                </Link>
                <Link
                    to="/preview"
                    className={`top-bar__nav-link ${currentPath === '/preview' ? 'active' : ''}`}
                >
                    Preview
                </Link>
                <Link
                    to="/proof"
                    className={`top-bar__nav-link ${currentPath === '/proof' ? 'active' : ''}`}
                >
                    Proof
                </Link>
            </div>
            <div className="top-bar__right">
                <span className="status-badge status-badge--not-started">Skeleton Mode</span>
            </div>
        </header>
    );
}

export default TopNav;
