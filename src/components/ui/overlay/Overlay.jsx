import { Dialog, Transition } from '@headlessui/react'
import { useRef, useEffect } from 'react';
import { CloseIcon } from '../../../assets/Icons/Icons';
import { Fragment } from 'react'


export default function Overlay({ isOverlayVisible, hideOverlay, element, closeOnOutSideClick = true }) {
  const ref = useRef();

  // useEffect(() => {
  //   function func(e) {
  //     console.log(e);
  //     e.key === "Escape" && hideOverlay();
  //   }
  //   document.addEventListener("keydown", func);
  //   return () => {
  //     document.removeEventListener("keydown", func);
  //   }
  // })
  return (
    <>
      <Transition show={isOverlayVisible} as={Fragment}>

        <Dialog
          as="div" className="relative z-50 h-full"
          onClose={() => { closeOnOutSideClick && hideOverlay() }}
        >


          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>



          <div className="fixed inset-0 overflow-y-auto">
            <button type="button" tabIndex={0} className='absolute opacity-0' />

            {!closeOnOutSideClick &&
              <button
                onClick={hideOverlay}
                className='p-1 bg-body-800 text-body-300 text-2xl rounded-full fixed top-3 right-5 hover:brightness-75 duration-150 ring-red-700 ring-offset-1 ring-offset-transparent focus:ring-1 outline-none z-50'>
                <CloseIcon />
              </button>
            }

            <div
              ref={ref}
              onClick={e => {
                if (!closeOnOutSideClick) return
                if (ref.current === e.target) {
                  hideOverlay();
                }
              }}

              className="flex min-h-full items-center justify-center p-4 text-center">

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >

                <Dialog.Panel as="div" className="text-left max-w-full">
                  {element}
                </Dialog.Panel>

              </Transition.Child>
            </div>
          </div>

        </Dialog>
      </Transition>
    </>
  )
}
