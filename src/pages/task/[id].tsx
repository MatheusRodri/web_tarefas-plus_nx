import Head from "next/head";
import styles from './styles.module.css'
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { db } from '../../services/firebaseConnection'
import { doc, collection, where, query, getDoc,addDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { TextArea } from "@/components/textArea";
import { FaTrash } from "react-icons/fa";


interface TaskProps {
    item: {
        tarefa: string;
        public: boolean;
        created: string;
        user: string;
        taskId: string;
    };
    allComments: CommentsProps[];
}

interface CommentsProps{
    id: string;
    comment: string;
    user: string;
    name: string;
    taskId: string;
}



export default function Task({item,allComments}: TaskProps) {

    const {data: session} = useSession();
    const [input,setInput] = useState('');
    const [comments,setComments] = useState<CommentsProps[]>(allComments || []);

    async function handleComment(event:FormEvent){
        event.preventDefault();
        
        if(input === ''){
            alert('Preencha o campo antes de enviar seu comentário');
            return;
        }
        if(!session?.user?.email || !session?.user?.name){
            alert('Você precisa estar logado para comentar');
            return;
        }

        try{
            const docRef = await addDoc(collection(db,"comments"),{
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            })
            const data = {
                id: docRef.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            }



            setComments((oldItems)=>[...oldItems,data]);
            setInput('');
        }catch(err){
            console.log(err);
            alert('Erro ao enviar comentário');
        }
    }


    async function handleDeleteComment(id:string){
        try{
           const docRef = doc(db,"comments",id);
           await deleteDoc(docRef);
           
            const deleteComment = comments.filter((item)=>item.id !== id);
            setComments(deleteComment);

        }catch(err){
            console.log(err);
            alert('Erro ao deletar comentário');
        }
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da Tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>

                <article className={styles.task}>
                    <p>{item.tarefa}</p>
                    
                </article>

            </main>

            <section className={styles.commentsContainer}>
                <h2>Deixar comentário</h2>

                <form onSubmit={handleComment}>
                    <TextArea  
                    placeholder="Digite seu comentário"
                    value={input}
                    onChange={(e:ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                    />
                    <button disabled={!session?.user} type="submit" className={styles.button} >Enviar comentário</button>
                </form>
            </section>

            <section className={styles.commentsContainer}>
                <h2>Todos os comentários</h2>
                {comments.length === 0 && (<span>Nenhum comentário encontrado</span>)}

                {comments.map((item)=>(
                    <article key={item.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>{item.name}</label>

                            {
                                item.user === session?.user?.email && (
                                    <button className={styles.buttonTrash} onClick={()=>handleDeleteComment(item.id)}>
                                        <FaTrash size={18} color="#EA3140" />
                                    </button>
                                )

                            }
                        </div>
                        <p>{item.comment}</p>
                    </article>
                ))}
            </section>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const id = params?.id as string;
    const docRef = doc(db, "tarefas", id);
    const snapshot = await getDoc(docRef);

    const queryComments = query(collection(db, "comments"), where("taskId", "==", id));
    const snapshotComments = await getDocs(queryComments);

    let allComments: CommentsProps[] = [];
    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            comment: doc.data().comment,
            user: doc.data().user,
            name: doc.data().name,
            taskId: doc.data().taskId
        });
    });

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    if(!snapshot.data()?.public){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const milliseconds = snapshot.data()?.created?.seconds * 1000;
    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(milliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id
    }


    return {
        props: {
            item: task,
            allComments: allComments,
        }
    }
}