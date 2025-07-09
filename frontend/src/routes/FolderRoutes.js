import api from "../api";

export const updateFolder = (id, fetchTree) => {
    api
      .delete(`/folders/${id}`)
      .then(() => fetchTree())
      .catch((err) => console.error('Failed to update folder:', err));
}

export const deleteFolder = (id) => {
    api
      .delete(`/folders/${id}`)
      .catch((err) => console.error('Failed to delete folder:', err));
}