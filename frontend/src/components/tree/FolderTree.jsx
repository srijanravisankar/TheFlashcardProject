import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';

import StyleIcon from '@mui/icons-material/Style';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import api from '../../api';
import { normalizeAll } from '../../utils';
import { CustomTreeItem } from './CustormTreeItem';
import { TreeAction } from './TreeAction';
import Loader from '../../Loader';

export default function FolderTree() {
  const [tree, setTree] = useState(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchTree = () => {
    Promise.all([api.get('/folders'), api.get('/decks')])
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
    <>
      {tree === null ? 
        <Box sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
          <Loader />
        </Box> :
        <Box sx={{ padding: 2 }}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
            <StyleIcon sx={{fontSize: '33px'}} />
            <h2>Momento</h2>
          </Box>
          <RichTreeView
          items={tree}
          slots={{ item: CustomTreeItem }}
          onItemClick={handleItemClick}
          />
          <TreeAction action={'add'} anchorEl={anchorEl} setAnchorEl={setAnchorEl} fetchTree={fetchTree} />
        </Box>
      }
    </>
  );
}