import "./checkboxfield.scss";
import { FC, ReactNode } from "react";

interface CheckboxFieldProps {
  labelTitle: string;
  content: ReactNode;
}

const CheckboxField: FC<CheckboxFieldProps> = ({ labelTitle, content }) => {
  return (
    <div className={"checkboxfield__container " + labelTitle}>
      <h3>{labelTitle}</h3>
      <div>{content}</div>
    </div>
  );
};

export default CheckboxField;
