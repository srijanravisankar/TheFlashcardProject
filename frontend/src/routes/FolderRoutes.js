import api from "../api";

export const deleteFolder = (id) => {
    api
      .delete(`/folders/${id}`)
      .catch((err) => console.error('Failed to delete folder:', err));
  }