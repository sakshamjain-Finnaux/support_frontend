import { Outlet } from "react-router-dom"
import useOnlineStatus from "../hooks/useOnlineStatus"
import { Transition } from "@headlessui/react";
import useUI from "../contexts/UIContext";
import Overlay from "../components/ui/overlay/Overlay";

export default function AppLayout() {
    const isOnline = useOnlineStatus();

    const { closeOverlay, openOverlay, } = useUI();
    return (

        <>
            <div className="min-h-screen flex flex-col bg-body text-text">
                <Outlet />

                <Transition
                    as="div"
                    show={!isOnline}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="text-center w-full fixed bottom-0 text-sm bg-red-900 z-50 text-red-100"
                >
                    You are offline!
                </Transition>

            </div>

            <Overlay isOverlayVisible={openOverlay.open} hideOverlay={closeOverlay} element={openOverlay.children} closeOnOutSideClick={openOverlay.closeOnOutSideClick} />

        </>
    )
}