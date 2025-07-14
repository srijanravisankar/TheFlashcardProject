import { useState } from 'react';

import { Box, IconButton } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { updateFolder } from '../../routes/FolderRoutes';
import { updateDeck } from '../../routes/DeckRoutes';
import { AddPopover } from './AddPopover';
import DeleteDialog from './DeleteDialog';

export const TreeAction = ({item, action, setEdit, editLabel, setEditLabel, startTransition, anchorEl, setAnchorEl}) => {
	const open = Boolean(anchorEl);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const handleAddClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleUpdate = async () => {
		console.log('hi');
		
		if (item.type === 'folder') {
			const folderId = item.id.replace('folder-', '');
			await updateFolder(folderId, editLabel, item.fetchTree);
		} else if (item.type === 'deck') {
			const deckId = item.id.replace('deck-', '');
			await updateDeck(deckId, editLabel, item.fetchTree);
		}

		setTimeout(() => setEdit(false), 50);
	};

	const handleDelete = () => {
	 	setDeleteOpen(true);
	};

	return (
		<Box className="tree-actions" sx={{ display: 'none', gap: 0.5 }}>

			<IconButton edge="end" size="small" sx={{ marginLeft: 'auto', color: 'gray' }} aria-describedby={action}
				onClick={(e) => {
					e.stopPropagation();
					console.log(`${action} ${item.id}`);
					if (action === 'add') handleAddClick(e)
					if (action === 'edit') {
						setEditLabel(item.label);
						setEdit(true);
					}
					if (action === 'save') {
						handleUpdate(false);
					}
					if (action === 'delete') handleDelete();
				}}
			>
				{action === 'add' ? <AddBoxRoundedIcon /> : null}
				{action === 'edit' ? <EditRoundedIcon /> : null}
				{action === 'save' ? <SaveRoundedIcon /> : null}
				{action === 'delete' ? <DeleteRoundedIcon /> : null}
			</IconButton>
		
			{action === 'add' ? <AddPopover id='add' itemId={item.id} popoverOpen={open} anchorEl={anchorEl} handlePopoverClose={handleClose} fetchTree={item.fetchTree} /> : null}

			{action === 'delete' ? <DeleteDialog itemId={item.id} open={deleteOpen} setOpen={setDeleteOpen} fetchTree={item.fetchTree} itemLabel={item.label} itemType={item.type} /> : null}

		</Box>
	);
}