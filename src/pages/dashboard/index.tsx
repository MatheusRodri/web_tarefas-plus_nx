import Head from 'next/head'
import styles from './styles.module.css'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { TextArea } from '@/components/textArea'
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'
import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { db } from '@/services/firebaseConnection'
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import Link from 'next/link'


interface HomeProps {
    user: {
        email: string;
    }
}
interface TaskProps {
    id: string;
    created: Date;
    user: string;
    tarefa: string;
    public: boolean;
}

export default function Dashboard({ user }: HomeProps) {

    const [input, setInput] = useState('');
    const [publicTask, setPublicTask] = useState(false);
    const [tasks, setTasks] = useState<TaskProps[]>([]);

    useEffect(() => {
        async function loadTarefas() {
            const tarefasRef = collection(db, "tarefas");
            const q = query(
                tarefasRef,
                orderBy("created", "desc"),
                where("user", "==", user?.email) // Filtra as tarefas do usuário logado
            )
            onSnapshot(q, (snapshot) => {
                let lista = [] as TaskProps[];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        created: doc.data().created,
                        user: doc.data().user,
                        tarefa: doc.data().tarefa,
                        public: doc.data().public
                    })
                })
                setTasks(lista);
            })
        }
        loadTarefas();
    }, [user?.email])

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        console.log(event.target.checked);
        setPublicTask(event.target.checked);
    }

    async function handleRegisterTask(event: FormEvent) {
        event.preventDefault();

        if (input === '') return;

        try {
            await addDoc(collection(db, "tarefas"), {
                tarefa: input,
                created: new Date(),
                user: user?.email,
                public: publicTask
            });
            setInput('');
            setPublicTask(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleShare(id: string) {
       
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/task/${id}`);
        alert('Link copiado com sucesso !');
    }

    async function handleDelete(id: string) {
        const docRef = doc(db, "tarefas", id);
        await deleteDoc(docRef);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}> Qual é sua tarefa? </h1>

                        <form onSubmit={handleRegisterTask}>
                            <TextArea
                                placeholder='Digite sua tarefa aqui...'
                                value={input}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                            />
                            <div className={styles.checkboxArea}>
                                <input
                                    type="checkbox"
                                    id="important"
                                    className={styles.checkbox}
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                />
                                <label>Deixar tarefa publica ?</label>
                            </div>

                            <button type="submit" className={styles.button}>
                                Registrar
                            </button>

                        </form>

                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>

                    {
                        tasks.map((item) => (
                            <article key={item.id} className={styles.task}>
                                {
                                    item.public && (
                                        <div className={styles.tagContainer}>
                                            <label className={styles.tag} >Publico</label>
                                            <button className={styles.shareButton} onClick={() => handleShare(item.id) }>
                                                <FiShare2
                                                    size={22}
                                                    color='#3183ff' />
                                            </button>
                                        </div>
                                    )}

                                <div className={styles.taskContent}>
                                    {
                                    item.public ? (
                                        <Link href={`/task/${item.id}`}>
                                            <p>{item.tarefa}</p>
                                        </Link>
                                    ):(
                                        <p>{item.tarefa}</p>
                                    )}
                                    <button className={styles.trashButton} onClick={() => handleDelete(item.id)}>
                                        <FaTrash size={22} color='#ff4d4d' />
                                    </button>
                                </div>
                            </article>
                        ))
                    }
                </section>
            </main>

        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req })
    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }
    return {
        props: {
            user: {
                email: session?.user?.email,
            }
        },
    }
}