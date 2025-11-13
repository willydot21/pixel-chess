import { draw } from "../../main";
import Board from "../board";
import { PieceByValue } from "../fen";
import type { HoveredSquare } from "../mouse";
import type { IPieceInfo } from "../types";
import { updateStatusText, updateTurnText } from "../ui";
import { isLowerCase, normalizeUInd, Rank } from "../utilities";
import { forcedMate, isKingInCheck } from "./legal-moves";
import { getValidMoves } from "./move";
import { isPassantMove, isPawnPassantable } from "./special moves";
import { CastlingController } from "./special moves/castling";

export class GameController {

  private turn: 'w' | 'b' = 'b';
  private moveLog = [];
  public selectedPiece: IPieceInfo | null = null;
  public draggin = false;
  public check: 'w' | 'b' = null;
  public checkMate: 'w' | 'b' = null;
  private legalMoves: number[] = [];
  public board: Board = new Board();
  private passantTarget: number | null = null;
  public playStatus: 'playing' | 'finished' = 'playing';
  public castling = new CastlingController();

  constructor() {
  }

  public getTurn() { return this.turn; }

  public getPassantTarget() { return this.passantTarget; }

  public updatePassantTarget(newPosition: number | null) {

    if (!(this.selectedPiece.piece.toLowerCase() === 'p')) {
      this.passantTarget = null;
      return;
    };

    if (isPassantMove(this.selectedPiece.pieceColor, newPosition)) {
      this.board.popIndex(this.passantTarget);
      this.passantTarget = null;
      return;
    }

    const passantTarget = isPawnPassantable(this.selectedPiece, newPosition) ? newPosition : null;
    this.passantTarget = passantTarget;
  }

  public checkState() {
    const rivalColor = this.turn === 'w' ? 'b' : 'w'
    const selfKing = isKingInCheck(this.turn);
    const opponent = isKingInCheck(rivalColor);

    if (!selfKing && !opponent) {
      this.check = null;
    } else {
      this.check = selfKing ? this.turn : rivalColor;
    }

    const mateSelf = forcedMate(this.turn);
    const mateRival = forcedMate(rivalColor);

    if (!mateSelf && !mateRival) {
      this.checkMate = null;
      return;
    }

    this.checkMate = selfKing ? this.turn : rivalColor;
    this.playStatus = 'finished';

  }

  public init() {
    this.checkState();
    this.updateBoardInfo();
  }

  public changeTurn() {
    this.turn = this.turn === 'w' ? 'b' : 'w';
    this.checkState();
    this.castling.updateCastling();
    this.updateBoardInfo();
    draw();
  }

  public updateBoardInfo() {
    updateTurnText(`${this.turn === 'w' ? "White's" : "Black's"} Turn`);
    if (this.checkMate) {
      updateStatusText(`${this.checkMate === 'b' ? "Black" : "White"} is in Checkmate!`);
    }
    else if (this.check) {
      updateStatusText(`${this.check === 'w' ? "White" : "Black"} is in Check!`);
    } else {
      updateStatusText(``);
    }
  }

  public selectPiece(square: HoveredSquare) {
    const { rank, file } = square;
    const position = normalizeUInd({ rank: Rank[rank], file }) - 1;
    const piece = this.board.getBoard()[position];
    if (!piece) return null;

    this.selectedPiece = { piece: PieceByValue[piece], position, pieceColor: isLowerCase(PieceByValue[piece]) ? 'b' : 'w' };
    this.board.popIndex(position);
    this.toggleDragging();
    this.legalMoves = this.getLegalMoves();

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

    if (newPosition === this.selectedPiece.position) {
      this.cancelMove();
      return;
    }

    this.updatePassantTarget(newPosition);

    const kingCheck = this.board.simulateMove(this.selectedPiece, newPosition, () => {
      return isKingInCheck(this.selectedPiece.pieceColor, this.board.getKing(this.selectedPiece.pieceColor).position);
    });

    const castlingMove = this.castling.checkCastlingMove(this.selectedPiece, newPosition);

    if (castlingMove && (this.selectedPiece.pieceColor === this.turn)) {
      this.castling.doCastling(this.selectedPiece, castlingMove);
      this.selectedPiece = null;
      this.draggin = false;
      this.legalMoves = [];
      this.changeTurn();
      return;
    }

    if (kingCheck || !this.legalMoves.includes(newPosition) || (this.playStatus === 'finished')) {
      this.cancelMove();

    } else {
      this.board.popIndex(this.selectedPiece.position);
      this.board.movePiece(this.selectedPiece.piece, newPosition);
      this.castling.updateState(this.selectedPiece);
      this.selectedPiece = null;
      this.draggin = false;
      this.legalMoves = [];
      this.changeTurn();
    }
  }

  public cancelMove() {
    if (!this.selectedPiece) return;
    this.board.movePiece(this.selectedPiece.piece, this.selectedPiece.position);
    this.selectedPiece = null;
    this.legalMoves = [];
  }

  public getLegalMoves() {

    if (!this.selectedPiece || !this.isPieceTurn() || (this.playStatus === 'finished')) return [];

    if (this.legalMoves.length) return this.legalMoves;

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

  public finishGame(winner: 'w' | 'b') {
    this.playStatus = 'finished';
  }

  public resetGame(fen?: string) {
    this.turn = 'w';
    this.moveLog = [];
    this.selectedPiece = null;
    this.draggin = false;
    this.check = null;
    this.checkMate = null;
    this.playStatus = 'playing';
    this.board = new Board(fen);
    this.init();
  }

  public getBoard() {
    return this.board.getBoard();
  }

}
