import { NavLink } from "react-router-dom";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "react-headless-accordion";
import {
  ArchiveIcon,
  ClientsIcon,
  EmployeesIcon,
  ClipboardIcon,
  GearIcon,
  DashboardIcon,
  ArrowIcon,
  TaskIcon,
} from "../../../assets/Icons/Icons";
import useAuth from "../../../contexts/AuthContext";
import useDashboard from "../../../contexts/DashboardContext";
import { SignOutIcon } from "../../../assets/Icons/Icons";
import { Button } from "../button/Button";
import { SidebarCloseIcon } from "../../../assets/Icons/Icons";
import { Transition } from "@headlessui/react";
import PERMISSIONS from "../../../permissions";
import { useMemo } from "react";

const NavLinkClassname =
  "w-full hover:text-primary-300 duration-150 flex items-center py-2 px-2 rounded-lg gap-4";
export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboard();
  const { hasPermission } = useAuth();
  const { signout } = useAuth();
  const navlinks = [
    {
      icon: <DashboardIcon className="inline text-xl" />,
      name: "Dashboard",
      to: "/",
    },
    {
      icon: <ClipboardIcon className="inline text-xl" />,
      name: "Issues",
      to: "/issues",
    },
    {
      icon: <TaskIcon className="inline text-xl" />,
      name: "My Tasks",
      to: "/myTasks",
    },
    {
      icon: <EmployeesIcon className="inline text-xl" />,
      name: "Employees",
      to: "/employees",
    },
    // { icon: <ClientsIcon className="inline text-xl" />, name: "Clients", to: "/clients" },
    // { icon: <GearIcon className="inline text-xl" />, name: "Settings", to: "/settings" },
  ];
  return useMemo(
    () => (
      <>
        <aside
          className={`bg-body-940 w-72 z-20 fixed overflow-auto h-[calc(100vh_-_0px)] flex gap-6 border-r border-body-800 items-center flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-72"}`}>
          {/*  */}
          <div className="text-3xl flex items-center border-body-800 text-primary-500 font-semibold font-center border-b w-full px-4 min-h-[54px] tracking-wide justify-between">
            <span>Finnaux</span>
            <button
              onClick={setIsSidebarOpen.bind(null, false)}
              className="text-xl text-body-300 xl:hidden hover:text-primary-600">
              <SidebarCloseIcon className="" />
            </button>
          </div>
          <div className="px-4 pb-4 flex flex-col gap-6 items-center w-full h-full">
            <Accordion
              as="nav"
              className="flex flex-col gap-3 text-body-400 font-medium text-base w-full items-center">
              {navlinks.map((navlink, index) => {
                if (navlink.name === "Issues") {
                  return (
                    <AccordionItem key={navlink.name}>
                      {({ open }) => (
                        <div
                          className={`p-2 w-full rounded-lg ${open ? "bg-body-800 bg-opacity-60" : ""}`}>
                          <AccordionHeader
                            as="div"
                            className="w-full hover:text-primary-300 duration-150 flex items-center rounded-lg gap-4 cursor-pointer">
                            {navlink.icon}
                            {navlink.name}
                            <ArrowIcon
                              className={`inline ml-auto text-2xl ${open ? "" : "rotate-180"}`}
                            />
                          </AccordionHeader>

                          <AccordionBody>
                            <div className="text-sm w-full pl-8 space-y-2 p-1 mt-1">
                              {hasPermission(
                                PERMISSIONS.can_access_clients_issues,
                              ) && (
                                <NavLink
                                  to={"/clientissues"}
                                  className={({ isActive }) =>
                                    (isActive
                                      ? "bg-body-800 text-primary-400 "
                                      : "") +
                                    " hover:text-primary-300 block px-2 rounded-lg py-2"
                                  }>
                                  {/* {navlink.icon} */}
                                  Client Issues
                                </NavLink>
                              )}

                              <NavLink
                                to={"/companyissues"}
                                className={({ isActive }) =>
                                  (isActive
                                    ? "bg-body-800 text-primary-400 "
                                    : "") +
                                  " hover:text-primary-300 block px-2 rounded-lg py-2"
                                }>
                                {/* {navlink.icon} */}
                                Company Issues
                              </NavLink>

                              <NavLink
                                to={"/myissues"}
                                className={({ isActive }) =>
                                  (isActive
                                    ? "bg-body-800 text-primary-400 "
                                    : "") +
                                  " hover:text-primary-300 block px-2 rounded-lg py-2"
                                }>
                                {/* {navlink.icon} */}
                                My Issues
                              </NavLink>
                            </div>
                          </AccordionBody>
                        </div>
                      )}
                    </AccordionItem>
                  );
                }

                if (
                  navlink.name === "Clients" &&
                  !hasPermission(PERMISSIONS.can_access_clients)
                )
                  return null;
                if (
                  navlink.name === "Employees" &&
                  !hasPermission(PERMISSIONS.can_access_employees)
                )
                  return null;

                return (
                  <NavLink
                    key={navlink.name}
                    to={navlink.to}
                    className={({ isActive }) =>
                      (isActive ? "bg-body-800 text-primary-400 " : "") +
                      NavLinkClassname
                    }>
                    {navlink.icon}
                    {navlink.name}
                  </NavLink>
                );
              })}
            </Accordion>

            <div className="w-full mt-auto">
              <Button variant="red" onClick={signout} className="w-full  !py-2">
                Signout
                <SignOutIcon className="inline text-xl" />
              </Button>
            </div>
          </div>
        </aside>

        <Transition
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={isSidebarOpen}>
          <div
            onClick={setIsSidebarOpen.bind(null, false)}
            className="md:hidden w-screen h-screen fixed bg-black bg-opacity-80 z-10"></div>
        </Transition>
      </>
    ),
    [isSidebarOpen],
  );
}
