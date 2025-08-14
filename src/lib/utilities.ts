
export enum Rank {
  A = 1,
  B = 2,
  C = 3,
  D = 4,
  E = 5,
  F = 6,
  G = 7,
  H = 8
}

export const ReverseRank = Object.entries(Rank).reduce((revRank, [key, val]) => {
  revRank[val] = key;
  return revRank;
}, {});

export const range = (length: number) => {
  return Array.from({ length }, (v, k) => k + 1);
}

export const isNumber = (ch: string) => ch >= '0' && ch <= '9';

export const isLowerCase = (ch: string) => (ch.toLowerCase() === ch) && (ch.toUpperCase() !== ch);

export const getCoords = (posIndex: number) => {

  const divResult = Math.trunc(posIndex / 8);
  const divRest = posIndex % 8;
  const file = divRest > 0 ? divResult + 1 : divResult;
  const numericRow = !divRest ? 8 : divRest;
  const rank = ReverseRank[numericRow];

  return { rank, file, rankVal: numericRow };

}

export const flipX = (ind: number) => {
  const { rankVal, file } = getCoords(ind);
  const fixRank = 8 - rankVal;
  return (8 * (file - 1) + fixRank);
}

export const normalizeUInd = ({ rank, file }: { rank: number, file: number }) => {
  return ((8 - file) * 8 + (rank));
}

export const getIndexPosition = (coords: { file: number, rank: string }) => {

  const { rank, file } = coords;

  const rankVal = (Rank[rank]);
  const opr = (8 * file + rankVal);

  return opr - 1;

}