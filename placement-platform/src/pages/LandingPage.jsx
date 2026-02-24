import { Code2, Video, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero */}
      <header className="flex-1 flex flex-col">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 flex flex-col items-start gap-10">
          <div>
            <p className="text-sm font-medium text-primary tracking-[0.22em] uppercase mb-4">
              Placement Readiness Platform
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
              Ace Your Placement
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Practice, assess, and prepare for your dream job with a focused
              workspace built for serious placement preparation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/app/dashboard")}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold bg-primary text-white shadow-sm hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
            <span className="text-sm text-slate-400">
              No distractions. Just structured prep.
            </span>
          </div>
        </div>
      </header>

      {/* Features */}
      <main className="pb-16">
        <section className="max-w-5xl mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border border-slate-800 rounded-lg p-6 bg-slate-900/40">
              <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Practice Problems</h3>
              <p className="text-sm text-slate-300">
                Sharpen your skills with curated coding and aptitude sets.
              </p>
            </div>
            <div className="border border-slate-800 rounded-lg p-6 bg-slate-900/40">
              <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mock Interviews</h3>
              <p className="text-sm text-slate-300">
                Simulate real interview environments to build confidence.
              </p>
            </div>
            <div className="border border-slate-800 rounded-lg p-6 bg-slate-900/40">
              <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-slate-300">
                Visualize your readiness with clear progress indicators.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6">
        <div className="max-w-5xl mx-auto px-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Placement Readiness Platform. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

