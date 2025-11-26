
export class ChessCursor {

  private state = null;

  private sources = {
    default: '/public/assets/cursor/default.png',
    grab: '/public/assets/cursor/grab.png',
    hover: '/public/assets/cursor/hover.png',
  }

  constructor() {
    this.setCursor('default');
  }

  public setCursor(type: 'default' | 'grab' | 'hover') {
    if (this.state === type) return;
    this.state = type;
    document.body.style.cursor = `url(${this.sources[type]}), auto`;
  }


}