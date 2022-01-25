import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageUrl, setImageUrl] = useState('');

  const viewImage = (url: string): void => {
    setImageUrl(url);
    onOpen();
  };

  function renderModalViewImage(): JSX.Element {
    return (
      <ModalViewImage isOpen={isOpen} imgUrl={imageUrl} onClose={onClose} />
    );
  }

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards?.map(card => (
          <Card key={card.id} data={card} viewImage={viewImage} />
        ))}
      </SimpleGrid>
      {renderModalViewImage()}
    </>
  );
}
