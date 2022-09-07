import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { PlayerActions } from '../PlayerActions';
import { SliderPlayer } from '../SliderPlayer';
import { TextEllipsis } from '../TextEllipsis';
import styles from './styles.module.scss';

export function MobilePlayer() {
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
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
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
    <aside className={styles.mobilePlayerContainer}>
      <div className={styles.wrapperinformations}>
        {episode ? (
          <>
            <Image alt="episode image" width={100} height={100} src={episode?.thumbnail} objectFit={'cover'} />
            <TextEllipsis>{episode?.title}</TextEllipsis>
          </>
        ) : (
          <Image alt="headset" width={50} height={50} src={'/headset-base.svg'} objectFit={'cover'} />
        )}
      </div>

      <div className={styles.player}>
        <SliderPlayer episode={episode} handleSeek={handleSeek} progress={progress} />
        {episode && (
          <audio
            src={episode.url}
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
      </div>
      <div className={styles.playerActions}>
        <PlayerActions />
      </div>
    </aside>
  );
}
