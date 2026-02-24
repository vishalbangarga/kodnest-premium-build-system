import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card.jsx";
import { loadHistory } from "../lib/storage.js";

function Resources() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-white">History</h2>
        <p className="text-sm text-slate-300">
          Previously analyzed job descriptions, stored locally so you can
          revisit skills, plans, and questions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis history</CardTitle>
          <CardDescription>
            Click an entry to open its full analysis view. Data is stored in
            this browser only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-slate-400">
              No analyses yet. Run your first JD through the{" "}
              <span className="font-semibold text-slate-200">
                Assessments
              </span>{" "}
              page to see it appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => {
                const created = entry.createdAt
                  ? new Date(entry.createdAt)
                  : null;
                const dateLabel = created
                  ? created.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })
                  : "Unknown date";

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/app/results?id=${encodeURIComponent(entry.id)}`
                      )
                    }
                    className="w-full text-left rounded-md border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-primary/60 hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {entry.company} — {entry.role}
                        </p>
                        <p className="text-xs text-slate-400">{dateLabel}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-slate-400">
                          Readiness Score
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100">
                          {entry.readinessScore ?? 0}/100
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Resources;

