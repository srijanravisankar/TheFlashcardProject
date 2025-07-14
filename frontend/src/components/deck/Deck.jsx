import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Box, Typography, Paper, IconButton, TextField, Fab, Button } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ReportIcon from '@mui/icons-material/Report';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';

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

  const handleStudy = () => {
    navigate(`/decks/${deckId}/study`);
  }

  return (
    <>
      {cards === null ? 
        <Box sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
          <Loader />
        </Box> :
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LayersRoundedIcon sx={{ fontSize: '30px' }} />
            <h2>{deckInfo?.data.label || null}</h2>
          </Box>
          <Button disabled={cards === null || cards?.length === 0} variant="contained" sx={{ backgroundColor: 'black' }} onClick={handleStudy}>
            <AutoStoriesRoundedIcon sx={{paddingRight: '7px'}} />
            Study
          </Button>
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