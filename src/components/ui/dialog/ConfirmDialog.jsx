import React from 'react'
import { Dialog } from '@headlessui/react';
import Button from '../button/Button';

export default function ConfirmDialog({ onClose, onYes, title }) {
    return (
        <div className="w-full xs:w-96 mx-auto transform overflow-hidden rounded-2xl bg-body-800 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-body-400"
            >
                {title}
            </Dialog.Title>
            <div className="mt-2">
                <p className="text-sm text-body-500">
                    Are you sure?
                </p>
            </div>

            <div className="mt-4 flex gap-4 justify-end">
                <Button
                variant='red'
                    onClick={onClose}
                >
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
    )
}