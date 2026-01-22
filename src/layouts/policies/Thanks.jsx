import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoveImg from "../../assets/images/love.svg";
import AnimatedPage from "../../components/Animation/Pages";
import styles from "../../styles/Thanks.module.css";

const Thanks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/preview");
    }, 5000);
  }, [navigate]);

  return (
    <AnimatedPage>
      <div className={styles.thanksContainer}>
        <div className={styles.thanksWrapper}>
          <div className={styles.thanksImgWrapper}>
            <img src={LoveImg} alt="Love Icon" />
          </div>
          <h2 className="header2">
            We look forward to helping you with <br /> all your foot and ankl
            needs.
          </h2>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Thanks;
