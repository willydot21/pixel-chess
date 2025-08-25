
import { isLowerCase } from "../utilities";
import { bishopLegalMoves, kingLegalMoves, knightLegalMoves, pawnLegalMoves, queenLegalMoves, rookLegalMoves } from "./legal-moves";

interface IPieceInfo {
  piece: string;
  position: number;
}

export const getValidMoves = ({ piece, position: oldIndex }: IPieceInfo) => {

  const pieceColor = isLowerCase(piece) ? 'b' : 'w';
  let legalMoves: number[];

  if ('pP'.includes(piece)) {
    legalMoves = pawnLegalMoves(pieceColor, oldIndex);
  }

  else if ('rR'.includes(piece)) {
    legalMoves = rookLegalMoves(pieceColor, oldIndex);
  }

  else if ('bB'.includes(piece)) {
    legalMoves = bishopLegalMoves(pieceColor, oldIndex);
  }

  else if ('nN'.includes(piece)) {
    legalMoves = knightLegalMoves(pieceColor, oldIndex);
  }

  else if ('qQ'.includes(piece)) {
    legalMoves = queenLegalMoves(pieceColor, oldIndex);
  }

  else {
    legalMoves = kingLegalMoves(pieceColor, oldIndex);
  }

  return legalMoves;
}