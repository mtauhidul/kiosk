import { IconButton } from "@mui/material";
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import CloseIcon from "../../assets/icons/close.svg";
import styles from "../../styles/ESignature.module.css";
import { modules } from "../../utils/Modules";
import BackButton from "../buttons/BackButton";
import PrimaryButton from "../buttons/PrimaryButton";

const ESignature = ({ handleSubmit, title, url, policyFile }) => {
  const locations = useLocation();
  const currentPath = locations.pathname;
  const index = modules.findIndex((module) => module.path === currentPath);
  const nextPath = modules[index + 1].path;
  const previousPath = modules[index - 1].path;
  const sigCanvas = useRef({});

  const save = () =>
    handleSubmit({
      signature: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"),
    });

  const clear = () => sigCanvas.current.clear();

  return (
    <div className={styles.ESignatureContainer}>
      <div className={styles.ESignatureWrapper}>
        <h2 className="header2">{title} Policy</h2>
        <br />
        {/* <Link to={policyFile} target="_blank" download>
          Read {title} Policy
        </Link> */}
        <br />
        <h6 className="header6">
          Please sign below to agree the terms and conditions of {title} Policy.
        </h6>
        <div className={styles.canvasWrapper}>
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{ width: 750, height: 280, className: "sigCanvas" }}
          />
          <IconButton
            onClick={() => clear()}
            className={styles.iconButton}
            aria-label="delete"
          >
            <img src={CloseIcon} alt="Close" />
          </IconButton>
        </div>
        <div className={styles.btnWrapper}>
          <PrimaryButton
            handleSubmit={save}
            data=""
            text="Confirm & Continue"
            url={nextPath}
          />
          <BackButton text="Back" url={previousPath} />
        </div>
      </div>
    </div>
  );
};

export default ESignature;
