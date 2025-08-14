const sources = {
  wP: "assets/16x32/WhitePieces-Sheet.png",
  bP: "assets/16x32/BlackPieces-Sheet.png",
  bdP: "assets/boards/board_plain_01.png",
  cr: "assets/128x128/cross.png",
  sOv: "assets/72x72/square.png",
}

const loadSpriteImage = (spriteSrc: string, zIndex: number) =>
  new Promise<HTMLImageElement>((resolve, _) => {
    const sprite = new Image();
    sprite.style.zIndex = zIndex.toString();
    sprite.src = spriteSrc;
    sprite.onload = () => {
      resolve(sprite);
    }
  }
  );


export const loadSprites = async () => {

  const { wP, bP, bdP, sOv } = sources;


  const wPieces = await loadSpriteImage(wP, 1000);
  const bPieces = await loadSpriteImage(bP, 1000);
  const board = await loadSpriteImage(bdP, 100);
  const squareOver = await loadSpriteImage(sOv, 111);

  return {
    wPieces, bPieces, board, squareOver
  }

}