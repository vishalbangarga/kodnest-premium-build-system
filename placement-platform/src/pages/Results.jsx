import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card.jsx";
import { findHistoryEntryById, loadLatest } from "../lib/storage.js";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function Results() {
  const query = useQuery();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const id = query.get("id");
    if (id) {
      const found = findHistoryEntryById(id);
      if (found) {
        setEntry(found);
        return;
      }
    }
    const latest = loadLatest();
    setEntry(latest);
  }, [query]);

  if (!entry) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Results</h2>
        <p className="text-sm text-slate-300">
          No analysis found. Run an assessment from the{" "}
          <span className="font-semibold text-slate-100">Assessments</span>{" "}
          page, or open an item from the{" "}
          <span className="font-semibold text-slate-100">History</span> view.
        </p>
      </div>
    );
  }

  const { company, role, jdText, extractedSkills, checklist, plan, questions, readinessScore } =
    entry;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-white">Analysis Results</h2>
        <p className="text-sm text-slate-300">
          Tailored breakdown for{" "}
          <span className="font-semibold text-slate-100">
            {company} — {role}
          </span>
          .
        </p>
      </div>

      {/* Summary bar */}
      <Card>
        <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Readiness Score
            </p>
            <p className="text-2xl font-semibold text-white">
              {readinessScore ?? 0}
              <span className="text-base text-slate-400"> / 100</span>
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, Math.max(0, readinessScore ?? 0))}%`
                }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-xs">
            Score is heuristic: based on JD richness, categories detected, and
            how specific the role/company context is.
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Key skills */}
        <Card>
          <CardHeader>
            <CardTitle>Key skills extracted</CardTitle>
            <CardDescription>
              Grouped by category, based on keywords detected in the JD.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(extractedSkills || {}).map(([category, skills]) => (
              <div key={category} className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Round-wise checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Round-wise preparation</CardTitle>
            <CardDescription>
              Checklist for each expected round, tuned to this stack.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(checklist || {}).map(([round, items]) => (
              <div key={round} className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {round}
                </p>
                <ul className="list-disc list-outside space-y-1 pl-4 text-xs text-slate-200">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 7-day plan */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>7-day plan</CardTitle>
            <CardDescription>
              Day-by-day focus areas, adapted to the detected skills and stack.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {Object.entries(plan || {}).map(([day, tasks]) => (
              <div
                key={day}
                className="rounded-md border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1.5">
                  {day}
                </p>
                <ul className="list-disc list-outside space-y-1 pl-4 text-xs text-slate-200">
                  {tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Likely interview questions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Likely interview questions</CardTitle>
            <CardDescription>
              Ten targeted technical and discussion prompts aligned to this JD.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ol className="list-decimal list-outside space-y-1 pl-5 text-sm text-slate-200">
              {(questions || []).map((q, idx) => (
                <li key={`${idx}-${q}`}>{q}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* JD snapshot */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>JD snapshot</CardTitle>
            <CardDescription>
              Stored copy of the text that was analyzed. Use this to cross-check
              detected skills and adjust manually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-slate-800 bg-slate-950/80 p-3 text-[11px] text-slate-200">
              {jdText}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Results;

