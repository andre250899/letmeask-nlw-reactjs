import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast} from "react-toastify"

import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Question } from "../../components/Question";
import { Modal } from "../../components/Modal";

import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import logoImg from "../../assets/images/logo.svg";
import trashImg from "../../assets/images/delete-modal.svg";
import dangerImg from "../../assets/images/danger.svg";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const {user} = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [questionId, setQuestionId] = useState("");

  const notifyProps = {
    autoClose: 2000,
    position: toast.POSITION.TOP_CENTER,
    hideProgressBar: true
  }

  const questionDeleteModal = {
    openModal(questionId: string) {
      setQuestionId(questionId);
      return setIsQuestionModalVisible(true);
    },

    handleCancelDeleteQuestion() {
      return setIsQuestionModalVisible(false);
    },

    async handleConfirmDeleteQuestion(questionId: string) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      setIsQuestionModalVisible(false);
      toast.success("Pergunta deletada com sucesso!", notifyProps);
    },
  };

  const roomTerminateModal = {
    openModal() {
      return setIsRoomModalVisible(true);
    },

    handleCancelTerminateRoom() {
      return setIsRoomModalVisible(false);
    },

    async handleConfirmTerminateRoom() {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });

      setIsRoomModalVisible(false);

      toast.success("Sala encerrada com sucesso!", {
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER,
        onClose: () => history.push('/')
      });
    },
  };

  function handleCheckQuestionIsAnswered(questionId: string) {
    database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  function handleCheckQuestionIsHighlighted(questionId: string) {
    database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask logo" />
          </Link>
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={roomTerminateModal.openModal}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length === 1 ? (
            <span>{questions.length} pergunta</span>
          ) : (
            <span>{questions.length} perguntas</span>
          )}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <div
                key={question.id}
                className={
                  question.isHighlighted ? "highlighted" : "not-highlighted"
                }
              >
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isHighlighted={question.isHighlighted}
                  isAnswered={question.isAnswered}
                >
                  <button
                    className="answered-button"
                    type="button"
                    aria-label="Marcar como respondida"
                    onClick={() => handleCheckQuestionIsAnswered(question.id)}
                  >
                    <svg
                      id="check-svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12.0003"
                        cy="11.9998"
                        r="9.00375"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="highlited-button"
                    type="button"
                    aria-label="Marcar como lida"
                    onClick={() =>
                      handleCheckQuestionIsHighlighted(question.id)
                    }
                  >
                    <svg
                      id="highlight-svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    aria-label="Deletar pergunta"
                    onClick={() => questionDeleteModal.openModal(question.id)}
                  >
                    <svg
                      id="delete-svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 5.99988H5H21"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Question>
              </div>
            );
          })}
        </div>
        {isQuestionModalVisible ? (
          <Modal
            img={trashImg}
            title={"Excluir Pergunta"}
            subtitle={"Tem certeza que você deseja excluir essa pergunta?"}
            textConfirmButton={"Sim, excluir"}
            cancelEvent={questionDeleteModal.handleCancelDeleteQuestion}
            confirmEvent={() =>
              questionDeleteModal.handleConfirmDeleteQuestion(questionId)
            }
          />
        ) : null}
        {isRoomModalVisible ? (
          <Modal
            img={dangerImg}
            title={"Encerrar sala"}
            subtitle={"Tem certeza que você deseja encerrar essa sala?"}
            textConfirmButton={"Sim, encerrar"}
            cancelEvent={roomTerminateModal.handleCancelTerminateRoom}
            confirmEvent={roomTerminateModal.handleConfirmTerminateRoom}
          />
        ) : null}
      <ToastContainer/>
      </main>
    </div>
  );
}
