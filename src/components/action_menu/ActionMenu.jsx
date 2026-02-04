import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import CustomFloat from "../ui/custom_float/CustomFloat";
import { ThreeDotsIcon } from "../../assets/Icons/Icons";

export default function ActionMenu({ children }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <CustomFloat>
          <Menu.Button
            as="button"
            className={`p-2 hover:bg-body-800 rounded-lg ${open ? "text-primary-600 bg-body-800" : ""}`}
          >
            <ThreeDotsIcon />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="w-40 origin-top-right divide-y divide-body-700 py-1 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-body-940 z-50 text-xs border border-body-800">
              {children.length ? (
                children.map((child, index) => (
                  <Menu.Item
                    key={index}
                    as={child.type}
                    {...child.props}
                    className={`w-full py-2 cursor-pointer font-semibold flex items-center justify-center text-body-500 hover:bg-body-800 ${child.props.className ? child.props.className : ""}`}
                  >
                    {child.props.children}
                  </Menu.Item>
                ))
              ) : (
                <Menu.Item
                  as={children.type}
                  {...children.props}
                  className={`w-full py-2 cursor-pointer font-semibold flex items-center justify-center text-body-500 hover:bg-body-800 ${children.props.className ? children.props.className : ""}`}
                >
                  {children.props.children}
                </Menu.Item>
              )}
            </Menu.Items>
          </Transition>
        </CustomFloat>
      )}
    </Menu>
  );
}
