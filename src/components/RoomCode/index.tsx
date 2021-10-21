import copyImg from '../../assets/images/copy.svg'

import './styles.scss'

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function CopyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className="room-code" onClick={CopyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #-MllR3oBCdyai6Ujx4Z9</span>
        </button>
    )
}