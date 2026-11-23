import Editor from "./pages/Editor";
import Landingpage from "./pages/Landingpage";
import Overview from "./pages/Frontpage";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import { LessonContextProvider } from "./contexts/LessonContext";
import { UserContextProvider } from "./contexts/UserContext";
import { FileContextProvider } from "./contexts/FileContext";
import Logout from "./components/shared/Logout";
import SimplePreview from "./components/simple-preview/simple-preview";
import ImportLesson from "./pages/ImportLesson";
import NotFound from "./pages/NotFound";

/**
 * A fresh editor for every text: switching to another language (the text switcher) unmounts the
 * old one, so its last changes are saved to its own file before the next text is read.
 */
const EditorForText = () => {
  const { file, lang } = useParams();
  return (
    <FileContextProvider key={`${file}/${lang}`}>
      <Editor />
    </FileContextProvider>
  );
};

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
                <EditorForText />
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
          // Also with the text's name after it, as in the lesson page's own address.
          path="/rediger/:course/:lesson/*"
          element={
            <UserContextProvider>
              <ImportLesson />
            </UserContextProvider>
          }
        />
        <Route path="/logout" element={<Logout></Logout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
