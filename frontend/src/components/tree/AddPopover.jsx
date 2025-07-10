import { Popover } from "@mui/material";

export const AddPopover = ({open, anchorEl, handleClose}) => {
	return (    
		<Popover
			id='add'
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			onClick={(e) => e.stopPropagation()}
			>
			The content of the Popover.
		</Popover>
	);
}