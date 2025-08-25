import { gameBoard } from "../../main";
import { getCoords, isLowerCase } from "../utilities";
import { PieceByValue } from "../fen";

type PieceColor = 'w' | 'b';

type Direction = 'north' | 'east' | 'west' | 'south';

interface IEdges {
  north: number;
  south: number;
  west: number;
  east: number;
}

interface IDiagEdges {
  ne: number;
  nw: number;
  se: number;
  sw: number;
}

type Move = [Direction, number];

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

export const calculateDiagEdges = (index: number) => {
  const { north, south, west, east } = calculateEdgesDistance(index);
  return {
    ne: Math.min(north, east),
    nw: Math.min(north, west),
    se: Math.min(south, east),
    sw: Math.min(south, west)
  }
}

const hasDistance = (index: number, direction: 'west' | 'east' | 'north' | 'south', edges?: IEdges) => {
  if (!edges) edges = calculateEdgesDistance(index);
  return edges[direction] > 0;
}

export const moveAlong = (index: number, moves: Move[], edges: IEdges) => {

  let position = index;

  const hasKnightDistance = (pos: number, dir: Direction, dist: number) => {
    const edges = calculateEdgesDistance(pos);
    return edges[dir] >= dist;
  }

  for (let [dir, times] of moves) {
    if (hasKnightDistance(position, dir, times)) {
      position = move[dir](position, times);
    } else {
      return null;
    }
  }

  return position;

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
  const positions: number[] = [];

  for (let mult = 1; mult <= times; mult++) {
    const square = moveCb(pos, mult);
    const hasRivalPiece = !isEmpty(square) && !hasFriendlyPiece(square, pieceColor);

    if (isEmpty(square) || hasRivalPiece) positions.push(square);

    if (!isEmpty(square)) break;
  }

  return positions;
}

const getCrossDiagonal = (
  dir: 'ne' | 'nw' | 'se' | 'sw',
  pos: number,
  times: number,
  pieceColor: PieceColor
) => {

  const positions: number[] = [];

  for (let mult = 1; mult <= times; mult++) {
    const square = moveDiagonal(pos, dir, mult);
    const hasRivalPiece = !isEmpty(square) && !hasFriendlyPiece(square, pieceColor);

    if (isEmpty(square) || hasRivalPiece) positions.push(square);

    if (!isEmpty(square)) break;
  }

  return positions;
}

const generateDiagonalCross = (index: number, edges: IDiagEdges, pieceColor: PieceColor) => {
  return {
    ne: getCrossDiagonal('ne', index, edges.ne, pieceColor),
    nw: getCrossDiagonal('nw', index, edges.nw, pieceColor),
    se: getCrossDiagonal('se', index, edges.se, pieceColor),
    sw: getCrossDiagonal('sw', index, edges.sw, pieceColor),
  }
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

export const bishopLegalMoves = (pieceColor: PieceColor, index: number) => {

  const edges = calculateDiagEdges(index);

  const { ne, nw, sw, se } = generateDiagonalCross(index, edges, pieceColor);

  return [].concat(ne, nw, se, sw);
}

export const knightLegalMoves = (pieceColor: PieceColor, index: number) => {

  const edges = calculateEdgesDistance(index);

  const moves: Move[][] = [
    [['north', 1], ['east', 2]],
    [['north', 2], ['east', 1]],
    [['north', 1], ['west', 2]],
    [['north', 2], ['west', 1]],
    [['south', 1], ['east', 2]],
    [['south', 2], ['east', 1]],
    [['south', 1], ['west', 2]],
    [['south', 2], ['west', 1]],
  ];

  const positions = moves.map(move => moveAlong(index, move, edges));

  const pieceRules = (index: number) =>
    !hasFriendlyPiece(index, pieceColor) &&
    !outBoard(index) &&
    index !== null;

  return positions.filter(pieceRules);
}

export const queenLegalMoves = (pieceColor: PieceColor, index: number) => {
  const edges = calculateEdgesDistance(index);
  const diagEdges = calculateDiagEdges(index);

  const { north, east, west, south } = generateCross(index, edges, pieceColor);
  const { ne, nw, se, sw } = generateDiagonalCross(index, diagEdges, pieceColor);

  return [].concat(north, east, west, south, ne, nw, se, sw);
}

export const kingLegalMoves = (pieceColor: PieceColor, index: number) => {
  const edges = calculateEdgesDistance(index);
  const diagEdges = calculateDiagEdges(index);

  const { north, east, west, south } = generateCross(index, edges, pieceColor);
  const { ne, nw, se, sw } = generateDiagonalCross(index, diagEdges, pieceColor);
  const moves = [north, east, west, south, ne, nw, se, sw].map(move => move[0]).filter(Number);

  return moves;
}