import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Typography, Paper, CircularProgress, IconButton, TextField } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import api from '../api';

export default function Deck() {
  const { deckId } = useParams();

  const [cards, setCards] = useState(null);
  const [edit, setEdit] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');


  useEffect(() => getCards(), [deckId]);

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
        setEdit(false);
      })
      .catch((err) => console.error('Failed to update card:', err));
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Deck {deckId}:
      </Typography>

      {
        cards === null ?  <CircularProgress /> : (
          cards.length === 0 ? (
            <Typography>No cards found.</Typography>
          ) : (
            cards.map((card) => (
              <Paper key={card.id} onClick={() => console.log('card clicked', card.id)} sx={paperStyle}>
                {!edit ? <>
                    <Box sx={editCardStyle}>
                      <Typography><strong>Q:</strong> {card.front_text}</Typography>
                      <Typography><strong>A:</strong> {card.back_text}</Typography>
                      <Box>
                        <IconButton onClick={() => setEdit(true)}><EditRoundedIcon /></IconButton>
                        <IconButton onClick={() => deleteCard(card.id)}><DeleteOutlineRoundedIcon /></IconButton>
                      </Box>
                    </Box>
                  </> : <>
                    <Box sx={editCardStyle}>
                      <TextField label="Front text" onChange={(e) => setFrontText(e.target.value)} />
                      <TextField label="Back text" onChange={(e) => setBackText(e.target.value)} />
                      <Box>
                        <IconButton onClick={() => updateCard(card.id, {deckId, frontText, backText})}><SaveRoundedIcon /></IconButton>
                        <IconButton onClick={() => deleteCard(card.id)}><DeleteOutlineRoundedIcon /></IconButton>
                      </Box>
                    </Box>
                  </>
                }
              </Paper>
            ))
          )
        )
      }
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
  gap: 2 
}