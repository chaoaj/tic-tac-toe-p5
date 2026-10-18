/*
 * Tic-Tac-Toe in p5.js
 * Purpose: Two-player Tic-Tac-Toe that follows the course SRS
 *          (mouse, touch, and keyboard play; screen-reader announcements;
 *          WCAG 2.2 AA colors).
 * Author:  [Your name]
 * Date:    2026-10-18
 *
 * Structure:
 *   Constants          - colors and sizes (NFR-4.3)
 *   Game logic         - pure functions, no drawing (NFR-4.2, FR-5.5)
 *   p5.js lifecycle    - setup(), draw(), windowResized()
 *   Input              - mouse/touch and keyboard (FR-2.x)
 *   Output             - drawing, announcements, scoreboard (FR-1.x, FR-9.x)
 */

// ---------------------------------------------------------------------------
// Constants (SRS Table 14)
// ---------------------------------------------------------------------------
const COLOR_BG = '#FFFFFF';
const COLOR_GRID = '#333333';
const COLOR_X = '#B00020';      // dark red, 7.3:1 on white
const COLOR_O = '#0B4F9C';      // dark blue, 8.0:1 on white
const COLOR_FOCUS = '#C26A00';  // dark orange, 3.9:1 on white
const COLOR_WIN = '#1B7F3A';    // green, 5.1:1 on white

const MIN_SIZE = 300;           // FR-1.1 minimum canvas size
const MAX_SIZE = 480;
const PAGE_GUTTER = 20;
const GRID_WEIGHT = 4;          // FR-1.2 at least 4 px
const FOCUS_WEIGHT = 4;         // FR-2.7 at least 3 px
const WIN_WEIGHT = 8;
const MARK_SCALE = 0.6;         // FR-1.3 about 60% of a cell

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
  [0, 4, 8], [2, 4, 6]              // diagonals
];

// ---------------------------------------------------------------------------
// Game state (SRS Table 21)
// ---------------------------------------------------------------------------
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameState = 'playing';      // 'playing' | 'won' | 'draw'
let winner = null;
let winLine = null;
let focusIndex = 4;             // FR-2.3 start at center
let scores = { X: 0, O: 0, draws: 0 };
let firstPlayer = 'X';

let canvas;
let canvasHasFocus = false;
let usingKeyboard = false;       // show the focus box only for keyboard users

// ---------------------------------------------------------------------------
// Game logic - no p5.js drawing calls in this section
// ---------------------------------------------------------------------------

/** Returns the winning line [a, b, c] for board b, or null. */
function findWinLine(b) {
  for (const line of WIN_LINES) {
    const [i, j, k] = line;
    if (b[i] !== '' && b[i] === b[j] && b[j] === b[k]) {
      return line;
    }
  }
  return null;
}

/** FR-5.5: pure check. Returns 'X', 'O', 'draw', or null. Win beats draw (FR-5.4). */
function checkWinner(b) {
  const line = findWinLine(b);
  if (line) {
    return b[line[0]];
  }
  return b.every(cell => cell !== '') ? 'draw' : null;
}

/** FR-4.1, FR-4.3 */
function isValidMove(index) {
  return gameState === 'playing' && index >= 0 && index < 9 && board[index] === '';
}

/** Places the current player's mark and updates state. Returns a result object. */
function makeMove(index) {
  if (gameState !== 'playing') {
    return { ok: false, reason: 'over' };
  }
  if (board[index] !== '') {
    return { ok: false, reason: 'taken' };
  }

  const mark = currentPlayer;
  board[index] = mark;

  const result = checkWinner(board);
  if (result === 'X' || result === 'O') {
    gameState = 'won';
    winner = result;
    winLine = findWinLine(board);
    scores[result] += 1;
  } else if (result === 'draw') {
    gameState = 'draw';
    scores.draws += 1;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';   // FR-3.2
  }
  return { ok: true, mark: mark, result: result };
}

/** Clears the board. FR-3.3: the other player starts the next round. */
function resetBoard(alternateFirst) {
  if (alternateFirst) {
    firstPlayer = firstPlayer === 'X' ? 'O' : 'X';
  }
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = firstPlayer;
  gameState = 'playing';
  winner = null;
  winLine = null;
  focusIndex = 4;
}

