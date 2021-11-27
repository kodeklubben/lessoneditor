import Editor from "./editor/Editor";
import Landingpage from "./landingpage/Landingpage";
import Overview from "./frontpage/Overview";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LessonContextProvider } from "../contexts/LessonContext";
import { UserContextProvider } from "../contexts/UserContext";
import { FileContextProvider } from "../contexts/FileContext";
import SimplePreview from "./simple-preview/simple-preview";
import Dummy from "./Dummy";

const App = () => {
  return (
    // <Dummy />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserContextProvider>
              <Overview />
            </UserContextProvider>
          }
        />

        <Route
          path="/landingpage"
          element={
            <UserContextProvider>
              <Landingpage />
            </UserContextProvider>
          }
        />

        <Route
          path="/landingpage/:lessonId/:mode"
          element={
            <UserContextProvider>
              <LessonContextProvider>
                <Landingpage />
              </LessonContextProvider>
            </UserContextProvider>
          }
        />

        <Route
          path="/editor"
          element={
            <UserContextProvider>
              <Editor />
            </UserContextProvider>
          }
        />

        <Route
          path="/editor/:lessonId/:file/*"
          element={
            <UserContextProvider>
              <LessonContextProvider>
                <FileContextProvider>
                  <Editor />
                </FileContextProvider>
              </LessonContextProvider>{" "}
            </UserContextProvider>
          }
        />

        <Route
          path="/preview/:lessonId/:file"
          element={
            <UserContextProvider>
              <LessonContextProvider>
                <FileContextProvider>
                  <SimplePreview />
                </FileContextProvider>
              </LessonContextProvider>{" "}
            </UserContextProvider>
          }
        />

        <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
