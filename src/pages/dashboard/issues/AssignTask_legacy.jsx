import { Tab } from "@headlessui/react";
import AssignForm from "./AssignForm";
import IssueTimeLineView from "./IssueTimeLineView";
const tabs = ["View", "Assign"];
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../../components/ui/spinner/Spinner";

export default function AssignTask({ networkRequest, issueId }) {
  const assignFieldsQuery = useQuery({
    queryFn: getFields,
    queryKey: ["issues", String(issueId), "assign"],
    staleTime: 0,
  });

  async function getFields() {
    const result = await networkRequest("get_assign_fields", issueId);
    if (!result.success) throw result;
    return result.data;
  }

  if (assignFieldsQuery.isLoading) return <Spinner />;

  if (assignFieldsQuery.isError) {
    return (
      <div>
        <p className="text-body-400 text-center  text-xl">There was an error</p>
      </div>
    );
  }

  return (
    <div className="w-[40rem] max-w-full bg-body-940 rounded-lg">
      <Tab.Group>
        <Tab.List
          as="div"
          className="top-0 left-0 z-[1] bg-inherit flex w-full border-body-700 border-b-2 rounded-t-lg overflow-hidden sticky">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-body-800 text-primary-500 shadow border-b border-primary-500"
                    : "text-body-300 hover:bg-white/[0.12] hover:text-white"
                }`
              }>
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="text-sm">
          <Tab.Panel>
            <IssueTimeLineView
              resolveButton={assignFieldsQuery.data.resolve}
              showRemark={true}
              networkRequest={networkRequest}
              issueId={issueId}
            />
          </Tab.Panel>

          <Tab.Panel>
            <AssignForm
              show={assignFieldsQuery.data}
              networkRequest={networkRequest}
              issueId={issueId}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
