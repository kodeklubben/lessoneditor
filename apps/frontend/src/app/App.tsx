import Editor from "./pages/Editor";
import Landingpage from "./pages/Landingpage";
import Overview from "./pages/Frontpage";
import { BrowserRouter, Route, Routes } from "react-router";
import { LessonContextProvider } from "./contexts/LessonContext";
import { UserContextProvider } from "./contexts/UserContext";
import { FileContextProvider } from "./contexts/FileContext";
import Logout from "./components/shared/Logout";
import SimplePreview from "./components/simple-preview/simple-preview";
import ImportLesson from "./pages/ImportLesson";

const App = () => {
  return (
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
          path="/landingpage/:lessonId/"
          element={
            <UserContextProvider>
              <LessonContextProvider>
                <Landingpage />
              </LessonContextProvider>
            </UserContextProvider>
          }
        />

        <Route
          path="/editor/:lessonId/:file/:lang"
          element={
            <UserContextProvider>
              <LessonContextProvider>
                <FileContextProvider>
                  <Editor />
                </FileContextProvider>
              </LessonContextProvider>
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
              </LessonContextProvider>
            </UserContextProvider>
          }
        />
        <Route
          path="/rediger/:course/:lesson"
          element={
            <UserContextProvider>
              <ImportLesson />
            </UserContextProvider>
          }
        />
        <Route path="/logout" element={<Logout></Logout>} />
        <Route path="*" element={<h1>Fant ikke siden</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
