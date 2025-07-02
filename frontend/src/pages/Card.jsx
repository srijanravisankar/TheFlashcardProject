import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../api';
import CardComponent from '../components/CardComponent';

function Card() {
  const { cardId } = useParams();
  const [card, setCard] = useState([]);

  useEffect(() => {
    api.get(`/cards/${cardId}`)
      .then((res) => {
        setCard(res.data)
      })
      .catch((err) => {
        console.error('Failed to fetch flashcard:', err)
      })
  }, [])

  return <CardComponent front_text={card.front_text} back_text={card.back_text} />;
}

export default Card;
