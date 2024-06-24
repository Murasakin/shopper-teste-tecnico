import { ReactElement, createContext, useState } from "react";

interface SelectedFileContextType {
  selectedFile: File | undefined;
  changeSelectedFile: (file: File | undefined) => void;
}

export const SelectedFileContext = createContext<SelectedFileContextType>({
  selectedFile: undefined,
  changeSelectedFile: () => {},
});

function SelectedFileContextProvider({ children }: { children: ReactElement }) {
  const [selectedFile, setSelectedFile] = useState<File>();

  return (
    <SelectedFileContext.Provider value={{ selectedFile, changeSelectedFile: (file) => setSelectedFile(file) }}>
      {children}
    </SelectedFileContext.Provider>
  );
}

export default SelectedFileContextProvider;
