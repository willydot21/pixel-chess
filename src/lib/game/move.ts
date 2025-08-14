import { selectedPiece, previousIndex } from "../mouse";
import { isLowerCase } from "../utilities";
import { pawnLegalMoves, rookLegalMoves } from "./legal-moves";


interface IMove {
  oldIndex: number;
  newIndex: number;
}

export const getValidMoves = (piece: string = selectedPiece, { oldIndex = previousIndex, newIndex }: IMove) => {

  const pieceColor = isLowerCase(piece) ? 'b' : 'w';
  let legalMoves: number[];

  if ('pP'.includes(piece)) {
    legalMoves = pawnLegalMoves(pieceColor, oldIndex);
  }

  else if ('rR'.includes(piece)) {
    legalMoves = rookLegalMoves(pieceColor, newIndex);
  }



  return legalMoves;
}