function resetScores() {
  scores = { X: 0, O: 0, draws: 0 };
  firstPlayer = 'X';
  resetBoard(false);
}

function rowCol(index) {
  return { row: Math.floor(index / 3) + 1, col: (index % 3) + 1 };
}

function cellName(index) {
  const rc = rowCol(index);
  return 'row ' + rc.row + ', column ' + rc.col;
}

function statusText() {
  if (gameState === 'won') return 'Player ' + winner + ' wins!';
  if (gameState === 'draw') return 'It’s a draw.';
  return 'Player ' + currentPlayer + '’s turn';
}

/** FR-9.4: text description of every cell. */
function boardDescription() {
  const parts = [];
  for (let i = 0; i < 9; i++) {
    parts.push(cellName(i) + ': ' + (board[i] === '' ? 'empty' : board[i]));
  }
  return 'Board. ' + parts.join('; ') + '. ' + statusText();
}

// ---------------------------------------------------------------------------
// p5.js lifecycle
// ---------------------------------------------------------------------------
function setup() {
  const size = boardSize();
  canvas = createCanvas(size, size);
  canvas.parent('board');

  // Make the canvas keyboard-focusable and labelled (FR-2.3, NFR-2.2)
  canvas.elt.setAttribute('tabindex', '0');
  canvas.elt.setAttribute('aria-label',
    'Tic-tac-toe board. Use arrow keys to move, Enter or Space to place a mark, B to hear the board.');
  canvas.elt.addEventListener('focus', () => { canvasHasFocus = true; redraw(); });
  canvas.elt.addEventListener('blur', () => { canvasHasFocus = false; redraw(); });

  // Only clicks/touches on the canvas count as moves (FR-2.1, FR-2.2)
  canvas.mousePressed(handlePointer);

  select('#new-round').mousePressed(newRound);
  select('#reset-score').mousePressed(resetScore);

  noLoop();             // redraw only on change (NFR-1.3)
  updateScoreboard();
  updateStatus();
  redraw();
}

function draw() {
  background(COLOR_BG);
  drawGrid();
  drawMarks();
  drawWinLine();
  drawFocus();
  describe('Tic-tac-toe board, 3 by 3 grid. ' + boardDescription()); // FR-9.1
}

function windowResized() {             // FR-1.5
  const size = boardSize();
  resizeCanvas(size, size);
  redraw();
}

function boardSize() {
  return Math.max(MIN_SIZE, Math.min(MAX_SIZE, windowWidth - PAGE_GUTTER));
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
function handlePointer() {
  usingKeyboard = false;
  const cell = width / 3;
  if (mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height) {
    return false;                       // FR-2.2
  }
  const index = Math.floor(mouseY / cell) * 3 + Math.floor(mouseX / cell);
  focusIndex = index;
  tryMove(index);
  return false;                         // stop default touch behavior
}

function keyPressed() {
  usingKeyboard = true;
  // Shortcuts that work anywhere on the page (FR-2.8, FR-9.4)
  if (key === 'n' || key === 'N') { newRound(); return false; }
  if (key === 'r' || key === 'R') { resetScore(); return false; }
  if (key === 'b' || key === 'B') { announce(boardDescription()); return false; }

  // Board keys only while the board has focus, so buttons keep Enter/Space
  if (!canvasHasFocus) {
    return true;
  }

  const row = Math.floor(focusIndex / 3);
  const col = focusIndex % 3;

  if (keyCode === UP_ARROW && row > 0) {
    moveFocus(focusIndex - 3);
  } else if (keyCode === DOWN_ARROW && row < 2) {
    moveFocus(focusIndex + 3);
  } else if (keyCode === LEFT_ARROW && col > 0) {
    moveFocus(focusIndex - 1);
  } else if (keyCode === RIGHT_ARROW && col < 2) {
    moveFocus(focusIndex + 1);
  } else if (key >= '1' && key <= '9') {         // FR-2.5
    moveFocus(Number(key) - 1);
  } else if (keyCode === ENTER || key === ' ') {  // FR-2.6
    tryMove(focusIndex);
  } else if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
    // At an edge: stay put (FR-2.4)
  } else {
    return true;                       // let other keys (Tab, etc.) work normally
  }
  return false;                        // prevent page scrolling
}

