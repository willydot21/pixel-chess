
export type ContextCallback<T> = (ctx: CanvasRenderingContext2D) => T;

export type DrawImageParams = Parameters<CanvasRenderingContext2D['drawImage']>
