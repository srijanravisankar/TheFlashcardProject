import { forwardRef } from 'react';

import { Box, IconButton } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

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

export const CustomTreeItem = forwardRef(function CustomTreeItem(props, ref) {
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
        <TreeItemContent {...getContentProps()} sx={{
            '&:hover .tree-actions': { display: 'flex' },
            display: 'flex',
            alignItems: 'center',
            height: 30
          }}>

          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            {item.type === 'folder' ? <FolderRoundedIcon /> : <LayersRoundedIcon />}
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} />

            <Box className="tree-actions" sx={{ display: 'none', gap: 0.5 }}>
              <IconButton edge="end" size="small" sx={{ marginLeft: 'auto', color: 'gray' }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Delete ${item.id}`);
                }}
              ><AddCircleRoundedIcon /></IconButton>
              <IconButton edge="end" size="small" sx={{ marginLeft: 'auto', color: 'gray' }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Delete ${item.id}`);
                }}
              ><EditRoundedIcon /></IconButton>
              <IconButton edge="end" size="small" sx={{ marginLeft: 'auto', color: 'gray' }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Delete ${item.id}`);
                }}
              ><DeleteRoundedIcon /></IconButton>
            </Box>

          </Box>
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});