function moveFocus(index) {
  focusIndex = index;
  const value = board[index] === '' ? 'empty' : board[index];
  announce(cellName(index) + ', ' + value);
  redraw();
}

function tryMove(index) {
  if (gameState !== 'playing') {
    announce('The round is over. Press N or the New Round button to play again.');
    return;
  }
  const res = makeMove(index);
  if (!res.ok) {
    announce('That cell is taken.');    // FR-4.2
    return;
  }

  let msg = res.mark + ' placed in ' + cellName(index) + '. ';
  if (gameState === 'won') {
    msg += 'Player ' + winner + ' wins!';
  } else if (gameState === 'draw') {
    msg += 'It’s a draw.';
  } else {
    msg += currentPlayer + '’s turn.';
  }
  announce(msg);                        // FR-9.2, FR-9.3
  updateStatus();
  updateScoreboard();                   // FR-6.3
  redraw();
}

function newRound() {                   // FR-7.1
  resetBoard(true);
  announce('New round. Player ' + currentPlayer + ' goes first.');
  updateStatus();
  redraw();
}

function resetScore() {                 // FR-7.2
  resetScores();
  announce('Score reset. Player X goes first.');
  updateStatus();
  updateScoreboard();
  redraw();
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
function drawGrid() {
  const cell = width / 3;
  stroke(COLOR_GRID);
  strokeWeight(GRID_WEIGHT);
  strokeCap(SQUARE);
  for (let i = 1; i < 3; i++) {
    line(i * cell, 0, i * cell, height);
    line(0, i * cell, width, i * cell);
  }
}

function drawMarks() {
  const cell = width / 3;
  const r = (cell * MARK_SCALE) / 2;
  strokeWeight(Math.max(6, cell * 0.08));
  strokeCap(ROUND);
  noFill();
  for (let i = 0; i < 9; i++) {
    const cx = (i % 3) * cell + cell / 2;
    const cy = Math.floor(i / 3) * cell + cell / 2;
    if (board[i] === 'X') {             // FR-1.3, FR-1.4: two diagonals
      stroke(COLOR_X);
      line(cx - r, cy - r, cx + r, cy + r);
      line(cx + r, cy - r, cx - r, cy + r);
    } else if (board[i] === 'O') {      // unfilled circle
      stroke(COLOR_O);
      circle(cx, cy, r * 2);
    }
  }
}

function drawWinLine() {                // FR-5.2
  if (!winLine) return;
  const cell = width / 3;
  const center = i => ({
    x: (i % 3) * cell + cell / 2,
    y: Math.floor(i / 3) * cell + cell / 2
  });
  const a = center(winLine[0]);
  const c = center(winLine[2]);
  stroke(COLOR_WIN);
  strokeWeight(WIN_WEIGHT);
  strokeCap(ROUND);
  line(a.x, a.y, c.x, c.y);
}

function drawFocus() {                  // FR-2.7
  if (!canvasHasFocus || !usingKeyboard) return;
  const cell = width / 3;
  const inset = GRID_WEIGHT + FOCUS_WEIGHT / 2 + 2;
  noFill();
  stroke(COLOR_FOCUS);
  strokeWeight(FOCUS_WEIGHT);
  rect((focusIndex % 3) * cell + inset, Math.floor(focusIndex / 3) * cell + inset,
       cell - inset * 2, cell - inset * 2, 6);
}

function updateStatus() {
  select('#status').html(statusText());
}

function updateScoreboard() {
  select('#score-x').html(scores.X);
  select('#score-o').html(scores.O);
  select('#score-draws').html(scores.draws);
}

/** Writes to the aria-live region. Clearing first makes repeated messages re-announce. */
function announce(msg) {
  const el = document.getElementById('announcer');
  el.textContent = '';
  setTimeout(() => { el.textContent = msg; }, 50);
}

// Allow the pure logic to be tested in Node (ignored by the browser)
if (typeof module !== 'undefined') {
  module.exports = { checkWinner, findWinLine, WIN_LINES };
}
