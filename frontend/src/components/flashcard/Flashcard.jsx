import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Paper, Chip, Box, Button } from '@mui/material';

import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import CelebrationIcon from '@mui/icons-material/Celebration';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { getCards, updateCard } from '../../routes/CardRoutes';
import Loader from '../../Loader';
import { shuffleArray } from '../../utils';

const Flashcard = () => {
  const { deckId } = useParams();
  const [cards, setCards] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [counter, setCounter] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const option = JSON.parse(params.get('option') || '{}');
  
  const fetchData = async () => {
      try {
        let res = [];

        if (option === 'FSRS') {
          res = (await getCards(deckId, true)).data;
          setCurrentCard(res[res.length - 1]);
        } else {
          res = (await getCards(deckId, false)).data;
          if (counter < res.length) setCurrentCard(res[counter])
        } 

        if (!initialized && option === 'Random') {
          res = shuffleArray(res);
          setCurrentCard(res[counter])
        }
        setInitialized(true);
        setCards(res);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
      }
    };

  useEffect(() => {
    fetchData();
  }, [deckId]);

  const handleArrowClick = async (direction) => {
    if (option === 'FSRS' || !cards) return;

    let nextIndex = counter;

    if (direction === 'left') {
      nextIndex = Math.max(counter - 1, 0);
    } else if (direction === 'right') {
      nextIndex = Math.min(counter + 1, cards.length - 1);
    }

    setCounter(nextIndex);
    setCurrentCard(cards[nextIndex]);
    setFlipped(false);
  };

  const handleChipClick = async (rating) => {
    if (!currentCard) return;

    try {
      await updateCard(currentCard.id, currentCard.front_text, currentCard.back_text, deckId, rating, true);
      fetchData()
      setFlipped(false);
    } catch (err) {
      console.error('Failed to update card:', err);
    }
  };

  return (
    <StyledWrapper>
      {cards === null ? <Loader /> :
        (currentCard ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 30 }}>
              {option !== 'FSRS' ? <Button sx={{backgroundColor: 'black', borderRadius: '50%', width: '30px', height: '60px', color: 'white', '&:disabled': {backgroundColor: '#c2c2c2ff'} }} onClick={() => handleArrowClick('left')} disabled={counter === 0}><KeyboardArrowLeftIcon sx={{fontSize: '40px'}} /></Button> : null}

              <div className="card" onClick={() => setFlipped(!flipped)}>
                <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
                  <Paper className="card-front" sx={{ boxShadow: 20, '&:hover': {boxShadow: 3} }}>
                    <p>{currentCard.front_text}</p>
                  </Paper>
                  <Paper className="card-back" sx={{ boxShadow: 8, '&:hover': {boxShadow: 3} }}>
                    <p>{currentCard.back_text}</p>
                  </Paper>
                </div>
              </div>

              {option !== 'FSRS' ? <Button sx={{ backgroundColor: 'black', borderRadius: '50%', width: '30px', height: '60px', color: 'white', '&:disabled': {backgroundColor: '#c2c2c2ff'} }} onClick={() => handleArrowClick('right')} disabled={counter === cards.length - 1}><KeyboardArrowRightIcon sx={{fontSize: '40px'}} /></Button> : null}
            </div>

            {option !== 'FSRS' ? null :
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip label={<Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}><SentimentVeryDissatisfiedIcon sx={{fontSize: '18px', color: 'white'}}/> Again</Box>} onClick={() => handleChipClick(1)} sx={{color: 'white', backgroundColor: 'black', '&:hover': {backgroundColor: 'gray'}}} />

                <Chip label={<Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}><MoodBadIcon sx={{fontSize: '18px', color: 'white'}}/> Hard</Box>} onClick={() => handleChipClick(2)} sx={{color: 'white', backgroundColor: 'black', '&:hover': {backgroundColor: 'gray'} }} />

                <Chip label={<Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}><SentimentSatisfiedAltIcon sx={{fontSize: '18px', color: 'white'}}/> Good</Box>} onClick={() => handleChipClick(3)} sx={{color: 'white', backgroundColor: 'black', '&:hover': {backgroundColor: 'gray'}}} />

                <Chip label={<Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}><SentimentVerySatisfiedIcon sx={{fontSize: '18px', color: 'white'}}/> Easy</Box>} onClick={() => handleChipClick(4)} sx={{color: 'white', backgroundColor: 'black', '&:hover': {backgroundColor: 'gray'}}} />
              </Box>
            }
          </>
        ) : (
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <CelebrationIcon sx={{fontSize: '50px'}} />
            <h1>All done for now!</h1>
            <CelebrationIcon sx={{fontSize: '50px'}} />
          </Box>
        ))
      }
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