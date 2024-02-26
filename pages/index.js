import ClientOnly from "../components/ClientOnly";
import Game from "../components/Game";
import GameStateProvider from '../providers/GameStateProvider';
import Head from "next/head";
import SettingsProvider from "../providers/SettingsProvider";
import { enableMapSet } from "immer";
import styles from "../styles/Home.module.css";

enableMapSet();

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>💎Diamino💎</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*<Header />*/}

      <SettingsProvider>
        <GameStateProvider>
          <ClientOnly>
            <Game />
          </ClientOnly>
        </GameStateProvider>
      </SettingsProvider>
    </div>
  );
}
