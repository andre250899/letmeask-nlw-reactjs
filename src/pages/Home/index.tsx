import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { database } from "../../services/firebase";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import googleIconImg from "../../assets/images/google-icon.svg";
import loginImg from "../../assets/images/log-in.svg";

import { Button } from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";

import "../../styles/auth.scss";
import "react-toastify/dist/ReactToastify.css";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    const notifyProps = {
      autoClose: 2000,
      position: toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
    };

    const notifyEmptyInput = () =>
      toast.warn("O código da sala não pode estar vazio!", notifyProps);
    const notifyNotExists = () => toast.error("Sala inexistente!", notifyProps);
    const notifyEndedRoom = () =>
      toast.error("A sala foi encerrada por um administrador!", notifyProps);

    if (roomCode.trim() === "") {
      notifyEmptyInput();
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      notifyNotExists();
      return;
    }

    if (roomRef.val().endedAt) {
      notifyEndedRoom();
      return;
    }

    history.push(`rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask logo" draggable="false" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              <span>
                <img src={loginImg} alt="Símbolo de entrar" />
                Entrar na sala
              </span>
            </Button>
          </form>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
