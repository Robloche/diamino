import AudioButton from "../AudioButton";
import Image from "next/image";
import Portal from "../Portal";
import React from "react";
import ReactFocusLock from "react-focus-lock";
import closeIcon from "../../assets/x.svg";
import clsx from 'clsx';
import styles from "./Modal.module.css";
import useKeyUp from "../../hooks/use-key-up";

const Modal = ({ canClose = true, children, label, onClose }) => {
  if (canClose) {
    useKeyUp("Escape", onClose);
  }

  return (
    <Portal>
      <ReactFocusLock className={styles.modalWrapper} returnFocus>
        <div
          aria-label={label}
          aria-modal
          className={styles.modal}
          role="dialog"
        >
          {children}
          {canClose && (
            <AudioButton
              className={clsx("action", styles.closeBtn)}
              onClick={onClose}
            >
              <Image alt="Close icon" src={closeIcon} />
            </AudioButton>
          )}
        </div>
      </ReactFocusLock>
    </Portal>
  );
};

export default Modal;
