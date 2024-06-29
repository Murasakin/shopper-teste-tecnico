import styles from "./ErrorModal.module.css";
import CloseIcon from "@mui/icons-material/Close";

function ErrorModal({ error, onClose }: { error: string; onClose: () => void }) {
  return (
    <div className={styles["container"]}>
      <div className={styles["content"]}>
        <div className={styles["title"]}>
          <h3>Alerta</h3>
          <span>
            <CloseIcon style={{ color: "red", cursor: "pointer" }} onClick={onClose} />
          </span>
        </div>
        {error}
      </div>
    </div>
  );
}
export default ErrorModal;
