import "./App.css";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import SelectedFileContextProvider from "./context/SelectedFileContext";

function App() {
  return (
    <>
      <Header />
      <SelectedFileContextProvider>
        <MainContent />
      </SelectedFileContextProvider>
    </>
  );
}

export default App;
