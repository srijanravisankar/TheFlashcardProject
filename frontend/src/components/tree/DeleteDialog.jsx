import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { deleteFolder } from '../../routes/FolderRoutes';
import { deleteDeck } from '../../routes/DeckRoutes';

export default function DeleteDialog({itemId, open, setOpen, fetchTree}) {
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

	const deleteItem = () => {
		if (itemId.startsWith('folder')) {
			const folderId = itemId.replace('folder-', '');
			console.log(folderId)
			deleteFolder(folderId, fetchTree)
		} else if (itemId.startsWith('deck')) {
			const deckId = itemId.replace('deck-', '');
			deleteDeck(deckId, fetchTree)
		}
		setOpen(false);
	}


	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
		open={open}
		onClose={handleClose}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
		onClick={e => e.stopPropagation()}
		>
				<DialogTitle id="alert-dialog-title">
						{"Delete Confirmation"}
				</DialogTitle>
				<DialogContent>
						<DialogContentText id="alert-dialog-description">
						Are you sure want to delete?
						</DialogContentText>
				</DialogContent>
				<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={deleteItem} autoFocus>Delete</Button>
				</DialogActions>
		</Dialog>
	);
}
