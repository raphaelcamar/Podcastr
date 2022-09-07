/* eslint-disable no-unused-vars */
import { Episode } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import { convetDurationToTimeString } from '../../utils/convertDurationToTimeString';

interface SliderPlayerProps {
  episode: Episode;
  progress: number;
  handleSeek: (amount: number) => void;
}

export function SliderPlayer({ episode, handleSeek, progress }: SliderPlayerProps) {
  return (
    <div className={styles.slider}>
      {episode ? (
        <>
          <span>{convetDurationToTimeString(progress)}</span>
          <Slider
            max={episode.duration}
            value={progress}
            onChange={handleSeek}
            trackStyle={{ backgroundColor: '#04D361' }}
            railStyle={{ backgroundColor: '#9f75ff' }}
            handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
          />
          <span>{convetDurationToTimeString(episode?.duration ?? 0)}</span>
        </>
      ) : (
        <div className={styles.emptySlider} />
      )}
    </div>
  );
}
