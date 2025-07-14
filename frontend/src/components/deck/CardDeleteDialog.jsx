import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { deleteCard } from '../../routes/CardRoutes';

export default function CardDeleteDialog({itemId, open, setOpen, fetchCards}) {

	console.log("deleted item with id: ", itemId);
	const deleteItem = async () => {
		console.log("deleted item with id!!!!!!: ", itemId);
		await deleteCard(itemId, fetchCards);
		await fetchCards();
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
		slotProps={{
    paper: {
      sx: {
				margin: 0,
				padding: 0,
        width: '300px',
				height: '190px',
        maxWidth: '90%',
      },
    },
  }}
		>
			<DialogTitle id="alert-dialog-title" sx={{margin: 0, padding: 0}}>
				{"Delete Confirmation"}
			</DialogTitle>
			<DialogContent>
					<DialogContentText id="alert-dialog-description" sx={{margin: 0, padding: 0, width: "250px"}}>
							Are you sure want to delete?
					</DialogContentText>
			</DialogContent>
			<DialogActions>
					<Button onClick={handleClose} sx={{color: "grey"}}>Cancel</Button>
					<Button variant="contained" onClick={deleteItem} autoFocus sx={{backgroundColor: "black"}}>Delete</Button>
			</DialogActions>
		</Dialog>
	);
}
