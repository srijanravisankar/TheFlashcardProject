import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Typography, Paper, CircularProgress, IconButton } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import api from '../api';

export default function Deck() {
  const { deckId } = useParams();
  const [cards, setCards] = useState();

  useEffect(() => {
    api
      .get(`/cards?deck_id=${deckId}`)
      .then((res) => setCards(res.data))
      .catch((err) => console.error('Failed to fetch cards:', err));
  }, [deckId]);

  // const handleDelete = (id) => {
  //   api
  //     .delete(`/cards/${id}`)
  //     .then((res) => setCards(res.data))
  //     .catch((err) => console.error('Failed to delete card:', err));
  // }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Deck {deckId}:
      </Typography>

      {
        cards ? (
          cards.length === 0 ? (
            <Typography>No cards found.</Typography>
          ) : (
            cards.map((card) => (
              <Paper
                key={card.id}
                onClick={() => console.log('card clicked', card.id)}
                sx={{padding: 2, marginBottom: 2, backgroundColor: '#f9f9f9', boxShadow: 1, cursor: 'pointer','&:hover': { boxShadow: 3 },}}
              >
                <Typography><strong>Q:</strong> {card.front_text}</Typography>
                <Typography><strong>A:</strong> {card.back_text}</Typography>
                <IconButton onClick={() => handleDelete(card.id)}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
                <IconButton onClick={() => console.log('update button clicked', card.id)}>
                  <EditRoundedIcon />
                </IconButton>
              </Paper>
            ))
          )
        ) : <CircularProgress />
      }
    </Box>
  );
}