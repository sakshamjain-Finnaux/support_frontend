import { Float } from "@headlessui-float/react";

export default function CustomFloat({ children, ...rest }) {
  return (
    <Float
      enter="transition duration-200 ease-out"
      enterFrom="scale-95 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="transition duration-150 ease-in"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-95 opacity-0"
      strategy="fixed"
      offset={6}
      placement="bottom-end"
      flip
      tailwindcssOriginClass
      {...rest}
    >
      {children}
    </Float>
  );
}
