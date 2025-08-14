
// type LeIdentifier = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

import { genFromFen, Piece } from "../fen";


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

  public movePiece(piece: string, ind: number) {
    this.board[ind] = Piece[piece];
  }

  public popIndex(ind: number) {
    this.board[ind] = 0;
  }

  public reverseMap() { return [...this.board].reverse(); }

  public getVariant() { return this.variant; }

  public getStyle() { return this.style; };

}