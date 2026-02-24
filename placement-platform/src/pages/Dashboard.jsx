import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card.jsx";

const radarData = [
  { skill: "DSA", score: 75 },
  { skill: "System Design", score: 60 },
  { skill: "Communication", score: 80 },
  { skill: "Resume", score: 85 },
  { skill: "Aptitude", score: 70 }
];

const weeklyDays = [
  { label: "Mon", active: true },
  { label: "Tue", active: true },
  { label: "Wed", active: true },
  { label: "Thu", active: false },
  { label: "Fri", active: true },
  { label: "Sat", active: false },
  { label: "Sun", active: false }
];

function ReadinessCircle({ value }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = 80;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setAnimatedValue(value);
  }, [value]);

  const progress = animatedValue / 100;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={220}
        height={220}
        viewBox="0 0 220 220"
        className="mb-4"
      >
        <defs>
          <linearGradient id="readinessGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(245, 58%, 60%)" />
            <stop offset="100%" stopColor="hsl(245, 58%, 45%)" />
          </linearGradient>
        </defs>
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="rgba(148, 163, 184, 0.35)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="url(#readinessGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 800ms ease-out"
          }}
          transform="rotate(-90 110 110)"
        />
        <text
          x="110"
          y="110"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-white"
          fontSize="32"
          fontWeight="600"
        >
          {value}
        </text>
        <text
          x="110"
          y="140"
          textAnchor="middle"
          className="fill-slate-400"
          fontSize="12"
        >
          / 100
        </text>
      </svg>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        Readiness Score
      </p>
    </div>
  );
}

function ProgressBar({ value, max }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <p className="text-sm text-slate-300">
          Snapshot of your placement readiness and the next steps to focus on.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall Readiness */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
            <CardDescription>
              Combined view of your current preparation across key areas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ReadinessCircle value={72} />
          </CardContent>
        </Card>

        {/* Skill Breakdown radar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>
              Strengths and gaps across core placement skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="rgba(148, 163, 184, 0.4)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#cbd5f5", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  tick={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(245, 58%, 60%)"
                  fill="hsl(245, 58%, 51%)"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Practice</CardTitle>
            <CardDescription>
              Pick up where you left off in your last practice session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Last topic</p>
                <p className="text-base font-semibold text-white">
                  Dynamic Programming
                </p>
              </div>
              <p className="text-xs text-slate-400">3 / 10 problems</p>
            </div>
            <ProgressBar value={3} max={10} />
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          </CardContent>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
            <CardDescription>
              Track your target problems and daily consistency.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-200">
                Problems Solved:{" "}
                <span className="font-semibold text-white">12</span>
                <span className="text-slate-400"> / 20 this week</span>
              </p>
            </div>
            <ProgressBar value={12} max={20} />
            <div className="flex items-center justify-between pt-2">
              {weeklyDays.map((day) => (
                <div key={day.label} className="flex flex-col items-center">
                  <div
                    className={[
                      "w-7 h-7 rounded-full border flex items-center justify-center text-xs",
                      day.active
                        ? "bg-primary/80 border-primary text-white"
                        : "border-slate-700 text-slate-400"
                    ].join(" ")}
                  >
                    {day.label[0]}
                  </div>
                  <span className="mt-1 text-[10px] text-slate-500">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assessments */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>
              Keep an eye on your scheduled tests and reviews.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: "DSA Mock Test",
                time: "Tomorrow, 10:00 AM"
              },
              {
                title: "System Design Review",
                time: "Wed, 2:00 PM"
              },
              {
                title: "HR Interview Prep",
                time: "Friday, 11:00 AM"
              }
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
                <span className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Scheduled
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;

