const getPlayerScore = (diaminoes) => {
  return diaminoes.reduce((sum, diamino) => sum + diamino.points, 0);
};

export { getPlayerScore };
