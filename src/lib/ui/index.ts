import { draw, gameController } from "../../main";


export const { $, $$ } = {
  $: (selector: string) => document.querySelector(selector),
  $$: (selector: string) => document.querySelectorAll(selector)
}

const statusText = $('#status') as HTMLSpanElement;
export const updateStatusText = (text: string) => {
  statusText.textContent = text;
  return statusText;
}

const turnText = $('#turn') as HTMLSpanElement;
export const updateTurnText = (text: string) => {
  turnText.textContent = text;
  return turnText;
}


export const startButton = $('#newGame') as HTMLButtonElement;
startButton.addEventListener('click', () => {
  gameController.resetGame();
  draw();
});