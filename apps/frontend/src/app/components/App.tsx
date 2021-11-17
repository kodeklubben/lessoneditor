import Editor from "./editor/Editor";
import Landingpage from "./landingpage/Landingpage";
import Overview from "./frontpage/Overview";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { LessonContextProvider } from "../contexts/LessonContext";
import { UserContextProvider } from "../contexts/UserContext";
import { FileContextProvider } from "../contexts/FileContext";
import SimplePreview from "./simple-preview/simple-preview";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <UserContextProvider>
          <Route exact path="/" component={Overview} />
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
        <Route path="*">
          <h1>PAGE NOT FOUND</h1>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
