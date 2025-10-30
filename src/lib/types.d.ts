
export type BOARD_VARIANT = 1 | 2 | 3 | 4 | 5;

export interface ISheetParameters {
  color: 'black' | 'white';
  size: 'sm' | 'md';
  style: 'simplified' | 'wood' | 'wood-simplified' | 'default';
}

export interface IPieceInfo {
  piece: string;
  position: number;
  pieceColor: 'w' | 'b';
}