import { Fragment } from "react";
import { BellIcon, MoonIcon, SunIcon } from "../../../assets/Icons/Icons";
import { Transition, Popover, Menu } from "@headlessui/react";
import { SidebarCloseIcon } from "../../../assets/Icons/Icons";
import { SidebarOpenIcon } from "../../../assets/Icons/Icons";
import useDashboard from "../../../contexts/DashboardContext";
import useUI from "../../../contexts/UIContext";
import useAuth from "../../../contexts/AuthContext";
import CustomFloat from "../custom_float/CustomFloat";
import Button from "../button/Button";
export default function Navbar() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboard();
  const { user, signout } = useAuth();
  const { theme, setTheme } = useUI();
  return (
    <header className="w-full">
      <nav className="border-b border-body-800 h-[54px] bg-body-900 px-6 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen((state) => !state)}
          className="text-xl hover:bg-body-800 rounded-lg p-2 active:text-primary-600">
          {isSidebarOpen ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
        </button>
        <div className="flex gap-4 items-center">
          <button
            onClick={() =>
              setTheme((theme) => (theme === "light" ? "dark" : "light"))
            }
            className="text-lg items-center hover:bg-body-800 rounded-lg p-2 active:text-primary-600">
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          <Popover as="div" className="relative inline-block text-left">
            {({ open }) => (
              <>
                <Popover.Button
                  as="button"
                  className={`p-2 hover:bg-body-800 rounded-lg ${open ? "text-primary-600 bg-body-800" : ""}`}>
                  <BellIcon />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <Popover.Panel className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-body-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 h-12 font-semibold flex items-center justify-center text-body-500 select-none">
                      No notifications!
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>

          <Menu as="div" className="relative inline-block text-left">
            {({ open }) => (
              <CustomFloat>
                <Menu.Button
                  title={user.first_name + " " + user.last_name}
                  className="flex items-center justify-center capitalize w-7 h-7 text-sm rounded-full bg-primary-700 font-medium select-none hover:brightness-75 duration-150 transition-filter">
                  {user.first_name[0]}
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <Button variant="red" onClick={signout}>
                    <Menu.Items className="w-32 origin-top-right divide-y divide-body-700 py-1 z-50 text-xs ">
                      Signout
                    </Menu.Items>
                  </Button>
                </Transition>
              </CustomFloat>
            )}
          </Menu>
        </div>
      </nav>
    </header>
  );
}
