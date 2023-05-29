import Editor from "./pages/Editor";
import Landingpage from "./pages/Landingpage";
import { FrontPage } from "./pages/Frontpage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LessonContextProvider } from "./contexts/LessonContext";
import { UserContextProvider } from "./contexts/UserContext";
import { FileContextProvider } from "./contexts/FileContext";
import Logout from "./components/shared/Logout";
import SimplePreview from "./components/simple-preview/simple-preview";

export const App = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<FrontPage />} />

          <Route
            path="/landingpage/:lessonId/"
            element={
              <LessonContextProvider>
                <Landingpage />
              </LessonContextProvider>
            }
          />

          <Route
            path="/editor/:lessonId/:file/:lang"
            element={
              <LessonContextProvider>
                <FileContextProvider>
                  <Editor />
                </FileContextProvider>
              </LessonContextProvider>
            }
          />

          <Route
            path="/preview/:lessonId/:file"
            element={
              <LessonContextProvider>
                <FileContextProvider>
                  <SimplePreview />
                </FileContextProvider>
              </LessonContextProvider>
            }
          />

          <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
          <Route path="/logout" element={<Logout></Logout>} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
};
