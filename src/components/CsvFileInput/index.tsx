import { ChangeEvent, MouseEvent, useCallback, useRef, useState } from "react";
import styles from "./CsvFileInput.module.css";
import Helper from "../../helper";
import { ParsedCSVStruct } from "../../interface";

interface CsvFileInputProps {
  CSVHandler: (data: ParsedCSVStruct) => void;
  alertError: (errorMsg: string) => void;
}

function CsvFileInput({ CSVHandler, alertError }: CsvFileInputProps) {
  const [selectedFile, setSelectedFile] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  const alertErrorProxy = useCallback(
    (errorMsg: string) => {
      if (selectedFile) {
        setSelectedFile(undefined);
      }
      alertError(errorMsg);
    },
    [alertError]
  );

  const onFileChange = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) => {
      if (!target.files) {
        alertErrorProxy("Por favor selecione um arquivo válido!");
        return;
      }
      const file = target.files[0];
      if (!file) {
        alertErrorProxy("Nenhum arquivo selecionado!");
        return;
      }
      if (!file.name.endsWith(".csv")) {
        alertErrorProxy("O arquivo deve ter o formato CSV e terminar com extensão .csv!");
        return;
      }
      setSelectedFile(file);
      try {
        const result = await Helper.csvParser(file);
        CSVHandler(result);
      } catch (e: any) {
        alertErrorProxy(e);
      }
    },
    [CSVHandler, alertErrorProxy]
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
    <form className={styles["container"]}>
      <h3>Selecione o arquivo CSV:</h3>
      <input ref={inputRef} type="file" accept=".csv" className={styles["file-input"]} onChange={onFileChange} />
      <div className={styles["selected-file-wrapper"]}>
        <button className="button" onClick={onSearchFilesClick}>
          {selectedFile ? "Trocar arquivo..." : "Procurar..."}
        </button>
        <p>{selectedFile ? selectedFile.name : ""}</p>
      </div>
    </form>
  );
}
export default CsvFileInput;
