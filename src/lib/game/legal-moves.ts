import { gameBoard } from "../../main";
import { getCoords, isLowerCase } from "../utilities";
import { PieceByValue } from "../fen";

type PieceColor = 'w' | 'b';
interface IEdges {
  north: number;
  south: number;
  west: number;
  east: number;
}

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

export const moveEast = (index: number, times: number = 1) => {
  return index + directions.east * times;
}

export const moveWest = (index: number, times: number = 1) => {
  return index + directions.west * times;
}

const move = {
  north: moveNorth,
  south: moveSouth,
  east: moveEast,
  west: moveWest
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

const getCrossMoves = (
  dir: 'north' | 'south' | 'west' | 'east',
  pos: number,
  times: number,
  pieceColor: PieceColor
) => {
  const moveCb = move[dir]; // times ?= 7
  const positions = [];

  for (let mult = 1; mult <= times; mult++) {
    const square = moveCb(pos, mult);
    const hasRivalPiece = !isEmpty(square) && !hasFriendlyPiece(square, pieceColor);

    if (isEmpty(square) || hasRivalPiece) positions.push(square);

    if (!isEmpty(square)) break;
  }

  return positions;
}
const generateCross = (index: number, edges: IEdges, pieceColor: PieceColor) => {

  return {
    north: getCrossMoves('north', index, edges.north, pieceColor),
    south: getCrossMoves('south', index, edges.south, pieceColor),
    east: getCrossMoves('east', index, edges.east, pieceColor),
    west: getCrossMoves('west', index, edges.west, pieceColor)
  }

}

export const pawnLegalMoves = (pieceColor: PieceColor, index: number) => {
  const moves = {
    white: {
      single: move.north(index),
      double: move.north(index, 2),
      diag: [moveDiagonal(index, 'ne'), moveDiagonal(index, 'nw')]
    },
    black: {
      single: move.south(index),
      double: move.south(index, 2),
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

  return legalMoves;

}

export const rookLegalMoves = (pieceColor: PieceColor, index: number) => {

  const edges = calculateEdgesDistance(index);

  const { north, east, west, south } = generateCross(index, edges, pieceColor);

  return [].concat(north, east, west, south)

}