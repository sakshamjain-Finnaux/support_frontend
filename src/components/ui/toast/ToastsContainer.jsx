import React from 'react'
import Toast from './Toast';

const ToastsContainer = ({ toasts }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col-reverse gap-3 z-[51] fixed top-4 right-4">
      {toasts.map((toast) => (

        <Toast key={toast.id} {...toast} />

      ))}

    </div>
  );
};

export default ToastsContainer;