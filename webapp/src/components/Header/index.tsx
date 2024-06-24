import Logo from "../Logo";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={`flex w-100 ${styles["container"]}`}>
      <div className={`w-100 flex justify--space-between ${styles["wrapper"]}`}>
        <Logo />
        <nav className={styles["navigation"]}>
          <ul className={`flex justify--end gap-4 w-100`}>
            <li>
              <a href="#">
                Histórico <i>(em breve)</i>
              </a>
            </li>
            <li>
              <a href="#">
                Sobre <i>(em breve)</i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
