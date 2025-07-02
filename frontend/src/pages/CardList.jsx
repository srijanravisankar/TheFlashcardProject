import { useEffect, useState } from 'react';
 import { Link } from 'react-router-dom';

import api from '../api'
import ListButtonComponent from '../components/ListButtonComponent'

function CardList() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api.get('/cards')
      .then((res) => {
        setCards(res.data)
      })
      .catch((err) => {
        console.error('Failed to fetch flashcards:', err)
      })
  }, [])

  return (
    <div>
      <h1>Flashcards</h1>
      <div className="card-container">
        {cards.map((card) => (
          <Link to={`/cards/${card.id}`}>
            <ListButtonComponent key={card.id} cardId={card.id} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CardList;
