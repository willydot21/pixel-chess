
import { gameBoard, draw, movePiece } from "../main";
import constants, { applyOffset, aproximateValue, mouseOnBoard } from "./board/constants";
import { canvas } from "./canvas";
import { PieceByValue } from "./fen";
import { getValidMoves } from "./game/move";
import { normalizeUInd, Rank, ReverseRank } from "./utilities";

interface HoveredSquare { sx?: number, sy?: number, rank?: string, file?: number }

const { offset } = constants;
export var mousePosition = { x: null, y: null };
export var hoveredSquare: HoveredSquare = {
  rank: null, file: null, sx: null, sy: null
}
export var playerColor = 'white'; // THIS COULD BE DYNAMICALLY SET LATER
export var selectedPiece: string = null;
export var previousIndex: number = null;
export var draggin = false;
export var legalMoves: number[] = [];

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

const updatePiece = ({ piece, position }: { piece: string, position: number }) => {

  selectedPiece = piece;
  previousIndex = position;
  gameBoard.popIndex(previousIndex);
  legalMoves = getValidMoves(selectedPiece, { oldIndex: previousIndex, newIndex: position });

  return { piece, index: position };
}

const select = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  const { rank, file } = hoveredSquare;
  const position = normalizeUInd({ rank: Rank[rank], file }) - 1;
  const piece = gameBoard.getBoard()[position];

  if (piece !== 0) {
    updatePiece({ piece: PieceByValue[piece], position });
    toggleDrag();
  }
}

const toggleDrag = () => {
  if (selectedPiece) {
    draggin = true;
    return;
  }

  draggin = false;
}


const mouseMove = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  updateHoveredSquare(e)
  if (draggin) {
    movePiece(selectedPiece, previousIndex);
  }
}

const cancelMove = () => {
  if (!selectedPiece) return;
  gameBoard.movePiece(selectedPiece, previousIndex);
}

const dropPiece = () => {
  const { file, rank } = hoveredSquare;
  const position = normalizeUInd({ rank: Rank[rank], file }) - 1;
  const piece = gameBoard.getBoard()[position];
  // console.log('legal moves for pawn:', legalMoves);

  if (!legalMoves.includes(position)) {
    cancelMove();
  } else {
    gameBoard.movePiece(selectedPiece, position);
  }
}

canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mousedown', select);
canvas.addEventListener('mouseup', e => {
  e.preventDefault();
  e.stopPropagation();
  if (!selectedPiece) return;
  dropPiece();
  legalMoves = [];
  selectedPiece = null;
  previousIndex = null;
  draggin = false;
  draw();
})