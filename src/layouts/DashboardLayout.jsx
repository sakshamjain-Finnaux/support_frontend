import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/sidebar/Sidebar";
import Navbar from "../components/ui/navbar/Navbar";
import Breadcrumbs from "../components/ui/breadcrumb";
import useDashboard from "../contexts/DashboardContext";
import { useMemo } from "react";
export default function DashboardLayout() {
  const { isSidebarOpen } = useDashboard();
  return useMemo(
    () => (
      <div className="flex flex-col flex-grow h-screen max-h-screen">
        <Sidebar />
        <div
          className={`duration-300 trnasform-[padding] flex flex-grow max-h-full overflow-hidden flex-col ${isSidebarOpen ? "xl:pl-72" : "pl-0"}`}
        >
          <Navbar />
          <Breadcrumbs />

          <main className="flex flex-grow px-4 md:px-8 py-4 overflow-auto flex-col">
            <Outlet />
          </main>
        </div>
      </div>
    ),
    [isSidebarOpen],
  );
}
