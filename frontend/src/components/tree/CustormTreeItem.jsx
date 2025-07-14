import { useState, useTransition, forwardRef } from 'react';

import { Box, TextField } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';

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

import { TreeAction } from './TreeAction';

export const CustomTreeItem = forwardRef(function CustomTreeItem(props, ref) {
  const { id, type, itemId, label, disabled, children, ...other } = props;
  const [edit, setEdit] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const [isPending, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);

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
  console.log(item.label)

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent {...getContentProps()} sx={{
            '&:hover .tree-actions': {
              display: 'flex',
            },
            '.tree-actions': {
              display: anchorEl ? 'flex' : 'none',
            },
            display: 'flex',
            alignItems: 'center',
            height: 33,
            ...(item.id === deleteCardId ? {backgroundColor: '#d5d5d5ff'} : {})
          }}>

          <TreeItemIconContainer {...getIconContainerProps()} >
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            {item.type === 'folder' ? <FolderRoundedIcon sx={{fontSize: '20px'}} /> : <LayersRoundedIcon sx={{fontSize: '22px'}} />}
            <TreeItemCheckbox {...getCheckboxProps()} />

            {!edit ? <TreeItemLabel {...getLabelProps()} /> :
            <TextField variant="standard" size="small" onChange={(e) => setEditLabel(e.target.value)}
              onClick={(e) => {e.stopPropagation()}} onKeyDown={(e) => e.stopPropagation()}
              value={editLabel} autoFocus
              sx={{ "& .MuiInputBase-input": { fontSize: 16, height: 10, padding: 1  } }} />}

            <Box sx={{ display: 'flex', gap: 0.5, marginLeft: 'auto' }}>
              {item.type === 'folder' ? <TreeAction item={item} action={'add'} anchorEl={anchorEl} setAnchorEl={setAnchorEl} /> : null}

              {!edit ? <TreeAction item={item} action={'edit'} setEdit={setEdit} setEditLabel={setEditLabel} /> : 
              <TreeAction item={item} action={'save'} setEdit={setEdit} editLabel={editLabel} />}

              <TreeAction item={item} action={'delete'} fetchTree={item.fetchTree} setDeleteCardId={setDeleteCardId} />
            </Box>
          </Box>

          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>        
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});