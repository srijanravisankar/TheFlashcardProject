import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import api from '../../api';
import { normalizeTree } from '../../utils';
import { CustomTreeItem } from './CustormTreeItem';

export default function FolderTree() {
  const [tree, setTree] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/folders')
      .then(res => {
        const normalized = res.data.map(normalizeTree);
        setTree(normalized);
        console.log(normalized)
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