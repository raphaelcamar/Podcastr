import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convetDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    toggleLoop,
    toggleShuffle,
    clearPlayerState,
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffling,
  } = usePlayer();

  const[progress, setProgress] = useState(0);

  useEffect(() =>{
    if(!audioRef.current){
      return;
    }

    if(isPlaying){
      audioRef.current.play();
    }else{
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext();
    }else{
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>
      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit={'cover'}
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convetDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{backgroundColor: '#04D361'}}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{borderColor: '#04D361', borderWidth: 4}}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convetDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio 
            src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() =>{setPlayingState(true)}}
            onPause={() =>{setPlayingState(false)}}
            loop={isLooping}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            {isPlaying
            ? <img src="/pause.svg" alt="Pausar" />
            : <img src="/play.svg" alt="Tocar" />}
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar Próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
          <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>

      </footer>
    </div>
  )
}