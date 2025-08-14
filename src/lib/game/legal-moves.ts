import { gameBoard } from "../../main";
import { getCoords, isLowerCase } from "../utilities";
import { Piece, PieceByValue } from "../fen";

type PieceColor = 'w' | 'b';

const directions = {
  north: -8,
  south: 8,
  west: -1,
  east: 1
}

export const calculateEdgesDistance = (index: number) => {
  const { rankVal, file } = getCoords(index + 1);
  return {
    north: file - 1,
    south: 8 - file,
    west: rankVal - 1,
    east: 8 - rankVal
  }
}

const hasDistance = (index: number, direction: 'west' | 'east' | 'north' | 'south') => {
  return calculateEdgesDistance(index)[direction] > 0;
}


export const moveNorth = (index: number, times: number = 1) => {
  return index + directions.north * times;
}

export const moveSouth = (index: number, times: number = 1) => {
  return index + directions.south * times;
}

export const moveDiagonal = (index: number, direction: 'ne' | 'nw' | 'se' | 'sw', times: number = 1) => {
  const verDir = direction[0] === 'n' ? directions.north : directions.south;
  const horDir = direction[1] === 'e' ? directions.east : directions.west;
  return index + (verDir * times) + (horDir * times);
}

export const isEmpty = (index: number) => {
  return gameBoard.getBoard()[index] === 0;
}

export const hasFriendlyPiece = (index: number, pieceColor: PieceColor) => {
  const target = PieceByValue[gameBoard.getBoard()[index]];

  if (!target) return;

  const targetColor = isLowerCase(target) ? 'b' : 'w';

  return targetColor === pieceColor;
}

export const pawnFirstMove = (index: number, pieceColor: PieceColor) => {
  const whiteSide = (index > 7) && (index < 16) && pieceColor == 'b';
  const blackSide = (index > 47) && (index < 56) && pieceColor == 'w';

  return whiteSide || blackSide;

}

const outBoard = (index: number) => (index < 0 || index > 63);

export const pawnLegalMoves = (pieceColor: PieceColor, index: number) => {

  const moves = {
    white: {
      single: moveNorth(index),
      double: moveNorth(index, 2),
      diag: [moveDiagonal(index, 'ne'), moveDiagonal(index, 'nw')]
    },
    black: {
      single: moveSouth(index),
      double: moveSouth(index, 2),
      diag: [moveDiagonal(index, 'se'), moveDiagonal(index, 'sw')]
    }
  }

  const { single, double, diag } = pieceColor === 'w' ? moves.white : moves.black;

  const canMoveDiag = (move: number, horDirection: 'west' | 'east') => {
    return (
      !isEmpty(move)
      && hasDistance(index, horDirection) // With board edges
      && !hasFriendlyPiece(move, pieceColor)
      && !outBoard(move)
    ) && move
  };

  const legalMoves = [
    canMoveDiag(diag[0], 'east'),
    canMoveDiag(diag[1], 'west'),
    isEmpty(single) && single,
    (isEmpty(double) && pawnFirstMove(index, pieceColor) && isEmpty(single)) && double
  ].filter(Boolean);

  console.log('legal moves for pawn:', legalMoves, pieceColor);

  return legalMoves;

}

export const rookLegalMoves = (pieceColor: PieceColor, index: number) => {

  const edges = calculateEdgesDistance(index);
}