
import { gameController } from "../../../main";
import type { IPieceInfo } from "../../types";
import { isEmpty, isKingInCheck } from "../legal-moves";

type CastlingMove = ['left' | 'right', {
  king: number,
  rook: number
}]


export function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

export class CastlingController {

  private canCastle = {
    white: {
      left: false,
      right: false
    },
    black: {
      left: false,
      right: false
    }
  }

  private piecesState = {
    whiteKing: false,
    blackKing: false,
    whiteLeftRook: false,
    whiteRightRook: false,
    blackLeftRook: false,
    blackRightRook: false
  }

  private initialPositions = {
    white: {
      king: 60,
      rooks: [56, 63],
    },
    black: {
      king: 4,
      rooks: [0, 7]
    }
  }

  public updateState(selectedPiece: IPieceInfo) {
    const target = this.getInvolvedPiece(selectedPiece);

    if (!target) return;

    this.piecesState[target] = true;

  }

  private sideByPosition(position: number) {
    const { white, black } = this.initialPositions;

    const colorTarget = position < 56 ? black.rooks : white.rooks;
    const indexed = colorTarget.indexOf(position)

    if (!indexed) return;

    return (indexed === 0) ? 'Left' : 'Right';
  }

  private getInvolvedPiece(selectedPiece: IPieceInfo) {

    const { pieceColor, piece, position } = selectedPiece;
    const isInvolvedPiece = 'rRkK'.includes(piece);

    if (!isInvolvedPiece) return null;

    const color = pieceColor === 'w' ? 'white' : 'black';
    const type = piece.toLowerCase() === 'k' ? 'King' : 'Rook';
    const side = (type !== 'King') && this.sideByPosition(position);
    const target = color + side + type;

    return target;

  }

  private safeSideCastling(color: 'white' | 'black', side: 'left' | 'right') {

    const colorFix = color === 'white' ? 'w' : 'b';
    const sideIndex = side === 'left' ? 0 : 1;
    const kingPos = this.initialPositions[color].king
    const rookPos = this.initialPositions[color].rooks[sideIndex];
    let square = kingPos;

    while (square !== rookPos) {
      const isOccupied = !isEmpty(square)
        && (square !== kingPos);
      const dangerSquare = isKingInCheck(colorFix, square);

      if (isOccupied || dangerSquare) return false;

      kingPos > rookPos ? square-- : square++;
    }

    return true;

  }

  public getCastlingState() {
    return this.canCastle;
  }

  public updateCastling() {

    const { blackKing, blackLeftRook, blackRightRook,
      whiteKing, whiteRightRook, whiteLeftRook
    } = this.piecesState;

    this.canCastle.white.left = !whiteKing && !whiteLeftRook
      && this.safeSideCastling('white', 'left');

    this.canCastle.white.right = !whiteKing && !whiteRightRook
      && this.safeSideCastling('white', 'right');

    this.canCastle.black.left = !blackKing && !blackLeftRook
      && this.safeSideCastling('black', 'left');

    this.canCastle.black.right = !blackKing && !blackRightRook
      && this.safeSideCastling('black', 'right');
  }

  public getCastlingMoves({ pieceColor, piece, position }: IPieceInfo) {

    if (!(piece.toLowerCase() === 'k')) return;

    const color = pieceColor === 'w' ? 'white' : 'black';
    const left = position - 2;
    const right = position + 2;

    const castlingMoves = {
      left: {
        king: left,
        rook: left + 1
      },
      right: {
        king: right,
        rook: right - 1
      }
    }

    const isAllowed = (direction: 'left' | 'right') => this.canCastle[color][direction] && [direction, castlingMoves[direction]] as CastlingMove;

    return [
      isAllowed('left'),
      isAllowed('right')
    ].filter(el => typeof el !== 'boolean');

  }

  private isKing(piece: string) {
    return piece.toLowerCase() === 'k';
  }

  private isRook(piece: string) {
    return piece.toLowerCase() === 'r';
  }

  private getDirectionByRookIndex(rookIndex: number) {
    const asBlack = this.initialPositions.black.rooks.indexOf(rookIndex);
    const asWhite = this.initialPositions.white.rooks.indexOf(rookIndex);

    if ((asBlack + asWhite) === -2) return null;

    return (asBlack === 0) || (asWhite === 0) ? 'left' : 'right';
  }

  public checkCastlingMove(
    selectedPiece: IPieceInfo,
    newPosition: number) {

    const { piece, pieceColor } = selectedPiece;

    if (!this.isKing(piece)) return false;

    const targetSquare = gameController.board.getPieceAt(newPosition);

    if (!this.isRook(targetSquare)) return false;

    const moves = this.getCastlingMoves(selectedPiece);

    if (!moves.length) return false;

    const direction = this.getDirectionByRookIndex(newPosition);
    const targetMove = moves.filter(([dir,]) => dir === direction);

    if (!(targetMove.length)) return false;

    return targetMove[0];

  }

  public doCastling(selectedPiece: IPieceInfo, move: CastlingMove) {

    const { position, piece, pieceColor } = selectedPiece;
    const color = pieceColor === 'w' ? 'white' : 'black';
    const indexByDirection = (dir: 'left' | 'right') => dir === 'left' ? 0 : 1;
    const [direction, { king: kingPos, rook: rookPos }] = move;
    const index = indexByDirection(direction);
    const oldRookIndex = this.initialPositions[color].rooks[index];
    const rook = gameController.board.getPieceAt(oldRookIndex);
    const targetking = camelize(pieceColor + 'king');
    const targetRook = camelize(pieceColor + direction + 'rook');

    gameController.board.popIndex(oldRookIndex);
    gameController.board.movePiece(rook, rookPos);
    gameController.board.popIndex(position);
    gameController.board.movePiece(piece, kingPos);

    this.piecesState[targetking] = true;
    this.piecesState[targetRook] = true;

  }

}