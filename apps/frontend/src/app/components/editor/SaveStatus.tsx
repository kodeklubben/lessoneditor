import { FC } from "react";
import { AutosaveStatus } from "../../utils/autosave";

const MESSAGES: Record<AutosaveStatus, string> = {
  idle: "",
  dirty: "Endringer lagres snart",
  saving: "Lagrer …",
  saved: "Lagret",
  error: "Kunne ikke lagre. Prøver igjen om litt.",
};

/** Announced politely to screen readers; errors stay visible until a save succeeds. */
const SaveStatus: FC<{ status: AutosaveStatus }> = ({ status }) => (
  <p
    className={`save-status save-status--${status}`}
    role="status"
    aria-live="polite"
    style={status === "error" ? { color: "#9f3a38" } : undefined}
  >
    {MESSAGES[status]}
  </p>
);

export default SaveStatus;
