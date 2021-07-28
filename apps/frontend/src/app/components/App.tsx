import Editor from "./editor/Editor";
import Landingpage from "./landingpage/Landingpage";
import Frontpage from "./frontpage/Frontpage";
import { BrowserRouter, Route } from "react-router-dom";
import { LessonContextProvider } from "../contexts/LessonContext";
import { UserContextProvider } from "../contexts/UserContext";
import { FileContextProvider } from "../contexts/FileContext";
import SimplePreview from "./simple-preview/simple-preview";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Route exact path="/" component={Frontpage} />
          <Route exact path="/landingpage" component={Landingpage} />
          <Route exact path="/landingpage/:lessonId/:mode">
            <LessonContextProvider>
              <Landingpage />
            </LessonContextProvider>
          </Route>
          <Route exact path="/editor" component={Editor} />
          <Route path="/editor/:lessonId/:file">
            <LessonContextProvider>
              <FileContextProvider>
                <Editor />
              </FileContextProvider>
            </LessonContextProvider>
          </Route>
          <Route exact path="/preview/:lessonId/:file">
            <FileContextProvider>
              <SimplePreview />
            </FileContextProvider>
          </Route>
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
