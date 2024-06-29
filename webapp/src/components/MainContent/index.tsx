import { useCallback, useContext, useEffect, useState } from "react";
import CsvFileInput from "../CsvFileInput";
import styles from "./MainContent.module.css";
import { SelectedFileContext } from "../../context/SelectedFileContext";
import CsvFileValidator from "../CsvFileValidator";
import { ValidationResultStruct } from "../../interface";
import Helper from "../../helper";
import ValidationService from "../../service/Validation.service";
import PriceAdjustmentSummary from "../PriceAdjustmentSummary";
import UpdateService from "../../service/Update.service";
import ErrorModal from "../ErrorModal";
import CloseIcon from "@mui/icons-material/Close";

function MainContent() {
  const [validationResult, setValidationResult] = useState<ValidationResultStruct>();
  const [errorMsg, setErrorMsg] = useState<string>();

  const { selectedFile, changeSelectedFile } = useContext(SelectedFileContext);

  const handleValidate = useCallback(async () => {
    if (selectedFile) {
      const parsed = await Helper.parseCSV(selectedFile);
      const data = await ValidationService.validateCsvFileData(parsed);
      setValidationResult(data);
    }
  }, [selectedFile]);

  const handleUpdate = useCallback(async () => {
    if (validationResult?.updateId) {
      try {
        await UpdateService.updatePrices(validationResult?.updateId);

        changeSelectedFile(undefined);
        setValidationResult(undefined);
      } catch (err: any) {
        console.log(err);
      }
    }
  }, [validationResult]);

  useEffect(() => {
    setValidationResult(undefined);
  }, [selectedFile]);

  return (
    <main className={`w-100 ${styles["container"]}`}>
      <h1>Bem-vind@ ao sistema de atualização de preços!</h1>
      <section className={styles["action-section"]}>
        <CsvFileInput alertError={(err) => setErrorMsg(err)} />
        {selectedFile && <CsvFileValidator onValidate={handleValidate} />}
        {validationResult?.updateId && (
          <button
            className={`button ${styles["update-button"]}`}
            onClick={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            Atualizar
          </button>
        )}
      </section>
      {selectedFile && (
        <section className={styles["filename"]}>
          <p>Arquivo selecionado: </p>
          <span>{selectedFile.name}</span>
          <CloseIcon style={{ color: "red", cursor: "pointer" }} onClick={() => changeSelectedFile(undefined)} />
        </section>
      )}

      {validationResult && <PriceAdjustmentSummary summary={validationResult} />}
      {errorMsg && <ErrorModal error={errorMsg} onClose={() => setErrorMsg(undefined)} />}
    </main>
  );
}

export default MainContent;
