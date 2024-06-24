import { useContext } from "react";
import CsvFileInput from "../CsvFileInput";
import styles from "./MainContent.module.css";
import { SelectedFileContext } from "../../context/SelectedFileContext";
import CsvFileValidator from "../CsvFileValidator";

function MainContent() {
  const { selectedFile } = useContext(SelectedFileContext);

  return (
    <main className={`w-100 ${styles["container"]}`}>
      <section>
        <h1>Bem-vind@ ao sistema de atualização de preços!</h1>
      </section>
      <section className={styles["action-section"]}>
        <CsvFileInput alertError={(err) => console.log(err)} />
        {selectedFile && <CsvFileValidator />}
      </section>
    </main>
  );
}

export default MainContent;
