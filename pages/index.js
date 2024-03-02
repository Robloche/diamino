import ClientOnly from "../components/ClientOnly";
import GameStateProvider from "../providers/GameStateProvider";
import GameWrapper from "../components/GameWrapper";
import Head from "next/head";
import { LayoutGroup } from "framer-motion";
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
            <LayoutGroup>
              <GameWrapper />
            </LayoutGroup>
          </ClientOnly>
        </GameStateProvider>
      </SettingsProvider>
    </div>
  );
}
