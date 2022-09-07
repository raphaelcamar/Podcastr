import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import 'rc-slider/assets/index.css';
import { SliderPlayer } from '../SliderPlayer';
import { PlayerActions } from '../PlayerActions';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    setPlayingState,
    playNext,
    clearPlayerState,
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    hasNext,
    isLooping,
  } = usePlayer();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;

      audioRef.current.addEventListener('timeupdate', () => {
        setProgress(Math.floor(audioRef?.current?.currentTime));
      });
    }
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <Image src="/playing.svg" alt="Tocando agora" width={32} height={32} />
        <strong>Tocando agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image alt="episode image" width={592} height={592} src={episode?.thumbnail} objectFit={'cover'} />
          <strong>{episode?.title}</strong>
          <span>{episode?.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <SliderPlayer episode={episode} handleSeek={handleSeek} progress={progress} />

        {episode && (
          <audio
            src={episode?.url}
            autoPlay
            ref={audioRef}
            onPlay={() => {
              setPlayingState(true);
            }}
            onPause={() => {
              setPlayingState(false);
            }}
            loop={isLooping}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.wrapper}>
          <PlayerActions />
        </div>
      </footer>
    </div>
  );
}
