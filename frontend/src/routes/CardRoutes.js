import api from "../api";

export const addCard = async (card) => {
    return api
      .post(`/cards`, {
          front_text: card.frontText,
          back_text: card.backText,
          deck_id: card.deckId
        })
        .catch((err) => console.error('Failed to add card:', err));
}

export const getCards = async (id) => {
  return api
          .get(`/cards?deck_id=${id}`)
          .catch((err) => console.error('Failed to fetch cards:', err));
}

export const getCard = async (id) => {
  return api
          .get(`/cards/${id}`)
          .catch((err) => console.error('Failed to fetch card:', err));
}

export const updateCard = async (id, card) => {
    return api
      .put(`/cards/${id}`, {
          front_text: card.frontText,
          back_text: card.backText,
          deck_id: card.deckId
        })
        .catch((err) => console.error('Failed to update card:', err));
}

export const deleteCard = async (id, fetchCards) => {
    return api
      .delete(`/cards/${id}`)
      .then(() => fetchCards())
      .catch((err) => console.error('Failed to delete card:', err));
}