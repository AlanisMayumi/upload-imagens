import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = null }) => {
      const res = await api.get('/api/images', {
        params: {
          after: pageParam,
        },
      });

      return res.data;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        console.log('getNextPageParam', lastPage?.after);
        return lastPage?.after;
      },
    }
  );

  const formattedData: Card[] = useMemo(() => {
    let images = [];
    const qtdPages = data?.pages.length;
    let p = 0;
    for (p = 0; p < qtdPages; p += 1) {
      images = [...images, ...data?.pages[p].data];
    }
    return images
      .map((card: Card) => ({
        title: card.title,
        description: card.description,
        url: card.url,
        ts: card.ts,
        id: card.id,
      }))
      .flat();
  }, [data]);

  function renderLoading(): JSX.Element {
    return isLoading && <Loading />;
  }

  function renderError(): JSX.Element {
    return isError && <Error />;
  }
  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {renderLoading()}
        {renderError()}
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} mt="25px">
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
