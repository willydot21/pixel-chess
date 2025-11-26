
export class ChessCursor {

  private sources = {
    default: 'public/assets/cursor/default.png',
    grab: 'public/assets/cursor/grab.png',
    hover: 'public/assets/cursor/hover.png',
  }

  private cursorCss = document.body.style.cursor;

  constructor() {
    this.setCursor('default');
  }

  public setCursor(type: 'default' | 'grab' | 'hover') {
    this.cursorCss = `url(${this.sources[type]}), auto`;
  }


}