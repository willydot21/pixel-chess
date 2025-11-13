
// type LeIdentifier = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

import { genFromFen, Piece, PieceByValue } from "../fen";
import type { IPieceInfo } from "../types";
import { indexesOf, isLowerCase } from "../utilities";


class BoardState {

  protected moves = [];
  protected turn: 'w' | 'b'; // white or black

  constructor() {

  }

  // INFO CLASS

  // MOVES LOG
  // UPDATE BOARD
  // TURN

}

export default class Board extends BoardState {

  private style: 'plain' | 'persp';
  private variant: number;
  private board: number[];

  constructor(initFen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') {
    super();
    this.board = genFromFen(initFen);
  }

  public getBoard() {
    return this.board;
  }

  public create(fen: string) {
  }

  public updateStyle(newStyle: 'plain' | 'persp') {
    // change it
  }

  public updateVariant(newVariant: number) {
    // change it
  }

  public simulateMove(piece: IPieceInfo, newPosition: number, cb: any) {

    const { position, piece: pieceType } = piece;
    const oldPiece = this.getPieceAt(newPosition);

    this.popIndex(position);
    this.movePiece(pieceType, newPosition);
    const result = cb();
    this.popIndex(newPosition);
    this.movePiece(pieceType, position);
    if (oldPiece) {
      this.movePiece(oldPiece, newPosition);
    }
    return result;
  }

  public movePiece(piece: string, ind: number) {
    this.board[ind] = Piece[piece];
  }

  public popIndex(ind: number) {
    this.board[ind] = 0;
  }

  public getPieceAt(ind: number): string | null {
    const pieceValue = this.board[ind];
    if (!pieceValue) return null;
    return PieceByValue[pieceValue] || null;
  }

  public getKing(color: 'b' | 'w'): IPieceInfo {
    const id = color === 'b' ? -6 : 6;
    const piece = PieceByValue[id];
    const index = this.getIndexById(id) as number;
    return { piece, position: index, pieceColor: color };
  }

  public getIndexById(id: number) {
    return indexesOf(id);
  }

  public reverseMap() { return [...this.board].reverse(); }

  public getVariant() { return this.variant; }

  public getStyle() { return this.style; };

}