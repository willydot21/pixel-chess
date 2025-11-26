import { draw, gameController, sheetByColor, sheetInfo, square } from "../../../main";
import { applyOffset, updateConstants } from "../../board/constants";
import { use } from "../../canvas";
import type { IPieceInfo } from "../../types";
import { getCoords, getUiPosition, isLowerCase } from "../../utilities";
import { isKingInCheck } from "../legal-moves";

export interface IPromotionModal {
  sx: number;
  sy: number;
  width: () => number;
  height: () => number;
}

interface IHovered {
  sx: number;
  sy: number;
  type: string;
}

interface IRookPromotion {
  color: 'w' | 'b';
  position: number;
}

export class PromotionController {

  private status = false;
  public onSelect = null;
  private hovered = {
    sx: null,
    sy: null,
    type: null
  };
  private modal: IPromotionModal = {
    sx: null,
    sy: null,
    width: null,
    height: null,
  }

  private rookPromotions: IRookPromotion[] = [];

  public getStatus() {
    return this.status;
  }

  public updateHovered(newHovered: { sx: number, sy: number, type: string } | null) {
    if (!newHovered) {
      this.hovered = {
        sx: null,
        sy: null,
        type: null
      }
    } else {
      this.hovered = newHovered;
    }
  }

  public getModal() { return this.modal; }

  public update(selectedPiece: IPieceInfo) {

    this.status = this.canPromote(selectedPiece);

    this.setPromotionModal(selectedPiece);

  }

  public drawHovered() {
    const { sx, sy } = this.hovered;
    const { width } = this.modal;

    if (!sx || !sy) return;

    use(ctx => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(sx, sy, width(), width());
    });
  }

  public drawPromotion() {

    const { sx: x, sy: y, width, height } = this.modal;
    const color = gameController.getTurn();
    const pieces = color === 'w' ? 'nrbq'.split('') : 'NRBQ'.split('');
    const pieceSheet = sheetByColor(color);
    const { squareSize } = updateConstants();
    const [ofsX, ofsY] = [squareSize / 4, -(squareSize / 8)];

    use(ctx => {
      ctx.fillStyle = 'rgba(0, 0, 0, .8)';
      ctx.fillRect(x + 2, y + 2, width(), height());
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(x, y, width(), height());
    });

    pieces.forEach((piece, index) => {
      const { sx, sy } = sheetInfo[piece];
      pieceSheet.drawSubSprite(
        sx, sy,
        16, 32,
        x + ofsX, (y + ofsY) + squareSize * index,
        squareSize / 2, squareSize
      );
    });
  }

  public isPromotedRook({ pieceColor, position }: IPieceInfo) {
    const target = this.rookPromotions.findIndex(({ color, position: pos }) => {
      return (color === pieceColor) && (pos === position);
    });
    return target !== -1;
  }

  public updateRookPromotions({ piece, pieceColor, position: tgPosition }: IPieceInfo, newPosition: number) {
    if (piece.toLowerCase() !== 'r') return;
    const target = this.rookPromotions.findIndex(({ color, position }) => {
      return (color === pieceColor) && (position === tgPosition);
    });
    if (target !== -1) {
      this.rookPromotions[target].position = newPosition;
    }
  }

  private handleRookPromotion(newPosition: number, promotion: string) {
    if (promotion.toLowerCase() === 'r') {
      const color = isLowerCase(promotion) ? 'b' : 'w';
      this.rookPromotions.push({
        color,
        position: newPosition,
      });
    }
  }
  // CONSOLE ERROR: WIDTH IS NOT A FUNCTION ON MODAL CALLS, INVOLVES MOUSE MODULES.

  private verifyPromotion(selectedPiece: IPieceInfo, newPosition: number, promotion: string) {
    const prevPiece = selectedPiece.piece;
    selectedPiece.piece = promotion;
    const kingCheck = gameController.board.simulateMove(selectedPiece, newPosition, () => {
      return isKingInCheck(selectedPiece.pieceColor, gameController.board.getKing(selectedPiece.pieceColor).position);
    });
    if (kingCheck) {
      selectedPiece.piece = prevPiece;
      return false;
    }
    return true;
  }

  private resetPromotion() {
    gameController.cancelMove();
    this.reset(true);
  }

  public waitForSelection(
    cb: (s: string) => void,
    verifyInfo: { piece: IPieceInfo, newPosition: number } = null, // REQUIRED FOR VERIFYING PROMOTION
  ) {
    if (!this.onSelect) {
      this.onSelect = () => {
        const target = this.promotionTarget();
        const legalPromotion = this.verifyPromotion(verifyInfo.piece, verifyInfo.newPosition, target);

        if (!legalPromotion) return this.resetPromotion();

        this.handleRookPromotion(verifyInfo.newPosition, target);

        cb(target);
        this.resetModal();
      }
    }
  }

  public reset(promotionList = false) {
    this.resetModal();
    this.status = false;
    if (promotionList) {
      this.rookPromotions = [];
    }
  }

  private promotionTarget() {
    if (!this.hovered.type) return;

    const { type } = this.hovered as IHovered;
    const color = gameController.getTurn();
    const piece = color === 'w' ? type.toUpperCase() : type;

    return piece;
  }

  private resetModal() {
    this.hovered = { sx: null, sy: null, type: null };
    this.status = false;
    this.modal = { sx: null, sy: null, width: null, height: null }
    this.onSelect = null;
    draw();
  }

  private canPromote(selectedPiece: IPieceInfo) {

    const { piece, pieceColor, position } = selectedPiece;

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

      this.modal = {
        sx: applyOffset(rank - 1),
        sy: applyOffset(file + 1),
        width: () => updateConstants().squareSize,
        height: () => updateConstants().squareSize * 4
      }
    }
  }
}