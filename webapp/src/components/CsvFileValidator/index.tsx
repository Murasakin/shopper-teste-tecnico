import { MouseEvent, useCallback, useContext } from "react";
import ValidationService from "../../service/Validation.service";
import { SelectedFileContext } from "../../context/SelectedFileContext";

function CsvFileValidator() {
  const { selectedFile } = useContext(SelectedFileContext);

  const onValidateClick = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (selectedFile) {
      const data = await ValidationService.validateCsvFileData(selectedFile);
      console.log(data);
    }
  }, []);

  return (
    <form>
      <h3>Valide os dados do arquivo CSV:</h3>
      <button className="button" onClick={onValidateClick}>
        Validar CSV
      </button>
    </form>
  );
}

export default CsvFileValidator;
