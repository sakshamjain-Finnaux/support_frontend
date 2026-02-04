import React from "react";
import { DialogTitle } from "@/components/ui/dialog";
import Button from "../button/Button";

export default function ConfirmDialog({ onClose, onYes, title }) {
  return (
    <div className="w-full text-left">
      <DialogTitle className="text-lg font-medium leading-6 text-body-400">
        {title}
      </DialogTitle>
      <div className="mt-2">
        <p className="text-sm text-body-500">Are you sure?</p>
      </div>

      <div className="mt-4 flex gap-4 justify-end">
        <Button variant="red" onClick={onClose}>
          No
        </Button>

        <Button
          onClick={() => {
            onYes();
            onClose();
          }}
        >
          Yes
        </Button>
      </div>
    </div>
  );
}
