import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { convetDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';

type EpisodeType = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type EpisodeProps = {
  episode: EpisodeType;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}| Podcastr</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href={'/'}>
          <button>
            <Image src="/arrow-left.svg" alt="Voltar" width={16} height={16} />
          </button>
        </Link>

        <Image width={700} height={160} objectFit={'cover'} src={episode.thumbnail} alt="episode iamge" />

        <button onClick={() => play(episode)}>
          <Image src="/play.svg" alt="Tocar episódio" width={32} height={32} />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { episodes } = await api();

  const paths = episodes.map(episode => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params;

  const { episodes } = await api();
  const [data] = episodes.filter(episode => episode.id === slug) as any;
  const episode = {
    id: data?.id || null,
    title: data?.title || null,
    thumbnail: data?.thumbnail || null,
    members: data?.members || null,
    publishedAt: format(new Date(), 'd MMM yy', { locale: ptBR }) || null,
    duration: Number(data?.file?.duration) || null,
    durationAsString: convetDurationToTimeString(Number(data?.file?.duration)) || null,
    description: data?.description || null,
    url: data?.file?.url || null,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
