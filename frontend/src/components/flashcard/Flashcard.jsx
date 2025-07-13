import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Paper, Chip, Box } from '@mui/material';

const Flashcard = () => {
  const [flipped, setFlipped] = useState(false);
  const location = useLocation();
  const cards = location.state?.cards;

  const studyCards = 

  console.log(cards);

  const handleClick = () => {

  }

  return (
    <StyledWrapper>
      <div className="card" onClick={() => setFlipped(!flipped)}>
        <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
          <Paper className="card-front" sx={{boxShadow: 20, '&:hover': { boxShadow: 2 }}}>
            <p>Front Side</p>
          </Paper>
          <Paper className="card-back" sx={{boxShadow: 8, '&:hover': { boxShadow: 3 }}}>
            <p>Back Side</p>
          </Paper>
        </div>
      </div>
      <Box sx={{display: 'flex', gap: 2}}>
        <Chip label="😟 Again" onClick={handleClick} sx={{backgroundColor: 'black', color: 'white', '&:hover': {backgroundColor: 'rgb(65, 65, 65)',}, borderRadius: '8px' }} />
        <Chip label="😕 Hard" onClick={handleClick} sx={{backgroundColor: 'black', color: 'white', '&:hover': {backgroundColor: 'rgb(65, 65, 65)',}, borderRadius: '8px' }} />
        <Chip label="😊 Good" onClick={handleClick} sx={{backgroundColor: 'black', color: 'white', '&:hover': {backgroundColor: 'rgb(65, 65, 65)',}, borderRadius: '8px' }} />
        <Chip label="😎 Easy" onClick={handleClick} sx={{backgroundColor: 'black', color: 'white', '&:hover': {backgroundColor: 'rgb(65, 65, 65)',}, borderRadius: '8px' }} />
      </Box>
    </StyledWrapper>
  );
}

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