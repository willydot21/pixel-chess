
import { isLowerCase } from "../utilities";
import { filterSafeMoves, wrapLegalMoves } from "./legal-moves";

interface IPieceInfo {
  piece: string;
  position: number;
}

export const getValidMoves = ({ piece, position: oldIndex }: IPieceInfo) => {

  const pieceColor = isLowerCase(piece) ? 'b' : 'w';
  const legalMoves = wrapLegalMoves(piece, oldIndex, pieceColor);
  if (piece.toLowerCase() === 'k') {
    return filterSafeMoves(pieceColor, legalMoves);
  }

  return legalMoves;
}
