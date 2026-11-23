import { FC, ReactNode } from "react";
import { Icon } from "semantic-ui-react";

/** Semantic UI's own error red, 7:1 on white; the forms used "red", #9f3a38 and italics at random. */
export const ERROR_COLOR = "#9f3a38";

/**
 * One look for a message under a form field or in a dialog: what is wrong and how to fix it.
 * Renders a fixed-height spacer when there is nothing to say, so the dialog does not jump.
 */
const FieldError: FC<{ children?: ReactNode }> = ({ children }) =>
  children ? (
    <p
      role="alert"
      style={{ color: ERROR_COLOR, margin: "0.4em 0 0", lineHeight: 1.35, minHeight: "1.35em" }}
    >
      <Icon name="exclamation circle" aria-hidden="true" />
      {children}
    </p>
  ) : (
    <p aria-hidden="true" style={{ margin: "0.4em 0 0", minHeight: "1.35em" }} />
  );

export default FieldError;
