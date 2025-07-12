import React, { useState } from 'react';
import styled from 'styled-components';

import { Paper, Chip, Box } from '@mui/material';

const Flashcard = () => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {

  }

  return (
    <StyledWrapper>
      <div className="card" onClick={() => setFlipped(!flipped)}>
        <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
          <Paper className="card-front">
            <p>Front Side</p>
          </Paper>
          <Paper className="card-back">
            <p>Back Side</p>
          </Paper>
        </div>
      </div>
      <Box sx={{display: 'flex', gap: 2}}>
        <Chip label="Again" onClick={handleClick} sx={{backgroundColor: 'rgb(40, 40, 40)', color: 'white', '&:hover': {backgroundColor: 'rgb(133, 133, 133)',}, }} />
        <Chip label="Hard" onClick={handleClick} sx={{backgroundColor: 'rgb(40, 40, 40)', color: 'white', '&:hover': {backgroundColor: 'rgb(133, 133, 133)',}, }} />
        <Chip label="Good" onClick={handleClick} sx={{backgroundColor: 'rgb(40, 40, 40)', color: 'white', '&:hover': {backgroundColor: 'rgb(133, 133, 133)',}, }} />
        <Chip label="Easy" onClick={handleClick} sx={{backgroundColor: 'rgb(40, 40, 40)', color: 'white', '&:hover': {backgroundColor: 'rgb(133, 133, 133)',}, }} />
      </Box>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  height: 100vh;
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
    transition: transform 0.6s;
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
    border-radius: 10px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16),
              0px 3px 6px rgba(0, 0, 0, 0.23);
    transition: box-shadow 0.3s;
  }

  .card-front {
    background-color: rgb(40, 40, 40);
    color: #fff;
    // border: 2px solid rgb(0, 0, 0);
    transform: rotateY(0deg);
  }

  .card-back {
    background-color: rgb(230, 230, 230);
    color: #000;
    // border: 2px solid rgb(200, 200, 200);
    transform: rotateY(180deg);
  }
`;

export default Flashcard;