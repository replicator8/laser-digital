import { createPortal } from "react-dom";
import "./Modal.css";
import { useRef, useEffect } from "react";

export default function Modal({ children, open }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <>
      {open && <div className="modal-overlay" />}

      <dialog ref={dialog} className="modal-dialog">
        {children}
      </dialog>
    </>,
    document.getElementById("modal")
  );
}
