import { range } from './utilities';
import type { BOARD_VARIANT, ISheetParameters } from './types';

function loadAssets() {

  const BASE_PATH = '/assets';
  const BOARD_PATH = `${BASE_PATH}/boards`;

  const boardPlain =
    (variant: BOARD_VARIANT) => `${BOARD_PATH}/board_plain_0${variant}`;

  const boardPersp =
    (variant: BOARD_VARIANT) => `${BOARD_PATH}/board_persp_0${variant}`;


  const piecePath = (
    color: 'black' | 'white',
    size: 'sm' | 'md',
    style: 'simplified' | 'wood' | 'wood-simplified' | 'default'
  ) => {

    const colorPath = { 'black': 'BlackPieces', 'white': 'WhitePieces' }[color];
    const styleSuffix =
      (((size === 'sm') && (style !== 'default')) ? '_' : '') +
      ({
        'wood': 'Wood',
        'simplified': 'Simplified',
        'wood-simplified': 'WoodSimplified',
        'default': ''
      }[style]);

    if (size === 'md') return `${BASE_PATH}/16x32/${colorPath}${styleSuffix}-Sheet`;

    return `${BASE_PATH}/16x16/${colorPath}${styleSuffix}`;

  }

  const plainPaths = range(5).map(boardPlain);
  const perspPaths = range(5).map(boardPersp);

  const assets = {
    pieces: {
      sm: {
        black: {
          wood: piecePath('black', 'sm', 'wood'),
          woodSimplified: piecePath('black', 'sm', 'wood-simplified'),
          simplified: piecePath('black', 'sm', 'simplified'),
          default: piecePath('black', 'sm', 'default')
        },
        white: {
          wood: piecePath('white', 'sm', 'wood'),
          woodSimplified: piecePath('white', 'sm', 'wood-simplified'),
          simplified: piecePath('white', 'sm', 'simplified'),
          default: piecePath('white', 'sm', 'default')
        }
      },
      md: {
        black: {
          wood: piecePath('black', 'md', 'wood'),
          default: piecePath('black', 'md', 'default')
        },
        white: {
          wood: piecePath('white', 'md', 'wood'),
          default: piecePath('white', 'md', 'default')
        }
      }
    },
    boards: {
      plain: plainPaths,
      persp: perspPaths
    }
  }

  const selectSheetPath = (
    from: 'tables' | 'pieces',
    { size, color, style }: ISheetParameters): string => {
    return assets[from][size][color][style];
  }

  return { assets, selectSheetPath }

}

export const { selectSheetPath, assets } = loadAssets();