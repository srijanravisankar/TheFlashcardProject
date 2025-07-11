import api from "../api";

export const addFolder = async (id, label, fetchTree) => {
  return api
      .put(`/folders/${id}`, {
          label: label
        })
        .then(() => {
          fetchTree();
        })
        .catch((err) => console.error('Failed to update folder:', err));
}

export const updateFolder = async (id, label, fetchTree) => {
    return api
      .put(`/folders/${id}`, {
          label: label
        })
        .then(() => {
          fetchTree();
        })
        .catch((err) => console.error('Failed to update folder:', err));
}

export const deleteFolder = (id, fetchTree) => {
    api
      .delete(`/folders/${id}`)
      .then(() => fetchTree())
      .catch((err) => console.error('Failed to delete folder:', err));
}