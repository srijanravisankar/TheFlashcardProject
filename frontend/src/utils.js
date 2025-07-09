

export const normalizeTree = (folder, fetchTree) => {
  return {
    id: `folder-${folder.id}`,
    label: `${folder.label}`,
    type: 'folder',
    fetchTree, 
    children: [
      ...(folder.subfolders?.map(subfolder => normalizeTree(subfolder, fetchTree)) ?? []),
      ...(folder.decks?.map(deck => ({
        id: `deck-${deck.id}`,
        label: `${deck.label}`,
        type: 'deck',
        children: []
      })) ?? [])
    ]
  };
};