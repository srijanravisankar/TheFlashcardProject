import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { deleteCard } from '../../routes/CardRoutes';

export default function CardDeleteDialog({itemId, open, setOpen, fetchCards, setDeleteCardId}) {

	console.log("deleted item with id: ", itemId);
	const deleteItem = async () => {
		console.log("deleted item with id!!!!!!: ", itemId);
		setDeleteCardId(null);
		await deleteCard(itemId, fetchCards);
		await fetchCards();
		setOpen(false);
	}

	const handleClose = () => {
		setDeleteCardId(null);
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
					<DialogTitle id="alert-dialog-title" sx={{fontSize: 17}}>
							{"Delete Confirmation"}
					</DialogTitle>
					<DialogContent>
							<DialogContentText id="alert-dialog-description" sx={{fontSize: 10}}>
								Are you sure want to delete the flashcard?
							</DialogContentText>
					</DialogContent>
					<DialogActions>
							<Button onClick={handleClose} sx={{color: 'black', fontSize: 3}}>Cancel</Button>
							<Button onClick={deleteItem} autoFocus sx={{backgroundColor: 'black', color: 'white', fontSize: 3}}>Delete</Button>
					</DialogActions>
			</Dialog>
		);
}
