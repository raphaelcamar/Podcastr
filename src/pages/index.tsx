import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import ptBR from 'date-fns/locale/pt-BR';
import { convetDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import Link from 'next/link';
import { usePlayer } from '../contexts/PlayerContext';
import Head from 'next/head';


type Episode = {
  id: string;
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  description: string;
  url: string
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  const { playlist } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];
  
  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
    <section className={styles.latestEpisodes}>
      <h1>Últimos lançamentos</h1>
      <ul>
        {latestEpisodes.map((episode, index) =>{
          return (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episode/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button" onClick={() => playlist(episodeList, index)}>
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>

    <section className={styles.allEpisodes}>
      <h2>Todos episódios</h2>

      <table cellSpacing={0}>
        <thead>
          <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {allEpisodes.map((episode, index) => {
            return (
              <tr key={episode.id}>
                <td>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    objectFit={'cover'}
                  />
                </td>
                <td>
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{width: 100}}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button onClick={() => playlist(episodeList, index + latestEpisodes.length)}>
                    <img src="/play-green.svg" alt="Tocar Episódio" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
    </div>
  )
}

export const getStaticProps:GetStaticProps = async () =>{
  const {data} = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode =>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convetDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
