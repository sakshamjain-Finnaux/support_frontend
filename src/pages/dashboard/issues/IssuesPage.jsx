import { Tab } from "@headlessui/react";
export default function IssuesPage({ tabs, name }) {
    return (
        <div className="flex flex-grow w-full flex-col gap-4">
            <div>
                <h2 className="text-2xl font-semibold text-primary-500">{name}</h2>
            </div>
            <Tab.Group>
                <Tab.List as="div" className="flex w-full gap-2 border-body-700 border-b overflow-auto">
                    {tabs.map((tab) => (
                        tab.isVisible && <Tab
                            key={tab.name}
                            className={({ selected }) => (
                                `w-max min-w-max py-2 px-4 text-sm font-medium leading-5 ${selected
                                    ? ' text-primary-500 border-b border-primary-500'
                                    : 'text-body-300 hover:bg-body-700'}`
                            )
                            }
                        >
                            {tab.name}
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels as="div" className="flex flex-grow">

                    {
                        tabs.map(tab => (
                            tab.isVisible && <Tab.Panel key={tab.name} as="div" className="flex flex-grow w-full gap-4 flex-col">
                                {tab.children}
                            </Tab.Panel>
                        ))
                    }

                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}