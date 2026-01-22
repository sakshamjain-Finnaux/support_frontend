import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import useAuth from "./contexts/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { DashboardProvider } from "./contexts/DashboardContext";

import NotFound from "./pages/not_found/NotFound";
import SignIn from "./pages/signin/SignIn";

//Dashboard pages start
import Home from "./pages/dashboard/home/Home";
import MyIssues from "./pages/dashboard/issues/my_issues/MyIssues";
import MyTasks from "./pages/dashboard/tasks/MyTasks";
// import Settings from "./pages/dashboard/settings/Settings";
import Employees from "./pages/dashboard/employees/Employees";
import ClientsIssues from "./pages/dashboard/issues/clients_issues/ClientsIssues";
import CompanyIssues from "./pages/dashboard/issues/company_issues/CompanyIssues";
import AddEmployee from "./pages/dashboard/employees/AddEmployee";
// import Clients from "./pages/dashboard/clients/Clients";
// import AddClient from "./pages/dashboard/clients/AddClient";
import PERMISSIONS from "./permissions";
import EditEmployee from "./pages/dashboard/employees/EditEmployee";

//dashboard pages end
export default function App() {
  const { user, hasPermission } = useAuth();
  const router = useMemo(() => createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/signin",
          element: (
            <ProtectedLayout isAuthorized={!user} redirectTo="/" >
              <SignIn />
            </ProtectedLayout>
          ),
        },

        {
          path: "/",
          element: (
            <ProtectedLayout isAuthorized={user} redirectTo="/signin">
              <DashboardProvider>
                <DashboardLayout />
              </DashboardProvider>
            </ProtectedLayout>
          ),
          children: [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "/clientissues",
              element:
                <ProtectedLayout
                  isAuthorized={hasPermission(PERMISSIONS.can_access_clients_issues)}
                  redirectTo="/notfound"
                >
                  <ClientsIssues />
                </ProtectedLayout>
              ,
            },
            {
              path: "/companyissues",
              element: <CompanyIssues />,
            },
            {
              path: "/myissues",
              element: <MyIssues />,
            },
            {
              path: "/mytasks",
              element: <MyTasks />
            },
            {
              path: "/employees",
              element: (
                <ProtectedLayout
                  isAuthorized={hasPermission(PERMISSIONS.can_access_employees)}
                  redirectTo="/notfound"
                />),

              children: [
                {
                  path: "",
                  element: <Employees />,
                },
                {
                  path: "add",
                  element: <AddEmployee />,
                },
                {
                  path: "edit/:emp_id",
                  element: < EditEmployee />
                }
              ]
            },

            // {
            //   path: "/clients",
            //   element: (
            //     <ProtectedLayout
            //       isAuthorized={hasPermission(PERMISSIONS.can_access_clients)}
            //       redirectTo="/notfound"
            //     />
            //   ),

            //   children: [
            //     {
            //       path: "",
            //       element: <Clients />,
            //     },
            //     {
            //       path: "add",
            //       element: <AddClient />,
            //     },
            //   ]
            // },
          ]
        },
      ]
    }
  ]), [user]
  )
  return (
    < RouterProvider router={router} />
  )
}