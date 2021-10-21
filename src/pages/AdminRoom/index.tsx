import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Question } from "../../components/Question";
import { Modal } from "../../components/Modal";

import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";
// import { useAuth } from '../hooks/useAuth';

import logoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";
import trashImg from "../../assets/images/delete-modal.svg";
import dangerImg from "../../assets/images/danger.svg";
import answerImg from "../../assets/images/answer.svg";
import checkImg from "../../assets/images/check.svg";

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
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false)
  const [questionId, setQuestionId] = useState("");

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
      return setIsQuestionModalVisible(false);
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
        database.ref(`rooms/${roomId}`).update({
          endedAt: new Date(),
        });

        setIsRoomModalVisible(false)
        return history.push("/");
    },
  }

  function handleCheckQuestionIsAnswered(questionId : string) { 
    database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  function handleCheckQuestionIsHighlighted(questionId : string) {
    database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask logo" />
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
              <div key={question.id} className={question.isHighlighted ? 'highlighted' : 'not-highlighted'}>
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
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button
                    className="highlited-button"
                    type="button"
                    aria-label="Marcar como lida"
                    onClick={() => handleCheckQuestionIsHighlighted(question.id)}
                  >
                    <img src={answerImg} alt="Marcar pergunta como lida" />
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    aria-label="Deletar pergunta"
                    onClick={() => questionDeleteModal.openModal(question.id)}
                  >
                    <img src={deleteImg} alt="" />
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
      </main>
    </div>
  );
}
