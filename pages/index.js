import Game from "../components/Game";
import Head from "next/head";
import Header from '../components/Header';
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>💎Diamino💎</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*<Header />*/}

      <Game />
    </div>
  );
}
