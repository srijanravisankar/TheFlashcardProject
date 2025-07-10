import { useState, useTransition, forwardRef } from 'react';

import { Box, IconButton, TextField } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

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

import { deleteFolder, updateFolder } from '../../routes/FolderRoutes';

export const CustomTreeItem = forwardRef(function CustomTreeItem(props, ref) {
  const { id, type, itemId, label, disabled, children, ...other } = props;
  const [edit, setEdit] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const [isPending, startTransition] = useTransition();

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
        <TreeItemContent {...getContentProps()} sx={{
            '&:hover .tree-actions': { display: 'flex' },
            display: 'flex',
            alignItems: 'center',
            height: 33
          }}>

          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            {item.type === 'folder' ? <FolderRoundedIcon /> : <LayersRoundedIcon />}
            <TreeItemCheckbox {...getCheckboxProps()} />

            {!edit ? <TreeItemLabel {...getLabelProps()} /> :
            <TextField variant="standard" size="small" onChange={(e) => setEditLabel(e.target.value)}
              onClick={(e) => {e.stopPropagation()}} onKeyDown={(e) => e.stopPropagation()}
              value={editLabel} autoFocus
              sx={{ "& .MuiInputBase-input": { fontSize: 16, height: 10, padding: 1  } }} />}

            <Box sx={{ display: 'flex', gap: 0.5, marginLeft: 'auto' }}>
              {item.type === 'folder' ? <TreeAction item={item} action={'add'} /> : null}

              {!edit ? <TreeAction item={item} action={'edit'} setEdit={setEdit} setEditLabel={setEditLabel} /> : 
              <TreeAction item={item} action={'save'} setEdit={setEdit} editLabel={editLabel} startTransition={startTransition} />}

              <TreeAction item={item} action={'delete'} fetchTree={item.fetchTree} />
            </Box>
          </Box>

          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>        
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

const TreeAction = ({item, action, setEdit, editLabel, setEditLabel, startTransition}) => {
  const handleUpdate = async () => {
    console.log('hi');
    
    if (item.type === 'folder') {
      const folderId = item.id.replace('folder-', '');
      await updateFolder(folderId, editLabel, item.fetchTree, setEdit);
    } else if (item.type === 'deck') {
      const deckId = item.id.replace('deck-', '');
      updateDeck(deckId, item.label, item.fetchTree);
    }

    startTransition(() => {
      setEdit(false);
    });
  };

  const handleDelete = () => {
    if (item.type === 'folder') {
      const folderId = item.id.replace('folder-', '');
      deleteFolder(folderId, item.fetchTree);
    }
  };

  return (
      <Box className="tree-actions" sx={{ display: 'none', gap: 0.5 }}>

        <IconButton edge="end" size="small" sx={{ marginLeft: 'auto', color: 'gray' }}
          onClick={(e) => {
            e.stopPropagation();
            console.log(`${action} ${item.id}`);
            if (action === 'edit') {
              setEditLabel(item.label);
              setEdit(true);
            }
            if (action === 'save') handleUpdate(false);
            if (action === 'delete') handleDelete()
          }}
        >
          {action === 'add' ? <AddBoxRoundedIcon /> : null}
          {action === 'edit' ? <EditRoundedIcon /> : null}
          {action === 'save' ? <SaveRoundedIcon /> : null}
          {action === 'delete' ? <DeleteRoundedIcon /> : null}
        </IconButton>

      </Box>
    );
}