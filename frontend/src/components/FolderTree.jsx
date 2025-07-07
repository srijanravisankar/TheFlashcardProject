import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import FolderIcon from '@mui/icons-material/Folder';

import api from '../api';

const normalizeTree = (folder) => {
  return {
    id: `folder-${folder.id}`,
    label: `📁 ${folder.label}`,
    type: 'folder',
    children: [
      ...(folder.subfolders?.map(normalizeTree) ?? []),
      ...(folder.decks?.map(deck => ({
        id: `deck-${deck.id}`,
        label: `📚 ${deck.label}`,
        type: 'children',
        children: []
      })) ?? [])
    ]
  };
};

export default function FolderTree() {
  const [tree, setTree] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/folders')
      .then(res => {
        const normalized = res.data.map(normalizeTree);
        setTree(normalized);
      })
      .catch(err => console.error('Failed to fetch folders:', err));
  }, []);

  const handleItemClick = (event, item) => {
    if (item.startsWith('deck-')) {
      const deckId = item.replace("deck-", "");
      navigate(`/decks/${deckId}`)
      console.log(`type: deck, id: ${deckId}`);
    } else if (item.startsWith('folder-')) {
      const folderId = item.replace("folder-", "");
      console.log(`type: folder, id: ${folderId}`);
    }
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={tree} onItemClick={handleItemClick}/>
    </Box>
  );
}