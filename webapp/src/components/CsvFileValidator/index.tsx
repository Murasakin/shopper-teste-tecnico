import { MouseEvent, useCallback, useContext } from "react";
import { SelectedFileContext } from "../../context/SelectedFileContext";

interface CsvFileValidatorProps {
  onValidate: () => void;
}

function CsvFileValidator({ onValidate }: CsvFileValidatorProps) {
  const { selectedFile } = useContext(SelectedFileContext);
  const onValidateClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      onValidate();
    },
    [selectedFile]
  );

  return (
    <form>
      <button className="button" onClick={onValidateClick}>
        Validar CSV
      </button>
    </form>
  );
}

export default CsvFileValidator;
