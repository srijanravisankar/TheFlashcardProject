import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import api from '../../api';
import { normalizeTree, normalizeAll } from '../../utils';
import { CustomTreeItem } from './CustormTreeItem';

export default function FolderTree() {
  const [tree, setTree] = useState(null);
  const navigate = useNavigate();

  const fetchTree = () => {
    Promise.all([api.get('/folders'), api.get('/decks/')])
      .then(([folderRes, deckRes]) => {
        const folders = folderRes.data;
        const decks = deckRes.data;
        const normalized = normalizeAll(folders, decks, fetchTree);
        setTree(normalized);
        console.log(normalized)
      })
      .catch(err => console.error('Failed to fetch tree:', err));
  };
  
  useEffect(fetchTree, []);

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
    <Box sx={{ padding: 2 }}>
      <h2>Srijan's FSRS App</h2>
      {
        tree === null ?  <CircularProgress sx={{ color: 'black' }} /> : 
          <RichTreeView
            items={tree}
            slots={{ item: CustomTreeItem }}
            onItemClick={handleItemClick}
          />
      }
    </Box>
  );
}