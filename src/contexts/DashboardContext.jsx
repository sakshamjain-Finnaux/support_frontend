import { useContext, createContext, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <DashboardContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </DashboardContext.Provider>
  );
}

export default function useDashboard() {
  return useContext(DashboardContext);
}
