/* eslint-disable no-unused-vars */
import Image from 'next/image';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';

export function PlayerActions() {
  const {
    togglePlay,
    playNext,
    playPrevious,
    toggleLoop,
    toggleShuffle,
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffling,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.buttons}>
      <button
        type="button"
        disabled={!episode || episodeList.length === 1}
        onClick={toggleShuffle}
        className={isShuffling ? styles.isActive : ''}
      >
        <Image width={24} height={24} src="/shuffle.svg" alt="Embaralhar" />
      </button>
      <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
        <Image width={24} height={24} src="/play-previous.svg" alt="Tocar anterior" />
      </button>
      <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
        {isPlaying ? (
          <Image width={24} height={24} src="/pause.svg" alt="Pausar" />
        ) : (
          <Image width={24} height={24} src="/play.svg" alt="Tocar" />
        )}
      </button>
      <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
        <Image width={24} height={24} src="/play-next.svg" alt="Tocar Próxima" />
      </button>
      <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
        <Image width={24} height={24} src="/repeat.svg" alt="Repetir" />
      </button>
    </div>
  );
}
