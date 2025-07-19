import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Box, Typography, Paper, IconButton, TextField, Fab, Button, Badge, Tooltip, ButtonGroup, Menu, MenuItem } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ReportIcon from '@mui/icons-material/Report';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import PreviewIcon from '@mui/icons-material/Preview';
import RepeatIcon from '@mui/icons-material/Repeat';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { getDeck } from '../../routes/DeckRoutes';
import { addCard, getCards, updateCard, deleteCard } from '../../routes/CardRoutes';
import CardDeleteDialog from './CardDeleteDialog';
import Loader from '../../Loader';

export default function Deck() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState(null);
  const [editCardId, setEditCardId] = useState(null);
  const [create, setCreate] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [deckInfo, setDeckInfo] = useState(null);
	const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const options = ['FSRS', 'Ordered', 'Random'];

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const fetchCards = async () => {
    try {
      const cardRes = await getCards(deckId);
      setCards(cardRes.data);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchCards();
        const info = await getDeck(deckId);
        setDeckInfo(info);
      } catch (err) {
        console.error('Failed to fetch deck or cards:', err);
      }
    };

    fetchData();
  }, [deckId]);

  const handleCreate = async (card) => {
    await addCard(card);
    fetchCards();
    setCreate(false);
  }

  const handleDelete = async (cardId) => {
    setDeleteCardId(cardId);
    setDeleteOpen(true);
  }

  const handleUpdate = async (id, updatedCard) => {
    await updateCard(id, updatedCard.frontText, updatedCard.backText, deckId);
    fetchCards();
    setEditCardId(null);
  }

  const handleStudy = (option) => {
    const query = new URLSearchParams({ option: JSON.stringify(option) }).toString();
    navigate(`/deck/${deckId}/study?${query}`);
  };

  let newCards = 0;
  let learningCards = 0;
  let reviewCards = 0;

  if (cards) {
    for (const card of cards) {
      switch (card.fsrs_state.state) {
        case 1:
          newCards++;
          break;
        case 2:
          reviewCards++;
          break;
        case 3:
          learningCards++;
          break;
      }
    }
  }

  return (
    <>
      {cards === null ? 
        <Box sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
          <Loader />
        </Box> :
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', gap: 4}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LayersRoundedIcon sx={{ fontSize: '33px' }} />
            <h2>{deckInfo?.data.label || null}</h2>

            <Badge badgeContent={newCards} color="secondary" max={99} overlap="circular"
              sx={{'& .MuiBadge-badge': { backgroundColor: 'black'}, paddingLeft: '20px' }} >
              <Tooltip title="New" arrow><FiberNewIcon color="action" sx={{fontSize: '26px', color: 'black'}} /></Tooltip>
            </Badge>
            <Badge badgeContent={reviewCards} color="secondary" max={99} overlap="circular"
              sx={{'& .MuiBadge-badge': { backgroundColor: 'black'} }}>
                <Tooltip title="To Review" arrow><PreviewIcon color="action" sx={{fontSize: '26px', color: 'black'}} /></Tooltip>
            </Badge>
            <Badge badgeContent={learningCards} color="secondary" max={99} overlap="circular"
              sx={{'& .MuiBadge-badge': {height: '19px', width: '12px', backgroundColor: 'black'} }}>
                <Tooltip title="Learning" arrow><RepeatIcon color="action" sx={{fontSize: '26px', color: 'black'}} /></Tooltip>
            </Badge>

          </Box>

          <ButtonGroup
            variant="outlined"
            size="small"
            sx={{
              '& .MuiButton-root': {
                color: 'white',
                backgroundColor: 'black',
                borderColor: 'black',
                fontSize: '14px',
                height: 36,
                fontSizeAdjust: 5,
                '&:hover': {
                  backgroundColor: 'gray',
                },
              },
            }}
          >
            <Button sx={{ fontSize: '7px', pointerEvents: 'none' }}><AutoStoriesRoundedIcon sx={{paddingRight: '7px'}} />
            Study</Button>
            <Button onClick={handleMenuOpen} sx={{ fontSize: '2px', px: 0.5 }}>
              <ArrowDropDownIcon sx={{fontSize: "27px", px: 0.01}} />
            </Button>
          </ButtonGroup>

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
            {options.map((option) => (<MenuItem key={option} onClick={() => handleStudy(option)}>{option}</MenuItem>))}
          </Menu>

          {/* <Button disabled={cards === null || cards?.length === 0} variant="contained" sx={{ backgroundColor: 'black' }} onClick={handleStudy}>
            <AutoStoriesRoundedIcon sx={{paddingRight: '7px'}} />
            Study
          </Button> */}
        </Box>

        {(
          cards.length === 0 ? (
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, marginBottom: "35px"}}>
              <ReportIcon size="large" sx={{fontSize: 35}} />
              <Typography sx={{fontSize: "17px"}}>No cards found!</Typography>
            </Box>
          ) : (
            cards.map((card) => (
              <Paper key={card.id} sx={deleteCardId === card.id ? deletePaperStyle : paperStyle}>
                {editCardId !== card.id ? <>
                    <Box sx={editCardStyle}>
                      <Typography><strong>Q:</strong> {card.front_text}</Typography>
                      <Typography><strong>A:</strong> {card.back_text}</Typography>
                      <Box>
                        <IconButton onClick={() => {
                            setEditCardId(card.id);
                            setFrontText(card.front_text);
                            setBackText(card.back_text);
                          }}><EditRoundedIcon sx={{ color: 'black' }} /></IconButton>
                        <IconButton onClick={() => handleDelete(card.id)}><DeleteRoundedIcon sx={{ color: 'black' }} /></IconButton>
                      </Box>
                    </Box>
                  </> : <>
                    <Box sx={editCardStyle}>
                      <TextField label="Front text" defaultValue={frontText} onChange={(e) => setFrontText(e.target.value)} autoFocus />
                      <TextField label="Back text" defaultValue={backText} onChange={(e) => setBackText(e.target.value)} />
                      <Box>
                        <IconButton onClick={() => handleUpdate(card.id, {deckId, frontText, backText})}><SaveRoundedIcon sx={{ color: 'black' }} /></IconButton>
                        <IconButton onClick={() => setEditCardId(null)}><CancelIcon sx={{ color: 'black' }} /></IconButton>
                      </Box>
                    </Box>
                  </>
                }
            </Paper>
          ))
          )
        )}

        <CardDeleteDialog itemId={deleteCardId} open={deleteOpen} setOpen={setDeleteOpen} fetchCards={fetchCards} setDeleteCardId={setDeleteCardId} />

        {!create ? <></> : 
        <Paper sx={paperStyle}>
          <Box sx={editCardStyle}>
            <TextField label="Front text" onChange={(e) => setFrontText(e.target.value)} sx={{ color: 'black' }} />
            <TextField label="Back text" onChange={(e) => setBackText(e.target.value)} sx={{ outline: 'black' }} />
            <Box>
              <IconButton onClick={() => handleCreate({deckId, frontText, backText})}><AddBoxRoundedIcon sx={{ color: 'black' }} /></IconButton>
              <IconButton onClick={() => setCreate(false)}><CancelIcon sx={{ color: 'black' }} /></IconButton>
            </Box>
          </Box></Paper>}

        {cards === null ? <></> : 
          <Fab aria-label="add" size="medium" onClick={() => setCreate(true)} disabled={create}
            sx={{backgroundColor: 'black', color: 'white', marginTop: '20px', '&:hover': {backgroundColor: '#333'}}}>
          <AddRoundedIcon />
          </Fab> }
      </Box>
      }
    </>
  );
}

const paperStyle = {
  padding: 2, 
  marginBottom: 2, 
  backgroundColor: '#F6F6F6', 
  boxShadow: 8, 
  cursor: 'pointer',
  '&:hover': { boxShadow: 3 }
}

const deletePaperStyle = {
  padding: 2, 
  marginBottom: 2, 
  backgroundColor: '#d5d5d5ff', 
  boxShadow: 8, 
  cursor: 'pointer',
  '&:hover': { boxShadow: 3 }
}

const editCardStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: 1
}