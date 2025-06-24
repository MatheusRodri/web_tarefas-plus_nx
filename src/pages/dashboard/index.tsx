import Head from 'next/head'
import styles from './styles.module.css'

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel</title>
            </Head>

            <h1 className={styles.title}>Bem-vindo ao seu painel!</h1>
        </div>
    )
}