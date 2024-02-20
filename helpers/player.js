const getPlayerScore = (diaminoes) => {
  return diaminoes.reduce((sum, diamino) => sum + diamino.points, 0);
};

// pushDiamino(diamino) {
//   this.diaminoes.push(diamino);
// }
//
// popDiamino() {
//   return this.diaminoes.pop();
// }

export { getPlayerScore };
