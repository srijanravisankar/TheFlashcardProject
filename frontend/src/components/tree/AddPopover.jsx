import { useState } from 'react';
import { Button, Popover, ButtonGroup, Box, MenuItem, Menu, TextField, IconButton } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';

export const AddPopover = ({ itemId, popoverOpen, anchorEl, handlePopoverClose }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = ['FOLDER', 'DECK'];

	const handleClick = () => {

	}

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
    handleMenuClose();
  };

  return (
    <Popover
      id="add"
      open={popoverOpen}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClick={(e) => e.stopPropagation()}
			sx={{ height: 100, maxWidth: '100%' }} 
    >
      <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1, backgroundColor: '#f9f9f9', boxShadow: 8, px: 0.95, py: 1 }}>
        <ButtonGroup
          variant="outlined"
          size="small"
          sx={{
            '& .MuiButton-root': {
              color: 'white',
              backgroundColor: 'black',
              borderColor: 'black',
              fontSize: '14px',
							height: 30,
							fontSizeAdjust: 5,
              '&:hover': {
                backgroundColor: 'gray',
              },
            },
          }}
        >
          <Button sx={{ fontSize: '7px', pointerEvents: 'none' }}>{options[selectedIndex]}</Button>
          <Button onClick={handleMenuOpen} sx={{ fontSize: '2px', px: 0.5 }}>
            <ArrowDropDownIcon sx={{fontSize: "27px", px: 0.01}} />
          </Button>
        </ButtonGroup>

        <TextField
          id="standard-basic"
          // label="Name"
					placeholder="Name"
					autoFocus
          variant="filled"
          size="small"
          sx={{ "& .MuiInputBase-input": { fontSize: 15, height: 14, padding: 1, width: 120, px: 0.5 } }}
        />

				<IconButton sx={{ p: 0.5, color: "black", marginLeft: -0.5, py: 0.1 }} onClick={handleClick}><AddIcon /></IconButton>
      </Box>

      <Menu
				anchorEl={menuAnchorEl}
				open={Boolean(menuAnchorEl)}
				onClose={handleMenuClose}
				slotProps={{
					paper: {
						sx: { backgroundColor: '#f9f9f9' }
					},
					listbox: {
						dense: true
					}
				}}
			>

        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={() => handleMenuItemClick(index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Popover>
  );
};
