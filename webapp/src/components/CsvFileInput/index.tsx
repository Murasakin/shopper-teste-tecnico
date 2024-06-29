import { ChangeEvent, MouseEvent, useCallback, useContext, useRef } from "react";
import styles from "./CsvFileInput.module.css";
import { SelectedFileContext } from "../../context/SelectedFileContext";

interface CsvFileInputProps {
  alertError: (errorMsg: string) => void;
}

function CsvFileInput({ alertError }: CsvFileInputProps) {
  const { selectedFile, changeSelectedFile } = useContext(SelectedFileContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) => {
      if (!target.files) {
        alertError("Por favor selecione um arquivo válido!");
        return;
      }
      const file = target.files[0];
      if (!file) {
        alertError("Nenhum arquivo selecionado!");
        return;
      }
      if (!file.name.endsWith(".csv")) {
        alertError("O arquivo deve ter o formato CSV e terminar com extensão .csv!");
        return;
      }
      changeSelectedFile(file);
    },
    [selectedFile, alertError]
  );

  const onSearchFilesClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.click();
      }
    },
    [inputRef]
  );

  return (
    <form>
      <input ref={inputRef} type="file" accept=".csv" className={styles["file-input"]} onChange={onFileChange} />
      <div className={styles["selected-file-wrapper"]}>
        <button className="button" onClick={onSearchFilesClick}>
          {selectedFile ? "Trocar arquivo" : "Procurar CSV..."}
        </button>
      </div>
    </form>
  );
}
export default CsvFileInput;
