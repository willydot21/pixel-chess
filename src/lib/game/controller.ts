import Board from "../board";
import { PieceByValue } from "../fen";
import type { HoveredSquare } from "../mouse";
import { normalizeUInd, Rank } from "../utilities";
import { getValidMoves } from "./move";

interface IPieceInfo {
  piece: string;
  position: number;
}

export class GameController {

  private turn: 'w' | 'b' = 'w';
  private moveLog = [];
  public selectedPiece: IPieceInfo | null = null;
  public draggin = false;
  public board: Board = new Board('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');

  constructor() {
  }

  public getTurn() { return this.turn; }

  public changeTurn() {
    this.turn = this.turn === 'w' ? 'b' : 'w';
  }

  public selectPiece(square: HoveredSquare) {
    const { rank, file } = square;
    const position = normalizeUInd({ rank: Rank[rank], file }) - 1;
    const piece = this.board.getBoard()[position];
    if (!piece) return null;


    this.selectedPiece = { piece: PieceByValue[piece], position };
    this.board.popIndex(position);
    this.toggleDragging();

    return piece;
  }

  public isPieceTurn() {
    if (!this.selectedPiece) return false;
    const pieceColor = this.selectedPiece.piece === this.selectedPiece.piece.toLowerCase() ? 'b' : 'w';
    return pieceColor === this.turn;
  }

  public dropPiece(square: HoveredSquare) {
    if (!this.selectedPiece) return;
    const { rank, file } = square;
    const newPosition = normalizeUInd({ rank: Rank[rank], file }) - 1;

    if (!this.getLegalMoves().includes(newPosition)) {
      this.cancelMove();
    } else {
      this.board.popIndex(this.selectedPiece.position);
      this.board.movePiece(this.selectedPiece.piece, newPosition);
      this.selectedPiece = null;
      this.draggin = false;
      this.changeTurn();
    }
  }

  public cancelMove() {
    if (!this.selectedPiece) return;
    this.board.movePiece(this.selectedPiece.piece, this.selectedPiece.position);
    this.selectedPiece = null;
  }

  public getLegalMoves() {
    if (!this.selectedPiece || !this.isPieceTurn()) return [];
    return getValidMoves(this.selectedPiece);
  }

  public logMove(oldIndex: number, newIndex: number) {
    this.moveLog.push({ oldIndex, newIndex });
  }

  public getMoveLog() { return this.moveLog; }

  private toggleDragging() {
    if (this.selectedPiece) {
      this.draggin = true;
      return;
    }

    this.draggin = false;
  }

  public getBoard() {
    return this.board.getBoard();
  }

}
