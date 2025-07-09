import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, IconButton } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemGroupTransition,
  TreeItemLabel,
  TreeItemRoot,
  TreeItemCheckbox,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';

import api from '../api';
import { normalizeTree } from '../utils';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, type, itemId, label, disabled, children, ...other } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, type, itemId, children, label, disabled, rootRef: ref });

  const item = useTreeItemModel(itemId);

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {item.type === 'folder' ? <FolderRoundedIcon /> : <LayersRoundedIcon />}
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} />
            <IconButton
              edge="end"
              size="small"
              sx={{ marginLeft: 'auto', color: 'gray' }}
              onClick={(e) => {
                e.stopPropagation(); // 👈 prevent expanding/collapsing
                console.log(`Delete ${item.id}`); // Replace with delete handler
              }}
            ></IconButton>
          </Box>
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function FolderTree() {
  const [tree, setTree] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
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