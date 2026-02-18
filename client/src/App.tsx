import { BrowserRouter, Routes, Route, Outlet, NavLink } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar.js";
import { TopTimerBar } from "./components/layout/TopTimerBar.js";
import { TrackerPage } from "./pages/TrackerPage.js";
import { ProjectsPage } from "./pages/ProjectsPage.js";
import { ReportsPage } from "./pages/ReportsPage.js";
import { useTimeEntries } from "./hooks/useTimeEntries.js";

function Layout() {
  return (
    <div className="bg-void min-h-screen text-primary">
      <div className="md:grid md:grid-cols-[220px_1fr] min-h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex flex-col">
          <TopTimerBar />
          <main className="flex-1 pb-20 md:pb-0">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-white/[0.06] flex">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive ? "text-amber" : "text-secondary"
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Трекер
        </NavLink>
        
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive ? "text-amber" : "text-secondary"
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Проекти
        </NavLink>
        
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive ? "text-amber" : "text-secondary"
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Звіти
        </NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TrackerPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

