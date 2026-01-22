import { createContext, useContext, useMemo, useReducer, useState, useRef } from "react";
import ToastsContainer from "../components/ui/toast/ToastsContainer";
import { toastReducer } from "../reducers/toastReducer";
import { Transition } from "@headlessui/react";
import FullScreenSpinner from "../components/ui/spinner/FullScreenSpinner";
import ConfirmDialog from "../components/ui/dialog/ConfirmDialog";
import { Portal } from "@headlessui/react";
import { useLocalStorage } from "../hooks/useLocalStorage";
const UIContext = createContext();
const initialState = {
    toasts: []
}
export function UIProvider({ children }) {

    const [state, dispatch] = useReducer(toastReducer, initialState);
    const [showFullSpinner, setShowFullSpinner] = useState(false);
    const [theme, setTheme] = useLocalStorage("theme", 'dark');


    if (theme === 'dark') {
        document.body.classList.add('dark');
    }

    else {
        document.body.classList.remove('dark');
    }

    const [openOverlay, setOpenOverlay] = useState({
        open: false,
        childern: null,
    });

    function showInOverlay(child, closeOnOutSideClick = true) {
        setOpenOverlay({
            open: true,
            children: child,
            closeOnOutSideClick,
        });
    }

    function closeOverlay() {
        setOpenOverlay({
            open: false,
            children: null
        });
    }

    function showConfirmDialog(title, func) {
        const element = <ConfirmDialog onClose={closeOverlay} title={title} onYes={func} />;
        showInOverlay(element);
    }


    const addToast = (type, message) => {
        const id = Math.floor(Math.random() * 10000000);
        dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
    }
    const toast = useMemo(() => ({

        success: (message) => {
            addToast("success", message);
        },

        warning: (message) => {
            addToast("warning", message);
        },

        info: (message) => {
            addToast("info", message);
        },

        error: (message) => {
            addToast("error", message);
        },

        remove: (id) => {
            dispatch({ type: "DELETE_TOAST", payload: id });
        }
    }), []);


    const value = useMemo(() => (
        {
            toast,
            setShowFullSpinner,
            showConfirmDialog,
            showInOverlay,
            closeOverlay,
            openOverlay,
            theme,
            setTheme
        }
    ), [theme, openOverlay]);

    return (
        <UIContext.Provider value={value}>
            <Portal>
                <ToastsContainer toasts={state.toasts} />
            </Portal>

            <Transition
                show={showFullSpinner}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <FullScreenSpinner />
            </Transition>


            {children}

        </UIContext.Provider>
    );
}

export default function useUI() {
    return useContext(UIContext);
}