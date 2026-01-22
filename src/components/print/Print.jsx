import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import PrinterImg from "../../assets/images/printer.svg";
import styles from "../../styles/Print.module.css";
import { modules } from "../../utils/Modules";
import BackButton from "../buttons/BackButton";

const Print = ({ title, policyFile }) => {
  const navigate = useNavigate();
  const locations = useLocation();
  const currentPath = locations.pathname;
  const index = modules.findIndex((module) => module.path === currentPath);
  const nextPath = modules[index + 1].path;

  const print = (file) => {
    swal({
      title: "Printing",
      text: `Printing ${title} Policy`,
      icon: "info",
      timer: 1800,
      buttons: false,
    });

    setTimeout(() => {
      const win = window.open(file, "_blank");
      win.focus();
    }, 2000);
  };

  return (
    <div className={styles.printContainer}>
      <div className={styles.printWrapper}>
        <h2 className="header2">Print {title} Policy</h2>
        <h6 className="header6">
          WOULD YOU LIKE A COPY OF THE {title} POLICY?
        </h6>
        <img src={PrinterImg} alt="Printer" />
        <br />
        <div className={styles.btnWrapper}>
          <Button
            id={styles.verifyBtn}
            onClick={() => navigate(nextPath)}
            variant="contained"
            size="medium"
            className="binaryButton"
          >
            No
          </Button>

          <Button
            id={styles.verifyBtn}
            onClick={() => print(policyFile)}
            variant="contained"
            size="medium"
            className="binaryButton"
          >
            Yes
          </Button>
        </div>
        <br />
        <br />
        <BackButton text="Back" url="/" />
      </div>
    </div>
  );
};

export default Print;
