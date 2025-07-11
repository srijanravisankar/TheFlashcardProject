import { useState } from 'react';

import { Box, IconButton } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { deleteFolder, updateFolder } from '../../routes/FolderRoutes';
import { AddPopover } from './AddPopover';

export const TreeAction = ({item, action, setEdit, editLabel, setEditLabel, startTransition, anchorEl, setAnchorEl}) => {
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

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

			<IconButton edge="end" size="small" sx={{ marginLeft: 'auto', color: 'gray' }} aria-describedby={action}
				onClick={(e) => {
					e.stopPropagation();
					console.log(`${action} ${item.id}`);
					if (action === 'add') handleClick(e)
					if (action === 'edit') {
						setEditLabel(item.label);
						setEdit(true);
					}
					if (action === 'save') handleUpdate(false);
					if (action === 'delete') handleDelete();
				}}
			>
				{action === 'add' ? <AddBoxRoundedIcon /> : null}
				{action === 'edit' ? <EditRoundedIcon /> : null}
				{action === 'save' ? <SaveRoundedIcon /> : null}
				{action === 'delete' ? <DeleteRoundedIcon /> : null}
			</IconButton>
		
			{action === 'add' ? <AddPopover id='add' itemId={item.id} popoverOpen={open} anchorEl={anchorEl} handlePopoverClose={handleClose} fetchTree={item.fetchTree} /> : null}

		</Box>
	);
}