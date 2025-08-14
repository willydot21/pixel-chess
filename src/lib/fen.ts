
import { isNumber } from "./utilities";

export enum Piece {
  p = -1,
  b = -2,
  n = -3,
  r = -4,
  q = -5,
  k = -6,
  P = 1,
  B = 2,
  N = 3,
  R = 4,
  Q = 5,
  K = 6
}

export const PieceByValue = Object.entries(Piece).reduce((pieceRev, [key, val]) => {
  pieceRev[val] = key;
  return pieceRev;
}, {});

export const genFromFen = (fen: string) => {

  let boardMap: number[] = [];

  for (let ch of fen) {
    if (isNumber(ch)) {
      const emptySquares = new Array(parseInt(ch, 10)).fill(0);
      boardMap = boardMap.concat(emptySquares);
    } else if (ch !== '/') {
      boardMap.push(Piece[ch]);
    }
  }

  return boardMap;
}

export const createFen = (boardMap: number[]) => {

  let fen = '';
  let emptySquares = 0;

  boardMap.forEach((el, posIndex) => {

    if (el === 0) emptySquares++;
    else {
      if (emptySquares) {
        fen += emptySquares;
        emptySquares = 0;
      }
      fen += PieceByValue[el];
    }

    if (!((posIndex + 1) % 8)) { // END OF RANK
      if (emptySquares) {
        fen += emptySquares.toString();
        emptySquares = 0;
      }
      if (posIndex + 1 < 64) fen += '/';
    }

  });

  return fen;
}
