import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/home.module.css";

import heroImg from "../../public/assets/hero.png"



export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>

      <main className={styles.main}>

        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo do Tarefas+"
            src={heroImg}
            priority
          />
        </div>

        <h1 className={styles.title}>
          Sistema feito para você organizar <br/> suas tarefas e estudos
        </h1>

        
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+12 posts</span>
          </section>

          <section className={styles.box}>
            <span>+90 comentário</span>
          </section>

        </div>
      </main>
    </div>
  );
}
