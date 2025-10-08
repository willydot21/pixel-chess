import { canvas } from "../canvas.ts";

const scale = 1.69 * window.devicePixelRatio;
var boardSize = 142, borderOff = 0, borderOffPercent = 0, fixBoardSize = 0, squareSize = 0, offset = 0,
  width = canvas.clientWidth;


export default { boardSize, borderOff, borderOffPercent, fixBoardSize, squareSize, scale, offset };

export const updateConstants = () => {
  width = canvas.clientWidth;
  boardSize = 142;
  borderOffPercent = (14 * 100 / boardSize) / 100;
  borderOff = boardSize * borderOffPercent;
  fixBoardSize = (boardSize - borderOff) * scale;
  squareSize = (fixBoardSize / 8);
  offset = (borderOff / 2) * scale;
  return { boardSize, borderOff, borderOffPercent, fixBoardSize, squareSize, scale, offset };
}

export const applyOffset = (n: number) => {
  const { squareSize, offset } = updateConstants();
  return (n * squareSize) + offset;
};
export const aproximateValue = (n: number) => {

  const cordFix = n - updateConstants().offset;
  const div = Math.trunc(cordFix / squareSize);
  const divRest = cordFix % squareSize;
  return divRest === 0 ? div : div + 1;
}
export const mouseOnBoard = (x: number, y: number) => {
  const canvasRect = canvas.getBoundingClientRect();
  const scaleFactor = canvas.width / canvasRect.width;
  const offset = (canvas.width * (borderOffPercent));
  console.log(x)
  const boardWithOffset = (width - offset);
  const xInBoard = (x > offset) && (x < boardWithOffset);
  const yInBoard = (y > offset) && (y < boardWithOffset);
  return xInBoard && yInBoard;
}