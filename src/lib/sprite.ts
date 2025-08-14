import { drawImage, use } from "./canvas";

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


export class Sprite {

  static sprites: Sprite[] = [];
  static imagesLoaded = false;
  public source: string;
  public image: HTMLImageElement | null = null;
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public scale: number;

  constructor(src: string, x: number, y: number, width: number, height: number) {
    this.source = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scale = 1
    Sprite.sprites.push(this);
  }

  static async load() {
    let zIn = 10;
    for (let sprite of Sprite.sprites) {
      const image = await loadSpriteImage(sprite.source, zIn);
      sprite.setSpriteImage(image);
      zIn *= 10;
    }
    this.imagesLoaded = true;
  }

  static draw() {
    if (Sprite.imagesLoaded)
      Sprite.sprites.forEach(spr => spr.draw());
  }

  public setSpriteImage(image: HTMLImageElement) {
    this.image = image;
  }

  public draw() {
    if (!Sprite.imagesLoaded) return;
    drawImage(this.image as HTMLImageElement, this.x, this.y, this.width, this.height);
  }

  public drawSubSprite(sx: number, sy: number, sw: number, sh: number,
    x: number, y: number, width: number, height: number) {
    if (!Sprite.imagesLoaded) return;
    drawImage(this.image as HTMLImageElement, sx, sy, sw, sh, x, y, width, height);
  }

}