

export const updateDeck = (id, fetchTree) => {
    api
      .delete(`/decks/${id}`)
      .then(() => fetchTree())
      .catch((err) => console.error('Failed to update deck:', err));
}