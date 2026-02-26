import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card.jsx";

const STORAGE_KEY = "prp_test_checklist_v1";

const TEST_ITEMS = [
  {
    id: "jd-required",
    label: "JD required validation works",
    hint: "Leave JD empty on the Assessments page and click Analyze. You should see a clear validation message and no navigation."
  },
  {
    id: "jd-short-warning",
    label: "Short JD warning shows for <200 chars",
    hint: "Paste a very short JD (under 200 characters) and click Analyze. A calm warning should appear below the textarea."
  },
  {
    id: "skills-grouping",
    label: "Skills extraction groups correctly",
    hint: "Use a JD mentioning React, SQL, AWS, etc. Ensure skills appear under the right categories in the Results view."
  },
  {
    id: "round-mapping",
    label: "Round mapping changes based on company + skills",
    hint: "Compare Results for a big tech company (e.g. Amazon) vs a startup name and check that rounds and descriptions shift."
  },
  {
    id: "score-deterministic",
    label: "Score calculation is deterministic",
    hint: "Run the same JD multiple times. The base score before toggling skills should be identical for the same inputs."
  },
  {
    id: "toggles-update-score",
    label: "Skill toggles update score live",
    hint: "In Results, mark some skills as “I know this” and confirm the score bar updates smoothly in real time."
  },
  {
    id: "persist-after-refresh",
    label: "Changes persist after refresh",
    hint: "Toggle a few skills, refresh the Results page, and verify your toggles and score remain intact."
  },
  {
    id: "history-saves-loads",
    label: "History saves and loads correctly",
    hint: "Run multiple analyses and then open the History page. Each entry should open the correct analysis."
  },
  {
    id: "export-buttons",
    label: "Export buttons copy the correct content",
    hint: "Use the copy and download buttons in Results and paste/open the output to verify plan, checklist, questions, and JD."
  },
  {
    id: "no-console-errors",
    label: "No console errors on core pages",
    hint: "Open browser dev tools and navigate Dashboard, Assessments, Results, and History. There should be no red errors."
  }
];

function loadChecklist() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveChecklist(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write failures
  }
}

function TestChecklist() {
  const [checked, setChecked] = useState({});

  useEffect(() => {
    setChecked(loadChecklist());
  }, []);

  const total = TEST_ITEMS.length;
  const passed = TEST_ITEMS.filter((item) => checked[item.id]).length;
  const allPassed = passed === total;

  const toggle = (id) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecklist(next);
      return next;
    });
  };

  const handleReset = () => {
    setChecked({});
    saveChecklist({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-white">
          Release Test Checklist
        </h2>
        <p className="text-sm text-slate-300">
          Built-in test run before shipping updates to the Placement Readiness
          Platform.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Test summary</CardTitle>
            <CardDescription>
              Run through each scenario once per release and mark items as
              passed.
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Tests Passed
            </p>
            <p className="text-xl font-semibold text-white">
              {passed} <span className="text-sm text-slate-400">/ {total}</span>
            </p>
            {!allPassed && (
              <p className="mt-1 text-[11px] text-amber-300">
                Fix issues before shipping.
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 justify-between">
            <p className="text-xs text-slate-400">
              Checklist state is stored in this browser only via localStorage.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium border border-slate-700 text-slate-200 hover:bg-slate-900 transition-colors"
            >
              Reset checklist
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core regression tests</CardTitle>
          <CardDescription>
            Ten sanity checks covering validation, scoring, persistence, and
            exports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {TEST_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2.5"
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={[
                  "mt-0.5 flex h-4 w-4 items-center justify-center rounded border transition-colors",
                  checked[item.id]
                    ? "border-primary bg-primary text-slate-950"
                    : "border-slate-600 bg-slate-950/50"
                ].join(" ")}
                aria-pressed={checked[item.id] ? "true" : "false"}
              >
                {checked[item.id] && (
                  <span className="block h-2 w-2 rounded-sm bg-slate-950" />
                )}
              </button>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium text-slate-100">
                  {item.label}
                </p>
                {item.hint && (
                  <p className="text-xs text-slate-400">{item.hint}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default TestChecklist;

