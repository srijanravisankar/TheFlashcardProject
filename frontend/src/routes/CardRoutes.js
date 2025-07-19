import api from "../api";

export const addCard = async (card) => {
    return api
      .post(`/cards/`, {
          front_text: card.frontText,
          back_text: card.backText,
          deck_id: card.deckId
        })
        .catch((err) => console.error('Failed to add card:', err));
}

export const getCards = async (id, study = null) => {
  const apiRoute = study ? `/cards/?deck_id=${id}&study=true` : `/cards/?deck_id=${id}`;
  return api
          .get(apiRoute)
          .catch((err) => console.error('Failed to fetch cards:', err));
}

export const getCard = async (id) => {
  return api
          .get(`/cards/${id}/`)
          .catch((err) => console.error('Failed to fetch card:', err));
}

export const updateCard = async (id, front_text, back_text, deck_id, rating = null, study = false) => {
  const apiRoute = study ? `/cards/${id}/?study=${study}` : `/cards/${id}/`;
  return api
    .put(apiRoute, {
        front_text,
        back_text,
        deck_id,
        rating
      })
      .catch((err) => console.error('Failed to update card:', err));
}

export const deleteCard = async (id) => {
    return api
      .delete(`/cards/${id}/`)
      .catch((err) => console.error('Failed to delete card:', err));
}