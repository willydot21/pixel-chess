
import { isLowerCase } from "../utilities";
import { wrapLegalMoves } from "./legal-moves";

interface IPieceInfo {
  piece: string;
  position: number;
}

export const getValidMoves = ({ piece, position: oldIndex }: IPieceInfo) => {

  const pieceColor = isLowerCase(piece) ? 'b' : 'w';
  const legalMoves = wrapLegalMoves(piece, oldIndex, pieceColor);

  return legalMoves;
}
