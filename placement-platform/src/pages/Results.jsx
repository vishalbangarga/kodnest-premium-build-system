import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card.jsx";
import {
  findHistoryEntryById,
  loadLatest,
  updateHistoryEntry
} from "../lib/storage.js";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function buildInitialSkillMap(extractedSkills, existingMap) {
  const map = { ...(existingMap || {}) };
  Object.values(extractedSkills || {}).forEach((skills) => {
    skills.forEach((skill) => {
      if (!map[skill]) {
        map[skill] = "practice";
      }
    });
  });
  return map;
}

function computeLiveScore(baseScore, skillConfidenceMap) {
  if (!skillConfidenceMap) return baseScore;
  let bonus = 0;
  Object.entries(skillConfidenceMap).forEach(([_, value]) => {
    if (value === "know") bonus += 2;
  });
  const raw = baseScore + bonus;
  return Math.min(100, Math.max(0, raw));
}

function buildPlanText(plan) {
  const lines = ["7-day Plan", ""];
  Object.entries(plan || {}).forEach(([day, tasks]) => {
    lines.push(`${day}:`);
    tasks.forEach((task) => {
      lines.push(`- ${task}`);
    });
    lines.push("");
  });
  return lines.join("\n").trim();
}

function buildChecklistText(checklist) {
  const lines = ["Round-wise Preparation Checklist", ""];
  Object.entries(checklist || {}).forEach(([round, items]) => {
    lines.push(`${round}:`);
    items.forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push("");
  });
  return lines.join("\n").trim();
}

function buildQuestionsText(questions) {
  const lines = ["Likely Interview Questions", ""];
  (questions || []).forEach((q, idx) => {
    lines.push(`${idx + 1}. ${q}`);
  });
  return lines.join("\n").trim();
}

function buildFullExport(entry) {
  const { company, role, readinessScore, plan, checklist, questions, jdText } =
    entry;
  const parts = [];
  parts.push(`Company: ${company}`);
  parts.push(`Role: ${role}`);
  parts.push(`Readiness Score: ${readinessScore ?? 0}/100`);
  parts.push("");
  parts.push(buildPlanText(plan));
  parts.push("");
  parts.push(buildChecklistText(checklist));
  parts.push("");
  parts.push(buildQuestionsText(questions));
  parts.push("");
  parts.push("JD snapshot:");
  parts.push(jdText || "");
  return parts.join("\n").trim();
}

function Results() {
  const query = useQuery();
  const [entry, setEntry] = useState(null);
  const [entryId, setEntryId] = useState(null);
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({});
  const [baseScore, setBaseScore] = useState(0);

  useEffect(() => {
    const id = query.get("id");
    let resolved = null;
    if (id) {
      const found = findHistoryEntryById(id);
      if (found) resolved = found;
    }
    if (!resolved) {
      resolved = loadLatest();
    }
    if (resolved && resolved.id !== entryId) {
      setEntry(resolved);
      setEntryId(resolved.id);
      const initialMap = buildInitialSkillMap(
        resolved.extractedSkills || {},
        resolved.skillConfidenceMap || {}
      );
      setSkillConfidenceMap(initialMap);
      const base =
        typeof resolved.baseReadinessScore === "number"
          ? resolved.baseReadinessScore
          : typeof resolved.readinessScore === "number"
          ? resolved.readinessScore
          : 0;
      setBaseScore(base);
    }
  }, [query, entryId]);

  const liveScore = useMemo(
    () => computeLiveScore(baseScore, skillConfidenceMap),
    [baseScore, skillConfidenceMap]
  );

  const weakSkills = useMemo(
    () =>
      Object.entries(skillConfidenceMap || {})
        .filter(([, v]) => v === "practice")
        .map(([skill]) => skill)
        .slice(0, 3),
    [skillConfidenceMap]
  );

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

  const { company, role, jdText, extractedSkills, checklist, plan, questions } =
    entry;

  const handleToggleSkill = (skill) => {
    setSkillConfidenceMap((prev) => {
      const current = prev[skill] || "practice";
      const nextValue = current === "know" ? "practice" : "know";
      const nextMap = { ...prev, [skill]: nextValue };

      const updatedEntry = {
        ...entry,
        skillConfidenceMap: nextMap,
        baseReadinessScore: baseScore,
        readinessScore: computeLiveScore(baseScore, nextMap)
      };
      setEntry(updatedEntry);
      updateHistoryEntry(updatedEntry);

      return nextMap;
    });
  };

  const handleCopy = async (textBuilder) => {
    try {
      const text = textBuilder();
      if (!navigator.clipboard) return;
      await navigator.clipboard.writeText(text);
    } catch {
      // keep failure silent
    }
  };

  const handleDownload = () => {
    const text = buildFullExport({ ...entry, readinessScore: liveScore });
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "placement-readiness-results.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

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
              {liveScore}
              <span className="text-base text-slate-400"> / 100</span>
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(0, liveScore))}%`
                }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-xs">
            Score is heuristic: JD richness + detected categories, adjusted by
            what you mark as already strong.
          </div>
        </CardContent>
      </Card>

      {/* Export tools */}
      <Card>
        <CardHeader>
          <CardTitle>Export tools</CardTitle>
          <CardDescription>
            Copy plans and questions into your own notes, or download a single
            TXT snapshot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-xs font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
              onClick={() => handleCopy(() => buildPlanText(plan))}
            >
              Copy 7-day plan
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md text-xs font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
              onClick={() => handleCopy(() => buildChecklistText(checklist))}
            >
              Copy round checklist
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md text-xs font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
              onClick={() => handleCopy(() => buildQuestionsText(questions))}
            >
              Copy 10 questions
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
              onClick={handleDownload}
            >
              Download as TXT
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Key skills with self-assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Key skills extracted</CardTitle>
            <CardDescription>
              Toggle each skill to reflect your current confidence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(extractedSkills || {}).map(([category, skills]) => (
              <div key={category} className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => {
                    const state = skillConfidenceMap[skill] || "practice";
                    const isKnow = state === "know";
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors",
                          isKnow
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-slate-700 bg-slate-900/70 text-slate-100 hover:border-primary/50 hover:bg-slate-900"
                        ].join(" ")}
                      >
                        <span>{skill}</span>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                          {isKnow ? "I know this" : "Need practice"}
                        </span>
                      </button>
                    );
                  })}
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

        {/* Action Next box */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Action next</CardTitle>
            <CardDescription>
              Translate this analysis into a concrete first move.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Top weak skills
              </p>
              {weakSkills.length === 0 ? (
                <p className="text-xs text-slate-300">
                  You have marked all skills as known. Revisit the JD to look
                  for subtle gaps or advanced topics to deepen.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {weakSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-slate-300 md:text-right">
              <p className="font-medium text-slate-100">
                Suggested next action:
              </p>
              <p>Start Day 1 plan now and deliberately focus on one weak skill</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Results;

