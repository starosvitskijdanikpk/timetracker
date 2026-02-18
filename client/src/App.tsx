import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar.js";
import { TopTimerBar } from "./components/layout/TopTimerBar.js";
import { TrackerPage } from "./pages/TrackerPage.js";
import { ProjectsPage } from "./pages/ProjectsPage.js";
import { ReportsPage } from "./pages/ReportsPage.js";
import { useTimeEntries } from "./hooks/useTimeEntries.js";

function Layout() {
  return (
    <div className="bg-void min-h-screen text-primary">
      <div className="grid grid-cols-[220px_1fr] min-h-screen">
        <Sidebar />
        <div className="flex flex-col">
          <TopTimerBar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
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

