import { Tab } from "@headlessui/react";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function IssuesPage({ tabs, name, onTabChange }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleTabs, setVisibleTabs] = useState([]);

  // Filter visible tabs and set initial state
  useEffect(() => {
    const filteredTabs = tabs.filter((tab) => tab.isVisible);
    setVisibleTabs(filteredTabs);

    // If current selected tab is no longer visible, reset to first visible tab
    if (visibleTabs.length > 0 && selectedIndex >= visibleTabs.length) {
      setSelectedIndex(0);
      if (onTabChange && visibleTabs[0]) {
        onTabChange(visibleTabs[0]);
      }
    }
  }, [tabs, selectedIndex, onTabChange]);

  const handleTabChange = (index) => {
    setSelectedIndex(index);
    if (onTabChange && visibleTabs[index]) {
      onTabChange(visibleTabs[index]);
    }
  };

  return (
    <div className="flex flex-grow w-full flex-col gap-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-body-900 dark:text-body-100">
            {name}
          </h2>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
        <div className="relative">
          {/* Scroll buttons for mobile */}
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-10 md:hidden">
            <button
              onClick={() => {
                const container = document.querySelector(".tab-container");
                if (container) container.scrollLeft -= 100;
              }}
              className="h-full px-2 bg-gradient-to-r from-body-50/90 to-transparent dark:from-body-900/90 flex items-center">
              <ChevronLeft className="w-4 h-4 text-body-400" />
            </button>
          </div>

          <Tab.List
            as="div"
            className="tab-container flex w-full gap-1 overflow-x-auto scrollbar-hide pb-1 relative"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {visibleTabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) => `
                  relative flex-shrink-0 py-3 px-5 mx-2 mt-2 text-sm font-medium transition-all duration-200
                  rounded-lg  focus:outline-none focus:ring-2 focus:ring-primary-500/20
                  ${
                    selected
                      ? "text-primary-500 dark:text-primary-400 border-primary-500 dark:border-primary-400 bg-primary-50/30 dark:bg-primary-900/20"
                      : "text-body-500 dark:text-body-400 border-transparent hover:text-body-700 dark:hover:text-body-300 hover:border-body-300 dark:hover:border-body-600 hover:bg-red-100/50 dark:hover:bg-body-800/50"
                  }
                `}>
                <div className="flex items-center gap-2">
                  {tab.icon && (
                    <tab.icon
                      className={`w-4 h-4 ${selectedIndex === index ? "text-primary-500 dark:text-primary-400" : "text-body-400"}`}
                    />
                  )}
                  <span className="whitespace-nowrap">{tab.name}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`
                      min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-medium
                      ${
                        selectedIndex === index
                          ? "bg-primary-500 dark:bg-primary-400 text-white"
                          : "bg-body-200 dark:bg-body-700 text-body-600 dark:text-body-400"
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}
                </div>

                {/* Active indicator animation */}
                {selectedIndex === index && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-primary-500 dark:bg-primary-400 rounded-full" />
                )}
              </Tab>
            ))}
          </Tab.List>
          <div className="absolute right-0 top-0 bottom-0 flex items-center z-10 md:hidden">
            <button
              onClick={() => {
                const container = document.querySelector(".tab-container");
                if (container) container.scrollLeft += 100;
              }}
              className="h-full px-2 bg-gradient-to-l from-body-50/90 to-transparent dark:from-body-900/90 flex items-center">
              <ChevronRight className="w-4 h-4 text-body-400" />
            </button>
          </div>
          <Separator className="bg-body-700 " />
        </div>

        {/* Tab Panels */}
        <Tab.Panels as="div" className="flex flex-grow">
          {visibleTabs.map((tab, index) => (
            <Tab.Panel
              key={tab.name}
              as="div"
              className={`
                flex flex-grow w-full gap-4 flex-col transition-opacity duration-200
                ${selectedIndex === index ? "opacity-100" : "opacity-0 absolute"}
              `}
              unmount={false} // Keep tabs mounted for better performance
            >
              {/* Optional tab header with description */}
              {tab.description && (
                <div className="mb-4 p-4 bg-body-50 dark:bg-body-800/50 rounded-lg border border-body-200 dark:border-body-700">
                  <p className="text-sm text-body-600 dark:text-body-400">
                    {tab.description}
                  </p>
                </div>
              )}

              {/* Tab content */}
              <div className="flex flex-grow">{tab.children}</div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
