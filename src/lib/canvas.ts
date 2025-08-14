import type { ContextCallback, DrawImageParams } from "../types.d.ts";

export const canvas = document.querySelector('#chess') as HTMLCanvasElement;
export const context = canvas.getContext('2d');

export const use = (cb: ContextCallback) => {
  if (!context) {
    throw new Error("Context doesn't exists.");
  } else {
    cb(context);
  }
}

export const drawImage = (...args: DrawImageParams) => {
  use(ctx => { ctx.drawImage(...args) });
}
