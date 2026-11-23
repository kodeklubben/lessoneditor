import "./viewtoggle.scss";
import { FC } from "react";
import { Icon } from "semantic-ui-react";
import { ViewMode } from "../../utils/useViewMode";

/** Two buttons, «Kort» and «Liste»; the chosen one is pressed. */
const ViewToggle: FC<{ mode: ViewMode; onChange: (mode: ViewMode) => void }> = ({
  mode,
  onChange,
}) => (
  <div className="view-toggle" role="group" aria-label="Vis som">
    <button
      type="button"
      aria-pressed={mode === "cards"}
      onClick={() => onChange("cards")}
      title="Vis som kort"
    >
      <Icon name="grid layout" />
      Kort
    </button>
    <button
      type="button"
      aria-pressed={mode === "list"}
      onClick={() => onChange("list")}
      title="Vis som liste"
    >
      <Icon name="list" />
      Liste
    </button>
  </div>
);

export default ViewToggle;
