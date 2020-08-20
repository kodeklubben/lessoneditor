import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import { LessonContext } from "contexts/LessonContext";
import { Dropdown } from "semantic-ui-react";

const languageOptions = [
  {
    key: 1,
    text: "Bokmål",
    value: "nb",
    image: { avatar: true, src: "/languagesFlag/flag_nb.svg" },
  },
  {
    key: 2,
    text: "Nynorsk",
    value: "nn",
    image: { avatar: true, src: "/languagesFlag/flag_nn.svg" },
  },
  {
    key: 3,
    text: "Engelsk",
    value: "en",
    image: { avatar: true, src: "/languagesFlag/flag_en.svg" },
  },
  {
    key: 4,
    text: "Islandsk",
    value: "is",
    image: { avatar: true, src: "/languagesFlag/flag_is.svg" },
  },
];

const Languages = () => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const lessonContext = useContext(LessonContext);
  const { data, setLanguage } = lessonContext;

  const defaultValue = (file) => {
    let returnvalue;
    if (file.slice(-2) === "nn") {
      returnvalue = "nn";
    } else if (file.slice(-2) === "en") {
      returnvalue = "en";
    } else if (file.slice(-2) === "is") {
      returnvalue = "is";
    } else {
      returnvalue = "nb";
    }
    return returnvalue;
  };

  const handleChange = async (event, { value }) => {
    setLanguage(value);
    let target;
    if (lessonId && file && value !== "nb") {
      target = ["/editor", lessonId, (await data.lesson) + "_" + value].join(
        "/"
      );
    } else if (lessonId && file) {
      target = ["/editor", lessonId, await data.lesson].join("/");
    }
    history.push(target);
  };
  return (
    <div>
      <Dropdown
        style={{
          width: "13em",
          position: "relative",
          top: "-0.7em",
          left: "-2em",
        }}
        placeholder="Velg Språk"
        name="language"
        defaultValue={file ? defaultValue(file) : ""}
        fluid
        selection
        onChange={handleChange}
        options={languageOptions}
      />
    </div>
  );
};

export default Languages;
