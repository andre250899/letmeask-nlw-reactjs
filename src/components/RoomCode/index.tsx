import { ToastContainer, toast } from "react-toastify";

import copyImg from "../../assets/images/copy.svg";

import "./styles.scss";
import "react-toastify/dist/ReactToastify.css";

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code }: RoomCodeProps) {
  const notify = () => toast.success("Código copiado para a área de transferência", {
    autoClose: 2000,
    position: toast.POSITION.TOP_CENTER,
    hideProgressBar: true,
  });

  function CopyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
    notify();
  }

  return (
    <div>
      <button className="room-code" onClick={CopyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt="Copy room code" />
        </div>
        <span>Sala #{code}</span>
      </button>
      <ToastContainer />
    </div>
  );
}