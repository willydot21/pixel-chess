
import { gameController } from "../../../main";
import type { IPieceInfo } from "../../types";
import { isEmpty, isKingInCheck } from "../legal-moves";

type CastlingMove = ['left' | 'right', {
  king: number,
  rook: number
}]

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
    const fixRookPos = rookPos + Number(side === 'left')
    let square = kingPos;

    while (square !== fixRookPos) {
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

    const isAllowed = (direction: 'left' | 'right') => this.canCastle[color][direction] && [direction, castlingMoves[direction]];

    return [
      isAllowed('left'),
      isAllowed('right')
    ].filter(el => typeof el !== 'boolean');

  }

  public doCastling(
    selectedPiece: IPieceInfo,
    newPosition: number
  ) {

    const { position, piece, pieceColor } = selectedPiece;
    const color = pieceColor === 'w' ? 'white' : 'black';
    const moves = this.getCastlingMoves(selectedPiece);
    const indexByDirection = (dir: 'left' | 'right') => dir === 'left' ? 0 : 1;

    if (!moves.length) return;

    const targetMove = moves.filter(([_, { king }]: CastlingMove) => king === newPosition)[0];

    if (!targetMove.length) return;

    console.log(targetMove[0]);

    // THIS S* SHOULD BE LIKE [DIRECTION, {}];

    const [direction, { }] = targetMove;
    //const index = indexByDirection(direction);
    const oldRookIndex = this.initialPositions[color].rooks[0]



  }

}