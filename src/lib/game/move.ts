
import { filterSafeMoves, wrapLegalMoves } from "./legal-moves";

interface IPieceInfo {
  piece: string;
  position: number;
  pieceColor: 'w' | 'b';
}

export const getValidMoves = ({ piece, position: oldIndex, pieceColor }: IPieceInfo) => {

  const legalMoves = wrapLegalMoves(piece, oldIndex, pieceColor);
  if (piece.toLowerCase() === 'k') {
    const king = { piece, position: oldIndex, pieceColor };
    return filterSafeMoves(king, legalMoves);
  }

  return legalMoves;
}
