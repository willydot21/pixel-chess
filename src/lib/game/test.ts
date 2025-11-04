import type { GameController } from "./controller";

interface IMateFen {
  fen: string;
  expectedMate: boolean;
  detectedMate: boolean,
  testPassed: boolean
  message: string;
}

const mateFen = [
  {
    fen: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR'
  },
  {
    fen: 'rnbqkbnr/ppppp2p/5p2/6pQ/3PP3/8/PPP2PPP/RNB1KBNR'
  },
  {
    fen: 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR'
  },
  {
    fen: 'rnbqkbnr/ppppp3/7p/5p1Q/3PP2p/8/PPP2PPP/RN2KNNR'
  },
  {
    fen: 'rnb1k1nr/ppp2ppp/8/8/8/2N3b1/PPPPP3/R1BQKBNR'
  },
  {
    fen: 'r1bqkb1r/pp1npppp/2pN1n2/8/3P4/8/PPP1QPPP/R1B1KBNR',
  },
  {
    fen: 'r1b1kbnr/pppp1Npp/8/8/4q3/5n2/PPPPBP1P/RNBQKR2'
  },
  {
    fen: 'rn1qkb1r/p1ppp2P/1p4B1/7n/3P4/8/PPP2PbP/RNB1K1NR'
  },
  {
    fen: 'r1b1k1nr/pppp1ppp/2n5/4P3/8/2Q2N2/P1P1PPPP/RNq1KB1R'
  },
  {
    fen: 'r1b1k2r/ppppqppp/2n5/8/1PP2B2/3n1N2/1P1NPPPP/R2QKB1R'
  }
];

const testFEN = (game: GameController, fen: string, expectedMate: boolean) => {
  game.resetGame(fen);
  const isMate = game.checkMate !== null;
  const testPassed = isMate === expectedMate;
  const message = `FEN: ${fen} | Expected Mate: ${expectedMate} | Detected Mate: ${isMate} | Test ${testPassed ? 'Passed' : 'Failed'}`;
  return {
    fen,
    expectedMate,
    detectedMate: isMate,
    testPassed,
    message
  };
}

const printResults = (results: IMateFen[], showOnlyFailed: boolean = false) => {
  results.forEach(result => {

    if (!result.testPassed) console.log(result.message);

    if (showOnlyFailed) return;

    console.log(result.fen, result.testPassed ? '✅' : '❌');

  });
}

export function test(gameController: GameController) {
  console.log("Running test...");

  const results: IMateFen[] = [];

  // Test forced mate detection
  mateFen.forEach(({ fen }) => {
    results.push(testFEN(gameController, fen, true));
  });

  printResults(results, true);

  console.log(
    `${results.filter(r => r.testPassed).length} out of ${results.length} tests passed.`
  )

  gameController.resetGame();
  console.log("Test completed.");

}