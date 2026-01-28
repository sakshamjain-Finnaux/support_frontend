import useAuth from "../../../contexts/AuthContext";
import PERMISSIONS from "../../../permissions";
import MyPendingTasks from "./MyPendingTasks";
import MyAssignedTasks from "./MyAssignedTasks";
import MyRevertedTasks from "./MyRevertedTasks";
import { Tab } from "@headlessui/react";
export default function MyTasks() {
  const { hasPermission } = useAuth();
  const tabs = [
    {
      name: "Pending",
      children: <MyPendingTasks />,
      isVisible: true,
    },
    {
      name: "Assigned",
      children: <MyAssignedTasks />,
      isVisible: hasPermission(PERMISSIONS.can_assign),
    },
    {
      name: "Reverted",
      children: <MyRevertedTasks />,
      isVisible: hasPermission(PERMISSIONS.can_assign),
    },
  ];
  return (
    <div className="flex flex-grow w-full flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-primary-500">My Tasks</h2>
      </div>
      <Tab.Group>
        <Tab.List
          as="div"
          className="flex w-full gap-4 border-body-700 border-b overflow-auto"
        >
          {tabs.map(
            (tab) =>
              tab.isVisible && (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `w-max min-w-max py-2 px-4 text-sm font-medium leading-5 ${
                      selected
                        ? " text-primary-500 border-b border-primary-500"
                        : "text-body-300 hover:bg-white/[0.12] hover:text-white"
                    }`
                  }
                >
                  {tab.name}
                </Tab>
              ),
          )}
        </Tab.List>

        <Tab.Panels as="div" className="flex flex-grow">
          {tabs.map(
            (tab) =>
              tab.isVisible && (
                <Tab.Panel
                  key={tab.name}
                  as="div"
                  className="flex flex-grow w-full gap-4 flex-col"
                >
                  {tab.children}
                </Tab.Panel>
              ),
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
