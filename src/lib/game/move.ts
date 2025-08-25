import { selectedPiece, previousIndex } from "../mouse";
import { isLowerCase } from "../utilities";
import { bishopLegalMoves, kingLegalMoves, knightLegalMoves, pawnLegalMoves, queenLegalMoves, rookLegalMoves } from "./legal-moves";


interface IMove {
  oldIndex: number;
  newIndex: number;
}

export const getValidMoves = (piece: string = selectedPiece, { oldIndex = previousIndex, newIndex }: IMove) => {

  const pieceColor = isLowerCase(piece) ? 'b' : 'w';
  let legalMoves: number[];

  console.log(oldIndex, newIndex);

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
    console.log(legalMoves);
  }

  return legalMoves;
}