// import "./filelist.scss";
// import { useLessonContext } from "../../contexts/LessonContext";
// import fetchMdText from "../../api/fetch-md-text";
// import { Button, Container, Icon, Image, Item } from "semantic-ui-react";
// import { useState, useEffect } from "react";
// import { MdPreviewModal, ImageModal } from "./Modals";

// import { filenameParser } from "../../utils/filename-parser";
// import { useParams } from "react-router";
// import { useHistory } from "react-router-dom";

// const FileList = () => {
//   const history = useHistory();
//   const { lessonId } = useParams<{ lessonId: string }>();
//   const { lessonFiles, lessonData } = useLessonContext();

//   const [mdTexts, setMdTexts] = useState<Record<string, string>>({});

//   const previewUrl = lessonFiles.filter((items) => items.filename === "preview.png")[0].url;

//   useEffect(() => {
//     async function fetchMd() {
//       lessonFiles
//         .filter((item) => item.filename.split(".").pop()?.toLowerCase() === "md")
//         .forEach(async (item) => {
//           const file = item.filename.slice(0, item.filename.length - 3);
//           const { language } = filenameParser(file);
//           const result = await fetchMdText(lessonId, file);
//           const separator = "---\n";
//           const [_, __, body] = result.split(separator);
//           setMdTexts((prevState) => ({ ...prevState, [language]: body }));
//         });
//     }
//     fetchMd();
//   }, []);

//   const mediaExtensions = ["gif", "png", "jpg", "jpeg", "md"];

//   const filteredLessonFiles = lessonFiles.filter(
//     (items) =>
//       items.filename !== "data.json" &&
//       items.filename !== "lesson.yml" &&
//       items.filename !== "preview.png"
//   );

//   const navigateToEditor = (filename: string) => {
//     const target = ["/editor", lessonId, filename].join("/");
//     history.push(target);
//   };

//   return (
//     <>
//       <Container style={{ marginTop: "1em" }}>
//         <Item.Group divided>
//           {filteredLessonFiles.map((item) => {
//             const mdFile = item.filename.slice(0, item.filename.length - 3);
//             const { language } = filenameParser(mdFile);
//             return (
//               <Item key={item.filename}>
//                 {mediaExtensions.includes(item.filename.split(".").pop()?.toLowerCase() || "")
//                   ? item.filename.split(".").pop()?.toLowerCase() === "md"
//                     ? MdPreviewModal(
//                         language,
//                         lessonData.course,
//                         mdTexts[language],
//                         <Item.Image
//                           className="filelist-modalimage"
//                           size="tiny"
//                           src={`${previewUrl}?${performance.now()}`}
//                         />
//                       )
//                     : ImageModal(
//                         item.url,
//                         <Item.Image className="filelist-modalimage" size="tiny" src={item.url} />
//                       )
//                   : ""}

//                 <Item.Content verticalAlign="middle">
//                   <Item.Header>{item.filename}</Item.Header>
//                   <Item.Meta>{`${Math.round(item.size / 1000)} kb`}</Item.Meta>
//                   <Item.Extra>
//                     <Button.Group floated="right">
//                       {item.filename.slice(-3) === ".md" ? (
//                         <>
//                           <Button
//                             onClick={() => {
//                               navigateToEditor(item.filename.slice(0, item.filename.length - 3));
//                             }}
//                             color="green"
//                             icon
//                             labelPosition="left"
//                           >
//                             {" Redigere "}
//                             <Icon name="pencil" />
//                           </Button>
//                         </>
//                       ) : (
//                         ""
//                       )}
//                       <Button style={{ background: "none" }} icon floated="right">
//                         <Icon name="delete" />
//                         Slett
//                       </Button>
//                     </Button.Group>
//                   </Item.Extra>
//                 </Item.Content>
//               </Item>
//             );
//           })}
//         </Item.Group>
//       </Container>
//     </>
//   );
// };

// export default FileList;
