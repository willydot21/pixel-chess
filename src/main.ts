
import { Sprite } from "./lib/sprite.ts";
import { PieceByValue } from "./lib/fen.ts";
import { getCoords, isLowerCase } from "./lib/utilities.ts";
import constants, { applyOffset } from "./lib/board/constants.ts";
import { use } from "./lib/canvas.ts";
import { hoveredSquare, mousePosition } from "./lib/mouse.ts";
import { GameController } from "./lib/game/controller.ts";

const { squareSize, boardSize, scale } = constants;

const sources = {
  wP: "assets/16x32/WhitePieces-Sheet.png",
  bP: "assets/16x32/BlackPieces-Sheet.png",
  bdP: "assets/boards/board_plain_01.png",
  cr: "assets/128x128/cross.png",
  sOv: "assets/72x72/square.png",
}

export const sheetInfo = {
  p: {
    sx: 0,
    sy: 0,
  },
  n: {
    sx: 16,
    sy: 0,
  },
  r: {
    sx: 32,
    sy: 0,
  },

  b: {
    sx: 48,
    sy: 0,
  },
  q: {
    sx: 64,
    sy: 0,
  },
  k: {
    sx: 80,
    sy: 0,
  },

  P: {
    sx: 0,
    sy: 0,
  },
  N: {
    sx: 16,
    sy: 0,
  },
  R: {
    sx: 32,
    sy: 0,
  },

  B: {
    sx: 48,
    sy: 0,
  },
  Q: {
    sx: 64,
    sy: 0,
  },
  K: {
    sx: 80,
    sy: 0,
  },
}

const boardSpr = new Sprite(sources.bdP, 0, 0, boardSize * scale, boardSize * scale);
const wPieces = new Sprite(sources.wP, 0, 0, 16, 32);
const bPieces = new Sprite(sources.bP, 0, 0, 16, 32);
const square = new Sprite(sources.sOv, 0, 0, squareSize * 1.2, squareSize * 1.2);
export const gameController = new GameController();

export const drawLegalMoves = (legalMoves: number[]) => {
  const fixSquare = (squareSize / 2);
  legalMoves.forEach(move => {
    const { rankVal, file } = getCoords(move + 1);
    let [x, y] = [applyOffset(rankVal) - fixSquare, applyOffset(file - 1) + fixSquare];
    use(ctx => {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowColor = "black";
      ctx.shadowBlur = 10;
      ctx.lineJoin = "bevel";
      ctx.lineWidth = 3;
      ctx.strokeRect(x - fixSquare, y - fixSquare, squareSize, squareSize);
      ctx.shadowBlur = 0;
    });
  });
}

const drawHoveredSquare = () => {
  const { sx, sy } = hoveredSquare;

  if (!sx || !sy) return;

  square.x = sx;
  square.y = sy;
  square.draw();
}

const drawPiece = (pieceId: number, indexPos: number) => {

  const piece = PieceByValue[pieceId];
  const pieceSheet = isLowerCase(piece) ? bPieces : wPieces;
  const { sx, sy } = sheetInfo[piece];
  const { rankVal, file } = getCoords(indexPos + 1);
  let [x, y] = [applyOffset(rankVal - 1), applyOffset(file - 1)];
  const [offsetX, offsetY] = [squareSize / 4, -(squareSize / 8)];

  pieceSheet.drawSubSprite(
    sx, sy,
    16, 32,
    x + offsetX,
    y + offsetY,
    squareSize / 2,
    squareSize);

}

export const movePiece = ({ piece }: { piece: string, position: number }) => {
  const { x, y } = mousePosition;
  const pieceSheet = isLowerCase(piece) ? bPieces : wPieces;
  const { sx, sy } = sheetInfo[piece];
  const centerX = x - squareSize / 4;
  const centerY = y - (squareSize / 4) * 2;

  draw();
  pieceSheet.drawSubSprite(sx, sy, 16, 32, centerX, centerY, squareSize / 2, squareSize);
}

export const draw = () => {
  const board = gameController.getBoard();
  use(ctx => {
    ctx.clearRect(0, 0, 1008, 1008);
    ctx.imageSmoothingEnabled = false;
    boardSpr.draw();
    board.forEach((el, indexPos) => {
      if (el !== 0) drawPiece(el, indexPos);
    });
    drawHoveredSquare();
    drawLegalMoves(gameController.getLegalMoves() || []);
  });
}

const main = async () => {

  await Sprite.load();

  draw();

}

main();