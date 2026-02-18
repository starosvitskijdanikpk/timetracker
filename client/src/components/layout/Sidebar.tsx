import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="bg-surface border-r border-white/[0.06] h-screen sticky top-0 flex flex-col py-7">
      {/* Logo */}
      <div className="px-6 pb-8 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center">
          <span className="text-void font-bold text-sm">T</span>
        </div>
        <div className="font-mono font-bold text-sm">
          <span className="text-primary">Time</span>
          <span className="text-amber">Tracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? "text-amber bg-amber/15 font-medium"
                : "text-secondary hover:text-primary hover:bg-elevated"
            }`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Трекер
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? "text-amber bg-amber/15 font-medium"
                : "text-secondary hover:text-primary hover:bg-elevated"
            }`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Проекти
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? "text-amber bg-amber/15 font-medium"
                : "text-secondary hover:text-primary hover:bg-elevated"
            }`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Звіти
        </NavLink>
      </nav>

      {/* User Avatar */}
      <div className="px-6 pt-4 border-t border-white/[0.06] mt-auto">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-amber to-teal rounded-full flex items-center justify-center">
            <span className="text-void font-semibold text-sm">К</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-primary">Користувач</div>
            <div className="text-xs text-secondary">Pro план</div>
          </div>
        </div>
      </div>
    </div>
  );
};
