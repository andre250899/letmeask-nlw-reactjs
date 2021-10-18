type ModalProps = {
  img?: any,
  title?: string,
  subtitle?: string,
  cancelEvent?: any,
  confirmEvent?: any,
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
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  )
}