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

export const TreeAction = ({item, action, setEdit, editLabel, setEditLabel, anchorEl, setAnchorEl, setDeleteCardId, fetchTree}) => {
	const open = Boolean(anchorEl);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const handleAddClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleUpdate = async () => {
		
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
		setDeleteCardId(item.id);
	 	setDeleteOpen(true);
	};

	return (
		<Box className="tree-actions" sx={{ display: item ? 'none' : 'block', gap: 0.5, ...(item ? {} : {paddingLeft: '28px', paddingTop: '5px'}) }}>

			<IconButton edge="end" size="small" sx={{ marginLeft: 'auto', color: 'gray' }} aria-describedby={action}
				onClick={(e) => {
					e.stopPropagation();
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
				{action === 'add' ? <AddBoxRoundedIcon sx={{...(!item ? {fontSize: '20px'} : {fontSize: '20px'})}} /> : null}
				{action === 'edit' ? <EditRoundedIcon sx={{fontSize: '20px'}} /> : null}
				{action === 'save' ? <SaveRoundedIcon sx={{fontSize: '20px'}} /> : null}
				{action === 'delete' ? <DeleteRoundedIcon sx={{fontSize: '20px'}} /> : null}
			</IconButton>
		
			{action === 'add' ? <AddPopover id='add' itemId={item?.id ?? null} popoverOpen={open} anchorEl={anchorEl} handlePopoverClose={handleClose} fetchTree={item?.fetchTree ?? fetchTree} /> : null}

			{action === 'delete' ? <DeleteDialog itemId={item.id} open={deleteOpen} setOpen={setDeleteOpen} fetchTree={item.fetchTree} itemLabel={item.label} itemType={item.type} setDeleteCardId={setDeleteCardId} /> : null}

		</Box>
	);
}