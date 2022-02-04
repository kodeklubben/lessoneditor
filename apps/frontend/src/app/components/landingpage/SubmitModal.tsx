import { Button, Modal, Header } from "semantic-ui-react";
import { FC, useState } from "react";

import { paths } from "@lessoneditor/contracts";
import axios from "axios";

const SubmitModal: FC<any> = ({ openSubmitModal, setOpenSubmitModal, lessonId }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (lessonId: string) => {
    try {
      setLoading(true);
      await axios.post(paths.LESSON_SUBMIT.replace(":lessonId", lessonId));
      setIsSubmitted(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onClose = () => {
    setIsSubmitted(false);
    setLoading(false);
    setOpenSubmitModal(false);
  };

  const submitted = () => {
    return (
      <>
        <Modal.Header>Takk for ditt bidrag!</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Oppgaven er sendt inn til kodeklubben KidsaKoder</Header>
            <p>Din oppgave vil bli gjennomgått av kidsakoder før den publiseres.</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content="Ok"
            labelPosition="right"
            icon="checkmark"
            onClick={() => onClose()}
            positive
          />
        </Modal.Actions>
      </>
    );
  };

  return (
    <>
      <Modal
        onClose={() => onClose()}
        onOpen={() => setOpenSubmitModal(true)}
        open={openSubmitModal}
        trigger={<Button>Show Modal</Button>}
        closeOnDimmerClick={!loading}
        dimmer={"inverted"}
      >
        {isSubmitted ? (
          submitted()
        ) : (
          <>
            <Modal.Header>Sende inn oppgave</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>Sende inn oppgave til Kodeklubben KidsaKoder?</Header>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <>
                <Button disabled={loading} color="black" onClick={() => setOpenSubmitModal(false)}>
                  Nei
                </Button>
                <Button
                  content="Ja"
                  labelPosition="right"
                  icon="checkmark"
                  onClick={() => onSubmit(lessonId)}
                  positive
                  loading={loading}
                />
              </>
            </Modal.Actions>
          </>
        )}
      </Modal>
    </>
  );
};

export default SubmitModal;

// return (
//   <div
//     style={{
//       position: "absolute",
//       top: "0%",
//       left: "0%",
//       zIndex: 1,
//       width: "100%",
//       height: "100%",
//       backgroundColor: "rgb(256,256,256,0.7)",
//     }}
//   >
//     <div
//       style={{
//         borderRadius: "20px",
//         boxShadow: "0px 0px  10px",
//         zIndex: 2,
//         margin: "auto",
//         marginTop: "10%",
//         padding: "5% 7% 0%",
//         width: "50%",
//         height: "40%",
//         backgroundColor: "white",
//       }}
//     >
//       <h1>Vil du sende oppgavefiler til Github?</h1>

//       <div style={{ marginTop: "5em" }}>
//         <div style={{ float: "left", marginRight: "auto" }}>
//           <Button onClick={() => onSubmit(lessonId)} content="Sende inn" />
//         </div>
//         <div style={{ float: "right", marginLeft: "auto" }}>
//           <Button
//             icon="x"
//             style={{ background: "none" }}
//             onClick={() => setAreYouSure(false)}
//             content="Avbryt"
//           />
//         </div>
//       </div>
//     </div>
//   </div>
// );
