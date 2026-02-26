import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card.jsx";

const STORAGE_KEY = "prp_test_checklist_v1";
const REQUIRED_COUNT = 10;

function loadChecklistState() {
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

function ShipGate() {
  const [passedCount, setPassedCount] = useState(0);

  useEffect(() => {
    const checked = loadChecklistState();
    const count = Object.values(checked).filter(Boolean).length;
    setPassedCount(count);
  }, []);

  const allPassed = passedCount >= REQUIRED_COUNT;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-white">Ship Readiness</h2>
        <p className="text-sm text-slate-300">
          Lock shipping until the built-in test checklist has been fully passed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Release gate</CardTitle>
          <CardDescription>
            Summary of your local checklist state. Use this as a final guard
            before pushing changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Tests Passed
              </p>
              <p className="text-2xl font-semibold text-white">
                {passedCount}
                <span className="text-base text-slate-400">
                  {" "}
                  / {REQUIRED_COUNT}
                </span>
              </p>
            </div>
            <div
              className={[
                "inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em]",
                allPassed
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/40"
              ].join(" ")}
            >
              {allPassed ? "Ship unlocked" : "Ship locked"}
            </div>
          </div>

          {!allPassed ? (
            <div className="space-y-2">
              <p className="text-sm text-amber-300">
                Fix issues before shipping.
              </p>
              <p className="text-xs text-slate-400">
                At least one test in the{" "}
                <span className="font-semibold text-slate-100">
                  Release Test Checklist
                </span>{" "}
                is not marked as passed. Open the checklist page, run remaining
                tests, and mark them complete.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-emerald-300">
                All tests are marked as passed. You are clear to ship from a
                local checklist perspective.
              </p>
              <p className="text-xs text-slate-400">
                Remember to still run your usual git checks, CI, and manual
                review steps as needed for your team.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ShipGate;

