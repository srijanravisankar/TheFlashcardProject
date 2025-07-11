import api from "../api";

export const addDeck = async (id, label, fetchTree) => {
    return api
      .post(`/decks`, {
          label: label,
          folder_id: id
        })
        .then(() => {
          fetchTree();
        })
        .catch((err) => console.error('Failed to add deck:', err));
}

export const updateDeck = (id, fetchTree) => {
    api
      .delete(`/decks/${id}`)
      .then(() => fetchTree())
      .catch((err) => console.error('Failed to update deck:', err));
}