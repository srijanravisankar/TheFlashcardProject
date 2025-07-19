import api from "../api";

export const addDeck = async (id, label, fetchTree) => {
    return api
      .post(`/decks/`, {
          label: label,
          folder_id: id
        })
        .then(() => {
          fetchTree();
        })
        .catch((err) => console.error('Failed to add deck:', err));
}

export const getDeck = async (id) => {
  return api
          .get(`/decks/${id}/`)
          .catch((err) => console.error('Failed to fetch deck:', err));
}

export const updateDeck = async (id, label, fetchTree) => {
    return api
      .put(`/decks/${id}/`, {
          label: label
        })
        .then(() => {
          fetchTree();
        })
        .catch((err) => console.error('Failed to update deck:', err));
}

export const deleteDeck = (id, fetchTree) => {
    api
      .delete(`/decks/${id}/`)
      .then(() => fetchTree())
      .catch((err) => console.error('Failed to delete deck:', err));
}