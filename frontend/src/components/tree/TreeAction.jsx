import { Box, IconButton } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { deleteFolder, updateFolder } from '../../routes/FolderRoutes';

export const TreeAction = ({item, action, setEdit, editLabel, setEditLabel, startTransition}) => {
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