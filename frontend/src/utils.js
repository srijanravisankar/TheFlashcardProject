

export const normalizeTree = (folder) => {
  return {
    id: `folder-${folder.id}`,
    label: `${folder.label}`,
    type: 'folder',
    children: [
      ...(folder.subfolders?.map(normalizeTree) ?? []),
      ...(folder.decks?.map(deck => ({
        id: `deck-${deck.id}`,
        label: `${deck.label}`,
        type: 'deck',
        children: []
      })) ?? [])
    ]
  };
};