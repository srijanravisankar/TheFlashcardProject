import api from "../api";

export const addCard = async (id, label, fetchTree) => {
    return api
      .post(`/cards`, {
          label: label,
          folder_id: id
        })
        .then(() => {
          fetchTree();
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

export const updateCard = async (id, label, fetchTree) => {
    return api
      .put(`/cards/${id}`, {
          label: label
        })
        .then(() => {
          fetchTree();
        })
        .catch((err) => console.error('Failed to update card:', err));
}

export const deleteCard = (id, fetchTree) => {
    api
      .delete(`/cards/${id}`)
      .then(() => fetchTree())
      .catch((err) => console.error('Failed to delete card:', err));
}