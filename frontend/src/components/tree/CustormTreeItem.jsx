import { forwardRef } from 'react';

import { Box, IconButton } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';

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

import { deleteFolder } from '../../routes/FolderRoutes';

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
            height: 33
          }}>

          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            {item.type === 'folder' ? <FolderRoundedIcon /> : <LayersRoundedIcon />}
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} />
            {item.type === 'folder' ? <TreeAction item={item} action={'add'} /> : null}
            <TreeAction item={item} action={'edit'} />
            <TreeAction item={item} action={'delete'} fetchTree={item.fetchTree} />
          </Box>

          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>        
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

const TreeAction = ({item, action, fetchTree}) => {
  const handleDelete = (item) => {
  console.log(action, item.type);
    if (item.type === 'folder') {
      const folderId = item.id.replace('folder-', '');
      deleteFolder(folderId);
      fetchTree()
    }
  };

  return (
      <Box className="tree-actions" sx={{ display: 'none', gap: 0.5 }}>

        <IconButton edge="end" size="small" sx={{ marginLeft: 'auto', color: 'gray' }}
          onClick={(e) => {
            e.stopPropagation();
            console.log(`${action} ${item.id}`);
            if (action === 'delete') handleDelete(item)
          }}
        >
          {action === 'add' ? <AddBoxRoundedIcon /> : null}
          {action === 'edit' ? <EditRoundedIcon /> : null}
          {action === 'delete' ? <DeleteRoundedIcon /> : null}
        </IconButton>

      </Box>
    );
}