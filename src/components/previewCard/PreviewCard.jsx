import EditIcon from "../../assets/icons/icons8-edit.svg";
import { Link } from "react-router-dom";
import styles from "../../styles/PreviewCard.module.css";

const PreviewCard = ({ icon, title, text, info, url }) => {
  return (
    <div className={styles.PreviewCardWrapper}>
      <div className={styles.PreviewCardHeader}>
        <img src={icon} alt="icon" />
        <h6 className="header6">{title}</h6>
        <Link
          to={{
            pathname: url,
          }}
          state={{ edit: true }}
          className={styles.PreviewCardEditIcon}
        >
          <img src={EditIcon} alt="edit" />
        </Link>
      </div>
      <div className={styles.PreviewCardBody}>
        <small>{text}</small>
        <div className={styles.list}>
          {info.map((i, index) => {
            return <strong key={index}>{i}</strong>;
          })}
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
