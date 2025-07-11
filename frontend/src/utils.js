
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


export const normalizeAll = (folders = [], decks = [], fetchTree) => {
  const folderNodes = folders.map(folder => normalizeTree(folder, fetchTree));

  const topLevelDecks = decks
    .filter(deck => !deck.folder_id) // include only decks without folder
    .map(deck => ({
      id: `deck-${deck.id}`,
      label: deck.label,
      type: 'deck',
      children: [],
    }));

  return [...folderNodes, ...topLevelDecks];
};