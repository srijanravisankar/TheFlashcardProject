import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Typography, Paper, CircularProgress, IconButton, TextField, Fab } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';

import api from '../api';

export default function Deck() {
  const { deckId } = useParams();

  const [cards, setCards] = useState(null);
  const [editCardId, setEditCardId] = useState(null);
  const [create, setCreate] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');

  useEffect(() => getCards(), [deckId]);

  const createCard = (updatedCard) => {
    api
      .post(`/cards`, {
          deck_id: updatedCard.deckId, 
          front_text: updatedCard.frontText, 
          back_text: updatedCard.backText
        })
      .then(() => {
        getCards();
        setCreate(false);
      })
      .catch((err) => console.error('Failed to create card:', err));
  }

  const getCards = () => {
    api
      .get(`/cards?deck_id=${deckId}`)
      .then((res) => setCards(res.data))
      .catch((err) => console.error('Failed to fetch cards:', err));
  }

  const deleteCard = (id) => {
    api
      .delete(`/cards/${id}`)
      .then(() => getCards())
      .catch((err) => console.error('Failed to delete card:', err));
  }

  const updateCard = (id, updatedCard) => {
    api
      .put(`/cards/${id}`, {
          deck_id: updatedCard.deckId, 
          front_text: updatedCard.frontText, 
          back_text: updatedCard.backText
        })
      .then(() => {
        getCards();
        setEditCardId(null);
      })
      .catch((err) => console.error('Failed to update card:', err));
  }

  return (
    <Box sx={{ padding: 2 }}>
      <h2>Deck {deckId}</h2>

      {
        cards === null ?  <CircularProgress sx={{ color: 'black' }} /> : (
          cards.length === 0 ? (
            <Typography>No cards found.</Typography>
          ) : (
            cards.map((card) => (
              <Paper key={card.id} onClick={() => console.log('card clicked', card.id)} sx={paperStyle}>
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
                        <IconButton onClick={() => deleteCard(card.id)}><DeleteRoundedIcon sx={{ color: 'black' }} /></IconButton>
                      </Box>
                    </Box>
                  </> : <>
                    <Box sx={editCardStyle}>
                      <TextField label="Front text" defaultValue={frontText} onChange={(e) => setFrontText(e.target.value)} autoFocus />
                      <TextField label="Back text" defaultValue={backText} onChange={(e) => setBackText(e.target.value)} />
                      <Box>
                        <IconButton onClick={() => updateCard(card.id, {deckId, frontText, backText})}><SaveRoundedIcon sx={{ color: 'black' }} /></IconButton>
                        <IconButton onClick={() => deleteCard(card.id)}><DeleteRoundedIcon sx={{ color: 'black' }} /></IconButton>
                      </Box>
                    </Box>
                  </>
                }
              </Paper>
            ))
          )
        )
      }

      {!create ? <></> : 
      <Paper sx={paperStyle}>
        <Box sx={editCardStyle}>
          <TextField label="Front text" onChange={(e) => setFrontText(e.target.value)} sx={{ color: 'black' }} />
          <TextField label="Back text" onChange={(e) => setBackText(e.target.value)} sx={{ outline: 'black' }} />
          <Box>
            <IconButton onClick={() => createCard({deckId, frontText, backText})}><AddBoxRoundedIcon sx={{ color: 'black' }} /></IconButton>
            <IconButton onClick={() => setCreate(false)}><DeleteRoundedIcon sx={{ color: 'black' }} /></IconButton>
          </Box>
        </Box></Paper>}

      {cards === null ? <></> : 
        <Fab aria-label="add" size="medium" onClick={() => setCreate(true)} disabled={create}
          sx={{backgroundColor: 'black', color: 'white', '&:hover': {backgroundColor: '#333'}}}>
        <AddRoundedIcon />
        </Fab> }
    </Box>
  );
}

const paperStyle = {
  padding: 2, 
  marginBottom: 2, 
  backgroundColor: '#f9f9f9', 
  boxShadow: 8, 
  cursor: 'pointer',
  '&:hover': { boxShadow: 3 }
}

const editCardStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: 1
}