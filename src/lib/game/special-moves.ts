import { gameController } from "../../main";
import { moveNorth, moveSouth, pawnFirstMove } from "./legal-moves"

export const isPawnPassantable = ({ pieceColor, position }: {
  pieceColor: 'w' | 'b',
  position: number
}, targetPosition: number
) => {

  if (!pawnFirstMove(position, pieceColor)) return false;

  const steps = pieceColor === 'w' ? moveNorth(position, 2) : moveSouth(position, 2);

  if (steps !== targetPosition) return false;

  return true;

}

export const canDoPassant = (pawnPosition: number) => {
  const passantTarget = gameController.getPassantTarget();

  if (passantTarget === null) return false;

  const neightborPositions = [pawnPosition - 1, pawnPosition + 1];

  return neightborPositions.includes(passantTarget);
}

export const onPassantMove = ({
  pawnPosition,
  pieceColor
}: { pawnPosition: number, pieceColor: 'w' | 'b' }) => {
  if (!canDoPassant(pawnPosition)) return false;
  const passantTarget = gameController.getPassantTarget();
  const newPosition = pieceColor === 'w' ? moveNorth(passantTarget, 1) : moveSouth(passantTarget, 1);
  return newPosition;
}

export const isPassantMove = (pieceColor: 'w' | 'b', newPosition: number) => {
  const passant = gameController.getPassantTarget();
  const passantDest = pieceColor === 'w' ? moveNorth(passant, 1) : moveSouth(passant, 1);
  return passantDest === newPosition;
}