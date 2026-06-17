import { useState } from "react";
import { Outlet } from "react-router-dom";

import { DashboardHeaderActionsProvider } from "@/components/dashboard/DashboardHeaderActionsContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-page-bg">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeaderActionsProvider>
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </DashboardHeaderActionsProvider>
      </div>
    </div>
  );
}
