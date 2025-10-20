import { draw } from "../../main";
import Board from "../board";
import { PieceByValue } from "../fen";
import type { HoveredSquare } from "../mouse";
import { updateStatusText, updateTurnText } from "../ui";
import { isLowerCase, normalizeUInd, Rank } from "../utilities";
import { filterSafeMoves, rivalKingCheck, wrapLegalMoves } from "./legal-moves";
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
  public check: 'w' | 'b' = null;
  //public board: Board = new Board('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
  public board: Board = new Board('8/8/8/8/8/8/7p/7K');
  constructor() {
  }

  public getTurn() { return this.turn; }

  public changeTurn() {
    this.turn = this.turn === 'w' ? 'b' : 'w';
    updateTurnText(`${this.turn === 'w' ? "White's" : "Black's"} Turn`);
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

  public updateCheck(newPosition: number) {
    const rivalColor = this.turn === 'w' ? 'b' : 'w';
    const legalMoves = wrapLegalMoves(this.selectedPiece.piece, newPosition, this.turn);
    const inCheck = rivalKingCheck(this.turn, legalMoves);
    this.check = inCheck ? rivalColor : null;
    console.log('Check Status:', inCheck);
    if (this.check) {
      updateStatusText(`${this.check === 'w' ? "White" : "Black"} is in Check!`);
    } else {
      updateStatusText(``);
    }
  }

  public dropPiece(square: HoveredSquare) {
    if (!this.selectedPiece) return;
    const { rank, file } = square;
    const newPosition = normalizeUInd({ rank: Rank[rank], file }) - 1;
    const legalMoves = this.getLegalMoves();

    if (!legalMoves.includes(newPosition)) {
      this.cancelMove();
    } else {
      this.updateCheck(newPosition);
      this.board.popIndex(this.selectedPiece.position);
      this.board.movePiece(this.selectedPiece.piece, newPosition);
      this.selectedPiece = null;
      this.draggin = false;
      this.changeTurn();
    }
  }

  public simulateMove(newPosition: number, cb: any) {
    if (!this.selectedPiece) return;
    const oldPiece = this.board.getPieceAt(newPosition);
    this.board.popIndex(this.selectedPiece.position);
    this.board.movePiece(this.selectedPiece.piece, newPosition);
    const result = cb();
    this.board.popIndex(newPosition);
    this.board.movePiece(this.selectedPiece.piece, this.selectedPiece.position);
    if (oldPiece) {
      this.board.movePiece(oldPiece ? oldPiece : 0, newPosition);
    } else {
      this.board.popIndex(newPosition);
    }
    return result;
  }

  public cancelMove() {
    if (!this.selectedPiece) return;
    this.board.movePiece(this.selectedPiece.piece, this.selectedPiece.position);
    this.selectedPiece = null;
  }

  public getLegalMoves() {

    if (!this.selectedPiece || !this.isPieceTurn()) return [];
    const legalMoves = getValidMoves(this.selectedPiece);

    return legalMoves;

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
