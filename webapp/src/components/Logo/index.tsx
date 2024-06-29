import styles from "./Logo.module.css";

function Logo() {
  return (
    <a href="#">
      <button className={styles["logo"]}>
        <h3>Sistema de</h3>
        <h2>Atualização de Preços</h2>
      </button>
    </a>
  );
}

export default Logo;
