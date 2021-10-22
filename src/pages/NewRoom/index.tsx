import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';

import { Button } from '../../components/Button';
import { database } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

import '../../styles/auth.scss';
import 'react-toastify/dist/ReactToastify.min.css';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        const toastProps = {
            pauseOnFocusLoss: false,
            autoClose: 1000,
            position: toast.POSITION.TOP_CENTER
        }

        if (newRoom.trim() === '') {
            toast.warn("O nome da sala não pode estar vazio!", {
                ...toastProps,
                autoClose: 3000,
                hideProgressBar: true
            })
            return
        }

        const roomRef = database.ref('rooms')

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })

        const notify = () => toast.success("Sala Criada com sucesso!", {
            ...toastProps,
            onClose: () => history.push(`/rooms/${firebaseRoom.key}`)
          });

        notify()
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask logo" draggable="false"/>
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text"
                        placeholder="Nome da sala"
                        onChange={event => setNewRoom(event.target.value)}
                        value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
            <ToastContainer/>
        </div>
    )
}