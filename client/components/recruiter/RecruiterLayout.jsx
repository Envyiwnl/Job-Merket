import { useState } from "react";
import { Outlet } from "react-router-dom";
import RecruiterSidebar from "./RecruiterSidebar";
import RecruiterHeader from "./RecruiterHeader";

export default function RecruiterLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function openSidebar() {
    setIsSidebarOpen(true);
  }
  function closeSidebar() {
    setIsSidebarOpen(false);
  }
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <RecruiterSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <div className="min-w-0 flex-1">
        <RecruiterHeader onMenuClick={openSidebar}/>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
