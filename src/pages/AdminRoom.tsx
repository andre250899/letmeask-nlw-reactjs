import { useState } from 'react'
import { useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { Modal } from "../components/Modal";

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
// import { useAuth } from '../hooks/useAuth';

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import cautionImg from '../assets/images/delete-modal.svg'

import "../styles/room.scss";
import "../styles/question.scss";
import '../styles/modal.scss'

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const {user} = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false)
  // const [isRoomModalVisible, setIsRoomModalVisible] = useState(false)
  const [questionId, setQuestionId] =  useState('')

  function openModal(questionId: string) {
    setQuestionId(questionId)
    return setIsQuestionModalVisible(true)
  }

  function handleCancelDeleteQuestion() {
    return setIsQuestionModalVisible(false)
  }

  async function handleConfirmDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    return setIsQuestionModalVisible(false)
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask logo" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined>Encerrar sala</Button>
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
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                className="delete-button"
                type="button"
                aria-label="Deletar pergunta"
                onClick={(e) => openModal(question.id)}>
                    <img src={deleteImg} alt="" />
                </button>
              </Question>
            );
          })}
        </div>
        {isQuestionModalVisible ? <Modal
        img={cautionImg}
        title={'Excluir Pergunta'}
        subtitle={'Tem certeza que você deseja excluir essa pergunta?'} 
        cancelEvent={handleCancelDeleteQuestion}
        confirmEvent={() => handleConfirmDeleteQuestion(questionId)}
        /> : null}
      </main>
    </div>
  );
}
