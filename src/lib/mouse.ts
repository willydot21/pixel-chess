
import { draw, movePiece, gameController } from "../main";
import { applyOffset, aproximateValue, mouseOnBoard, updateConstants } from "./board/constants";
import { canvas } from "./canvas";
import { ReverseRank } from "./utilities";

export interface HoveredSquare { sx?: number, sy?: number, rank?: string, file?: number }

export var mousePosition = { x: null, y: null };
export var hoveredSquare: HoveredSquare = {
  rank: null, file: null, sx: null, sy: null
}

export var hoveredPromotionPiece = {
  sx: null,
  sy: null,
  type: null
};

const updatePromotionPiece = (e: MouseEvent) => {
  e.preventDefault();
  const { x, y } = updateMousePosition(e);
  if (mouseOnBoard(x, y)) {

  }
}

const updateMousePosition = (e: MouseEvent) => {
  if (!e.target) return;



  const rect = (e.target as HTMLElement).getBoundingClientRect();
  // NOTE! currentTarget != target.


  const canvasRect = canvas.getBoundingClientRect(); // Get canvas position and size relative to the viewport
  const scaleX = canvas.width / canvasRect.width;    // Calculate the horizontal scale factor
  const scaleY = canvas.height / canvasRect.height;  // Calculate the vertical scale factor

  //console.log(canvasRect.width, canvas.width)

  mousePosition = {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }

  return mousePosition;
}

const updateHoveredSquare = (e: MouseEvent) => {
  e.preventDefault();
  const { x, y } = updateMousePosition(e);
  if (mouseOnBoard(x, y)) {
    const scaleOffset = -3.4;
    const rankVal = aproximateValue(x);
    const file = aproximateValue(y) - 1;
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

  if (gameController.promotion.getStatus()) return;

  gameController.selectPiece(hoveredSquare);
}


const mouseMove = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (gameController.promotion.getStatus()) {


    return;
  };

  updateHoveredSquare(e);
  if (gameController.draggin && gameController.selectedPiece) {
    movePiece(gameController.selectedPiece);
  }
}


canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mousedown', select);
canvas.addEventListener('mouseup', e => {
  e.preventDefault();
  e.stopPropagation();

  if (gameController.selectedPiece && !gameController.promotion.getStatus()) {
    gameController.dropPiece(hoveredSquare);
    draw();
  }
})