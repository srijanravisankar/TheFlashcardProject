import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Paper, Chip, Box } from '@mui/material';

import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

import { getCards, updateCard } from '../../routes/CardRoutes';

const Flashcard = () => {
  const { deckId } = useParams();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  
  const fetchData = async () => {
      try {
        const res = (await getCards(deckId, true)).data;
        console.log(res);
        setCards(res);
        setCurrentCard(res[res.length - 1]);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
      }
    };

  // Fetch cards once
  useEffect(() => {
    fetchData();
  }, [deckId]);

  const handleChipClick = async (rating) => {
    if (!currentCard) return;

    try {
      console.log(currentCard)
      await updateCard(currentCard.id, currentCard.front_text, currentCard.back_text, deckId, rating, true);
      fetchData()
      setFlipped(false);
    } catch (err) {
      console.error('Failed to update card:', err);
    }
  };

  return (
    <StyledWrapper>
      {currentCard ? (
        <>
          <div className="card" onClick={() => setFlipped(!flipped)}>
            <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
              <Paper className="card-front" sx={{ boxShadow: 20 }}>
                <p>{currentCard.front_text}</p>
              </Paper>
              <Paper className="card-back" sx={{ boxShadow: 8 }}>
                <p>{currentCard.back_text}</p>
              </Paper>
            </div>
          </div>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* <Chip label="😟 Again" onClick={() => handleChipClick(1)} />
            <Chip label="😕 Hard" onClick={() => handleChipClick(2)} />
            <Chip label="😊 Good" onClick={() => handleChipClick(3)} /> */}

            <Chip label={<Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}><SentimentVeryDissatisfiedIcon sx={{fontSize: '18px', color: 'white'}}/> Again</Box>} onClick={() => handleChipClick(1)} sx={{color: 'white', backgroundColor: 'black'}} />

            <Chip label={<Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}><MoodBadIcon sx={{fontSize: '18px', color: 'white'}}/> Hard</Box>} onClick={() => handleChipClick(2)} sx={{color: 'white', backgroundColor: 'black'}} />

            <Chip label={<Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}><SentimentSatisfiedAltIcon sx={{fontSize: '18px', color: 'white'}}/> Good</Box>} onClick={() => handleChipClick(3)} sx={{color: 'white', backgroundColor: 'black'}} />

            <Chip label={<Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}><SentimentVerySatisfiedIcon sx={{fontSize: '18px', color: 'white'}}/> Easy</Box>} onClick={() => handleChipClick(4)} sx={{color: 'white', backgroundColor: 'black'}} />
          </Box>
        </>
      ) : (
        <h2>All done! 🎉</h2>
      )}
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 50px;

  .card {
    width: 600px;
    height: 400px;
    perspective: 1000px;
    cursor: pointer;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.3s;
  }

  .card-inner.flipped {
    transform: rotateY(180deg);
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 8px;
  }

  .card-front {
    background-color: black;
    color: #fff;
    transform: rotateY(0deg);
  }

  .card-back {
    background-color: rgb(230, 230, 230);
    color: #000;
    transform: rotateY(180deg);
  }
`;

export default Flashcard;