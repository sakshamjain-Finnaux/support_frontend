import { useEffect } from "react";
import Spinner from "./Spinner";
import FocusTrap from "focus-trap-react";
export default function FullScreenSpinner() {
  useEffect(() => {
    document.body.setAttribute("style", "min-height: 100vh; overflow: hidden");
    return function () {
      document.body.setAttribute("style", "");
    };
  }, []);
  return (
    <FocusTrap>
      <div
        tabIndex={1}
        className="bg-black bg-opacity-70 fixed top-0 left-0 h-screen w-screen z-50 flex items-center justify-center overflow-auto"
      >
        <input type="text" className="opacity-0 absolute w-0 h-0" />
        <Spinner />
      </div>
    </FocusTrap>
  );
}
