import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card.jsx";
import { analyzeJD } from "../lib/analysis.js";
import { addHistoryEntry, createId } from "../lib/storage.js";

function Assessments() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    const trimmedText = jdText.trim();
    if (!trimmedText) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = analyzeJD({ company, role, jdText: trimmedText });
      const entry = {
        id: createId(),
        createdAt: new Date().toISOString(),
        company: company.trim() || "Unknown company",
        role: role.trim() || "Role not specified",
        jdText: trimmedText,
        ...analysis,
        baseReadinessScore: analysis.readinessScore
      };

      addHistoryEntry(entry);
      navigate(`/app/results?id=${encodeURIComponent(entry.id)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-white">JD Assessment</h2>
        <p className="text-sm text-slate-300">
          Paste a job description to generate skills, checklist, plan, and
          likely questions. All analysis runs locally and is saved to history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>
            Provide basic context so the analysis can tune checklists and
            questions to this opportunity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Company
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Role
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE-1, Frontend Engineer"
                className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Job description
            </label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full JD here. Keywords like React, SQL, DSA, AWS help tune the plan."
              rows={10}
              className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-0 resize-y"
            />
            <p className="text-[11px] text-slate-500">
              No data leaves your browser. Each analysis is saved locally so you
              can revisit it from the history view.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-xs font-medium border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
              onClick={() => {
                setCompany("");
                setRole("");
                setJdText("");
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || jdText.trim().length === 0}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Assessments;

