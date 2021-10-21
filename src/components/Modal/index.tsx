import './styles.scss'

type ModalProps = {
  
  img?: string,
  title?: string,
  subtitle?: string,
  cancelEvent?: any,
  confirmEvent?: any,
  textConfirmButton?: string,
}

export function Modal({cancelEvent, confirmEvent, ...props}: ModalProps) {

  return (
    <div className="modal">
      <div className="container">
        <img src={props.img} alt="" />
        <h2>{props.title}</h2>
        <p>{props.subtitle}</p>
        <div className="buttons">
          <button onClick={cancelEvent} id="cancel-button">
            Cancelar
          </button>
          <button onClick={confirmEvent} id="delete-button">
            {props.textConfirmButton}
          </button>
        </div>
      </div>
    </div>
  )
}