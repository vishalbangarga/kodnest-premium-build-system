import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  ClipboardList,
  BookOpen,
  User
} from "lucide-react";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/practice", label: "Practice", icon: Code2 },
  { to: "/app/assessments", label: "Assessments", icon: ClipboardList },
  { to: "/app/resources", label: "Resources", icon: BookOpen },
  { to: "/app/profile", label: "Profile", icon: User }
];

function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/80">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-semibold tracking-tight text-white">
            Placement Prep
          </span>
        </div>
        <nav className="py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  ].join(" ")
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80">
          <div>
            <p className="text-sm text-slate-400 uppercase tracking-[0.16em]">
              Placement Readiness
            </p>
            <h1 className="text-lg font-semibold text-white">
              Placement Prep Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-100">Student User</p>
              <p className="text-xs text-slate-400">Ready to ace placements</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-sm font-semibold">
              SU
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-slate-950">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;

