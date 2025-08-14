const boardSize = 142;
const scale = 5;
const fixBoardSize = (boardSize - 14) * scale;
const squareSize = (fixBoardSize / 8);
const offset = 7 * scale;


export default {
  boardSize,
  scale,
  fixBoardSize,
  squareSize,
  offset
}

export const applyOffset = (n: number) => n * squareSize + offset;
export const aproximateValue = (n: number) => {
  const div = Math.trunc(n / squareSize);
  const divRest = n % squareSize;
  return divRest === 0 ? div : div + 1;
}
export const mouseOnBoard = (x: number, y: number) => {
  const boardWithOffset = boardSize * scale - offset;
  const xInBoard = (x > offset) && (x < boardWithOffset);
  const yInBoard = (y > offset) && (y < boardWithOffset);
  return xInBoard && yInBoard;
}