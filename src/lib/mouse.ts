
import { draw, movePiece, gameController } from "../main";
import { applyOffset, aproximateValue, mouseOnBoard, updateConstants } from "./board/constants";
import { canvas } from "./canvas";
import type { IPromotionModal } from "./game/special moves/promotion";
import { ReverseRank } from "./utilities";

export interface HoveredSquare { sx?: number, sy?: number, rank?: string, file?: number }

export var mousePosition = { x: null, y: null };
export var hoveredSquare: HoveredSquare = {
  rank: null, file: null, sx: null, sy: null
}

const mouseOnModal = ({
  sx, sy, width, height
}: IPromotionModal) => {

  const { x, y } = mousePosition;
  const xInModal = (x > sx) && (x < (sx + width()));
  const yInModal = (y > sy) && (y < (sy + height()));
  return xInModal && yInModal;
}

const getHoveredPromotion = ({ sy, sx }: IPromotionModal) => {
  let { y } = mousePosition;
  const { squareSize } = updateConstants();
  const pieceOrderMap = {
    1: 'n', 2: 'r', 3: 'b', 4: 'q'
  }
  y = y - sy;

  const aproximatedSquare = Math.trunc(y / squareSize) + 1;

  return {
    type: pieceOrderMap[aproximatedSquare],
    sx: sx,
    sy: sy + (aproximatedSquare - 1) * squareSize
  };
}

const updateHoveredProm = (e: MouseEvent) => {
  const { x, y } = updateMousePosition(e);
  const modal = gameController.promotion.getModal()

  if (mouseOnBoard(x, y) && mouseOnModal(modal)) {
    const hovered = getHoveredPromotion(modal);
    gameController.promotion.updateHovered(hovered);
    draw();
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

  if (
    gameController.promotion.getStatus()
    && mouseOnModal(gameController.promotion.getModal())
  ) {
    gameController.promotion.onSelect();
  };

  gameController.selectPiece(hoveredSquare);
}


const mouseMove = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (gameController.promotion.getStatus()) {
    updateHoveredProm(e);
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