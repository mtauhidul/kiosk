import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WaitImg from "../../assets/images/wait.svg";
import AnimatedPage from "../../components/Animation/Pages";
import BackButton from "../../components/buttons/BackButton";
import styles from "../../styles/PrintTicket.module.css";

const PrintTicket = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/kiosk/collect_ticket");
    }, 5000);
  }, [navigate]);

  return (
    <AnimatedPage>
      <div className={styles.PrintTicketContainer}>
        <div className={styles.PrintTicketWrapper}>
          <h2 className="header2">Please Wait</h2>
          <h6 className="header6">
            YOUR ENCOUNTER TICKET FOR YOUR VISIT IS NOW PRINTING
          </h6>
          <br />
          <img src={WaitImg} alt="Wait" />
          <div className={styles.backBtnContainer}>
            <BackButton text="Back to Home" url="/" />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PrintTicket;
