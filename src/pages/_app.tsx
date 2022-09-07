import Header from '../components/Header';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { AppProps } from 'next/app';
import { MobilePlayer } from '../components/MobilePlayer';
import { useBreakpoint } from '../services/use-breakpoints';

function MyApp({ Component, pageProps }: AppProps) {
  const breakpoint = useBreakpoint();

  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        {breakpoint <= 1420 ? <MobilePlayer /> : <Player />}
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp;
