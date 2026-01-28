import React from "react";
import IssueForm from "./IssueForm";
import useCreateIssue from "../../../hooks/useCreateIssue";

export default function CreateIssue({ networkRequest }) {
  const addIssue = useCreateIssue(networkRequest);
  return (
    <div className="w-[30rem] max-w-full">
      <IssueForm formType={"create"} submitMutation={addIssue} />
    </div>
  );
}
