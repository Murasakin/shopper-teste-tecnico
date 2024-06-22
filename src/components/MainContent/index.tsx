import CsvFileInput from "../CsvFileInput";
import styles from "./MainContent.module.css";

function MainContent() {
  return (
    <main className={`w-100 ${styles["container"]}`}>
      <section>
        <h1>Bem-vind@ ao sistema de atualização de preços!</h1>
      </section>
      <section>
        <CsvFileInput
          CSVHandler={() => {}}
          alertError={(err) => console.log(err)}
        />
      </section>
    </main>
  );
}

export default MainContent;
