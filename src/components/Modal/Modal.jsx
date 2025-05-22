import { createPortal } from "react-dom";
import "./Modal.css";
import { useRef, useEffect } from "react";

export default function Modal({ children, open, isArchive, isAdmin }) {
  const dialog = useRef();
  let name = "";
  if (isAdmin) {
    name = "modal-admin-dialog";
  } else if (isArchive) {
    name = "modal-dialog-arc";
  } else {
    name = "modal-dialog";
  }

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

      <dialog ref={dialog} className={name}>
        {children}
      </dialog>
    </>,
    document.getElementById("modal")
  );
}
