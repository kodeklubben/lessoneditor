import React from "react";
import { connect } from "react-redux";
import CPButton from "./components/CPButton";
import ProfileMenu from "../../../ProfileMenu";
import {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  sections,
  code
} from "../../settingsFiles/buttonConfig";

const ControlPanel = props => {
  const handleButtonClick = (
    bTitle,
    output,
    cursorIntON,
    cursorIntOFF,
    endOutput
  ) => {
    if (bTitle === "preview") {
      props.handlePreview(true);
    } else {
      props.handleButtonClick(
        bTitle,
        output,
        cursorIntON,
        cursorIntOFF,
        endOutput
      );
    }
  };

  return (
    <React.Fragment>
      <div className="preview">
        <CPButton
          bTitle="preview"
          icon="eye"
          output=""
          title="Forhåndsvisning"
          cursorIntON=""
          cursorIntOFF=""
          endOutput=""
          onButtonClick={handleButtonClick}
          shortcutKey=""
        />
      </div>
      <div className="row">
        {undoRedo.map(element => (
          <CPButton
            bTitle={element.bTitle}
            icon={element.icon}
            output={element.output}
            title={element.title}
            cursorIntON={element.cursorIntON}
            cursorIntOFF={element.cursorIntOFF}
            endOutput={element.endOutput}
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>

      <div className="row">
        {emphasis.map(element => (
          <CPButton
            bTitle={element.bTitle}
            icon={element.icon}
            output={element.output}
            title={element.title}
            cursorIntON={element.cursorIntON}
            cursorIntOFF={element.cursorIntOFF}
            endOutput={element.endOutput}
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
      <div className="row">
        {lists.map(element => (
          <CPButton
            bTitle={element.bTitle}
            icon={element.icon}
            output={element.output}
            title={element.title}
            cursorIntON={element.cursorIntON}
            cursorIntOFF={element.cursorIntOFF}
            endOutput={element.endOutput}
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
      <div className="row">
        {image.map(element => (
          <CPButton
            bTitle={element.bTitle}
            icon={element.icon}
            output={element.output}
            title={element.title}
            cursorIntON={element.cursorIntON}
            cursorIntOFF={element.cursorIntOFF}
            endOutput={element.endOutput}
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>

      <div id="saveLoad" className="row">
        {saveLoadNew.map(element => (
          <CPButton
            bTitle={element.bTitle}
            icon={element.icon}
            output={element.output}
            title={element.title}
            cursorIntON={element.cursorIntON}
            cursorIntOFF={element.cursorIntOFF}
            endOutput={element.endOutput}
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
      <div className="column">
        <ProfileMenu />
      </div>

      <div id="sections" className="row">
        {sections.map(element => (
          <CPButton
            bTitle={element.bTitle}
            icon={element.icon}
            output={element.output}
            title={element.title}
            cursorIntON={element.cursorIntON}
            cursorIntOFF={element.cursorIntOFF}
            endOutput={element.endOutput}
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
      <div id="code" className="row">
        {code.map(element => (
          <CPButton
            bTitle={element.bTitle}
            icon={element.icon}
            output={element.output}
            title={element.title}
            cursorIntON={element.cursorIntON}
            cursorIntOFF={element.cursorIntOFF}
            endOutput={element.endOutput}
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    imageUrl: state.auth.imageUrl
  };
};

export default connect(mapStateToProps)(ControlPanel);
