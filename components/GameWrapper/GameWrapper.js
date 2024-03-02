import Game from '../Game';
import GameOver from '../GameOver';
import {GameState} from '../../helpers/types';
import {GameStateContext} from '../../providers/GameStateProvider';
import React from "react";

const GameWrapper = () => {
  const {    gameState  } = React.useContext(GameStateContext);

  if (gameState === GameState.GameOver) {
    return <GameOver/>
  }

  return <Game />;
};

export default GameWrapper;
