import { draw, gameController, sheetByColor, sheetInfo, square } from "../../../main";
import { applyOffset, updateConstants } from "../../board/constants";
import { use } from "../../canvas";
import type { IPieceInfo } from "../../types";
import { getCoords, getUiPosition, isLowerCase } from "../../utilities";

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

  private rookPromotions = [];

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

  public trackRookPromotions(selectedPiece: IPieceInfo, newPosition) {
  }

  // FIX PROMOTION CASTLING ERRORS

  public handleRookPromotion(newPosition: number, promotion: string) {
    if (promotion.toLowerCase() === 'r') {
      const color = isLowerCase(promotion) ? 'b' : 'w';
      this.rookPromotions.push({
        color,
        position: newPosition,
        piece: promotion,
        like: (pos: number, piece: string) => {
          return (piece === promotion) && (pos === newPosition)
        }
      });
    }
  }

  public wait(cb: (s: string) => void) {
    if (!this.onSelect) {
      this.onSelect = () => {
        cb(this.promotionTarget());
        this.reset();
      }
    }
  }

  private promotionTarget() {
    if (!this.hovered.type) return;

    const { type } = this.hovered as IHovered;
    const color = gameController.getTurn();
    const piece = color === 'w' ? type.toUpperCase() : type;

    return piece;
  }

  private reset() {
    this.hovered = { sx: null, sy: null, type: null };
    this.status = false;
    this.modal = { sx: null, sy: null, width: null, height: null }
    this.onSelect = null;
    draw();
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

      this.modal = {
        sx: applyOffset(rank - 1),
        sy: applyOffset(file + 1),
        width: () => updateConstants().squareSize,
        height: () => updateConstants().squareSize * 4
      }
    }
  }
}