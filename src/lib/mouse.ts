
import { draw, movePiece, gameController } from "../main";
import constants, { applyOffset, aproximateValue, mouseOnBoard } from "./board/constants";
import { canvas } from "./canvas";
import { ReverseRank } from "./utilities";

export interface HoveredSquare { sx?: number, sy?: number, rank?: string, file?: number }

const { offset } = constants;
export var mousePosition = { x: null, y: null };
export var hoveredSquare: HoveredSquare = {
  rank: null, file: null, sx: null, sy: null
}


const updateMousePosition = (e: MouseEvent) => {
  if (!e.target) return;

  const rect = (e.target as HTMLElement).getBoundingClientRect();
  // NOTE! currentTarget != target.

  mousePosition = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }

  return mousePosition;
}

const updateHoveredSquare = (e: MouseEvent) => {

  const { x, y } = updateMousePosition(e);
  if (mouseOnBoard(x, y)) {
    const scaleOffset = -8;
    const rankVal = aproximateValue(x - offset);
    const file = aproximateValue(y - offset) - 1;
    const sx = applyOffset(rankVal - 1) + scaleOffset;
    const sy = applyOffset(file) + scaleOffset;
    hoveredSquare = {
      rank: ReverseRank[rankVal],
      file: 8 - file,
      sx, sy
    };
    draw();
  }
}

const select = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  gameController.selectPiece(hoveredSquare);
}


const mouseMove = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  updateHoveredSquare(e)
  if (gameController.draggin && gameController.selectedPiece) {
    movePiece(gameController.selectedPiece);
  }
}


canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mousedown', select);
canvas.addEventListener('mouseup', e => {
  e.preventDefault();
  e.stopPropagation();

  gameController.dropPiece(hoveredSquare);
  draw();
})