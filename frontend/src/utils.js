
export const normalizeTree = (folder, fetchTree) => {
  return {
    id: `folder-${folder.id}`,
    label: folder.label,
    created_at: folder.created_at,
    type: 'folder',
    fetchTree,
    children: [
      ...(folder.subfolders?.map(subfolder => normalizeTree(subfolder, fetchTree)) ?? []),
      ...(folder.decks?.map(deck => ({
        id: `deck-${deck.id}`,
        label: deck.label,
        created_at: deck.created_at,
        type: 'deck',
        fetchTree,
        children: []
      })) ?? []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    ]
  };
};


export const normalizeAll = (folders = [], decks = [], fetchTree) => {
  const folderNodes = folders
    .map(folder => normalizeTree(folder, fetchTree))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const topLevelDecks = decks
    .filter(deck => !deck.folder_id)
    .map(deck => ({
      id: `deck-${deck.id}`,
      label: deck.label,
      created_at: deck.created_at,
      type: 'deck',
      fetchTree,
      children: [],
    })).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const combined = [...folderNodes, ...topLevelDecks];
  combined.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return combined;
};

export function shuffleArray(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}