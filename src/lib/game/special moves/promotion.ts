import { gameController } from "../../../main";
import { applyOffset, updateConstants } from "../../board/constants";
import type { IPieceInfo } from "../../types";
import { getCoords, getUiPosition } from "../../utilities";

export class PromotionController {

  private status = false;
  private hovered: null;
  private promotionTarget: null;
  private promotionModal = {
    sx: null,
    sy: null,
    width: null,
    height: null,
  }

  public getStatus() {
    return this.status;
  }

  private canPromote({ piece, pieceColor, position }: IPieceInfo) {

    if (
      !(piece.toLowerCase() === 'p')
      || !(pieceColor === gameController.getTurn())
    ) return;

    const targetFile = {
      w: 8,
      b: 1
    }[pieceColor];

    let { file, rank: rank } = getCoords(getUiPosition(position));
    pieceColor === 'w' ? file++ : file--;

    return file === targetFile;

  }

  private setPromotionModal(selectedPiece: IPieceInfo) {
    const { pieceColor: color } = selectedPiece;
    if (this.status) {
      let { rankVal: rank, file } = getCoords(getUiPosition(selectedPiece.position));
      color === 'w' ? file++ : file;
      file = 8 - file;

      if (color === 'b') file -= 4;

      this.promotionModal = {
        sx: applyOffset(rank - 1),
        sy: applyOffset(file + 1),
        width: () => updateConstants().squareSize,
        height: () => updateConstants().squareSize * 4
      }
    }
  }


  public update(selectedPiece: IPieceInfo) {

    this.status = this.canPromote(selectedPiece);

    this.setPromotionModal(selectedPiece);

  }

  public promote() {

    // DRAW MODAL LOGIC
    // HANDLE MOUSE EVENTS
    // UPDATE PRIVATE STATE VARIABLES


  }
}