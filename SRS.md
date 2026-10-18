# Software Requirements Specification

**Tic-Tac-Toe Game in p5.js**

**Table 1. Document information**

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Date | October 18, 2026 |
| Prepared by | [Instructor / Team name] |
| Course | [Course number and title] |
| Status | Draft for review |

**Table 2. Revision history**

| Version | Date | Author | Description of change |
| --- | --- | --- | --- |
| 1.0 | 2026-10-18 | [Author] | Initial release |

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  - [1.4 References](#14-references)
  - [1.5 Document Overview](#15-document-overview)
- [2. Overall Description](#2-overall-description)
  - [2.1 Product Perspective](#21-product-perspective)
  - [2.2 Product Functions](#22-product-functions)
  - [2.3 User Classes and Characteristics](#23-user-classes-and-characteristics)
  - [2.4 Operating Environment](#24-operating-environment)
  - [2.5 Design and Implementation Constraints](#25-design-and-implementation-constraints)
  - [2.6 Assumptions and Dependencies](#26-assumptions-and-dependencies)
- [3. System Features and Functional Requirements](#3-system-features-and-functional-requirements)
  - [3.1 Board Display](#31-board-display)
  - [3.2 Player Input](#32-player-input)
  - [3.3 Turn Management](#33-turn-management)
  - [3.4 Move Validation](#34-move-validation)
  - [3.5 Win and Draw Detection](#35-win-and-draw-detection)
  - [3.6 Scoreboard](#36-scoreboard)
  - [3.7 New Round and Reset](#37-new-round-and-reset)
  - [3.8 Optional: Computer Opponent](#38-optional-computer-opponent)
  - [3.9 Accessibility Output](#39-accessibility-output)
- [4. External Interface Requirements](#4-external-interface-requirements)
  - [4.1 User Interface](#41-user-interface)
  - [4.2 Hardware Interfaces](#42-hardware-interfaces)
  - [4.3 Software Interfaces](#43-software-interfaces)
- [5. Non-Functional Requirements](#5-non-functional-requirements)
  - [5.1 Performance](#51-performance)
  - [5.2 Accessibility](#52-accessibility)
  - [5.3 Usability](#53-usability)
  - [5.4 Maintainability](#54-maintainability)
  - [5.5 Portability](#55-portability)
- [6. Data Model and Game States](#6-data-model-and-game-states)
  - [6.1 Data Model](#61-data-model)
  - [6.2 State Transitions](#62-state-transitions)
- [7. Acceptance Tests](#7-acceptance-tests)
- [8. Requirements Traceability Matrix](#8-requirements-traceability-matrix)
- [Appendix A. Suggested Function Outline](#appendix-a-suggested-function-outline)

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) describes the functional and non-functional requirements for a two-player Tic-Tac-Toe game built with the p5.js JavaScript library. It is intended for developers implementing the game, instructors and graders evaluating it, and testers verifying it against the acceptance criteria in Section 7.

### 1.2 Scope

The product is a browser-based Tic-Tac-Toe game played on a 3 × 3 grid. Two players alternate placing X and O marks; the first to align three marks horizontally, vertically, or diagonally wins. If all nine cells fill with no winner, the game is a draw. The game tracks a running score for the session, supports mouse, touch, and keyboard input, and exposes its state to screen readers.

Out of scope for version 1.0: online multiplayer, user accounts, persistent storage of scores between browser sessions, and board sizes other than 3 × 3. A single-player mode against a computer opponent is specified as an optional feature (Section 3.8).

### 1.3 Definitions, Acronyms, and Abbreviations

**Table 3. Definitions**

| Term | Definition |
| --- | --- |
| p5.js | An open-source JavaScript library for creative coding that provides a canvas and drawing API. |
| Canvas | The HTML `<canvas>` element that p5.js creates and draws on. |
| Cell | One of the nine squares on the board, indexed 0–8 in row-major order. |
| Mark | The symbol (X or O) a player places in a cell. |
| Win line | Any of the eight sets of three cells that produce a win (3 rows, 3 columns, 2 diagonals). |
| Round | One game from an empty board to a win or draw. |
| Session | All rounds played from page load until the page is closed or refreshed. |
| WCAG | Web Content Accessibility Guidelines, published by the W3C. |
| Section 508 | U.S. federal accessibility standard for information and communication technology. |
| ARIA | Accessible Rich Internet Applications; HTML attributes that convey roles and state to assistive technology. |
| SRS | Software Requirements Specification. |

### 1.4 References

- IEEE Std 830-1998, Recommended Practice for Software Requirements Specifications.
- p5.js Reference, https://p5js.org/reference/
- p5.js Accessibility features: `describe()`, `describeElement()`, `textOutput()`, `gridOutput()`.
- W3C Web Content Accessibility Guidelines (WCAG) 2.2, https://www.w3.org/TR/WCAG22/
- Section 508 Standards (36 CFR Part 1194), https://www.access-board.gov/ict/

### 1.5 Document Overview

Section 2 gives an overall description of the product. Section 3 lists system features with numbered functional requirements. Section 4 describes external interfaces. Section 5 lists non-functional requirements. Section 6 defines the data model and game states. Section 7 gives acceptance tests, and Section 8 traces requirements to tests.

## 2. Overall Description

### 2.1 Product Perspective

The game is a self-contained, client-side web application. It consists of an `index.html` page, a `sketch.js` file containing the p5.js sketch, and optionally a `style.css` file. It has no server component and runs entirely in the browser, either from the p5.js Web Editor or from a local or static web host.

### 2.2 Product Functions

- Draw a 3 × 3 game board on the canvas.
- Accept a move by mouse click, touch, or keyboard.
- Alternate turns between Player X and Player O.
- Reject moves on occupied cells and moves after the round ends.
- Detect a win or draw after every move and highlight the winning line.
- Display whose turn it is and the result of the round.
- Track wins for X, wins for O, and draws for the session.
- Start a new round and reset the session score.
- Announce state changes to assistive technology.

### 2.3 User Classes and Characteristics

**Table 4. User classes**

| User class | Description |
| --- | --- |
| Casual player | Plays with a mouse or touchscreen; needs no instructions beyond on-screen text. |
| Keyboard-only player | Navigates and plays entirely with the keyboard. |
| Screen-reader user | Relies on text alternatives and live announcements to follow and play the game. |
| Student developer | Implements, extends, or debugs the sketch as a programming exercise. |
| Instructor / grader | Evaluates the implementation against this SRS. |

### 2.4 Operating Environment

- Current versions of Chrome, Firefox, Safari, and Edge on Windows, macOS, ChromeOS, iOS, and Android.
- p5.js version 1.9 or later (the accessibility functions used require 1.x).
- Minimum viewport width of 320 CSS pixels.

### 2.5 Design and Implementation Constraints

- Shall be written in JavaScript using p5.js; no other game frameworks.
- Shall use the p5.js global mode functions `setup()` and `draw()`.
- Game logic (move validation, win detection) shall be separated from drawing code so it can be tested without the canvas.
- Shall not require a network connection after the page and library have loaded.

### 2.6 Assumptions and Dependencies

- Both players in two-player mode share one device.
- The p5.js library is loaded from a CDN or a local copy before `sketch.js`.
- JavaScript is enabled in the browser.

## 3. System Features and Functional Requirements

Priority levels: **High** = required for version 1.0; **Medium** = expected unless time does not allow; **Low** = optional enhancement.

### 3.1 Board Display

**Table 5. Board display requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-1.1 | The system shall create a square canvas sized to the smaller of the window width and height, minus a margin, with a minimum of 300 × 300 pixels. | High |
| FR-1.2 | The system shall draw a 3 × 3 grid of equal cells separated by lines at least 4 pixels thick. | High |
| FR-1.3 | The system shall draw X as two crossing diagonal lines and O as an unfilled circle, each scaled to about 60% of the cell size. | High |
| FR-1.4 | X and O shall differ in shape as well as color so that color is not the only distinguishing feature. | High |
| FR-1.5 | The system shall resize and redraw the board when the browser window is resized (`windowResized()`). | Medium |

### 3.2 Player Input

**Table 6. Player input requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-2.1 | The system shall map a mouse click or touch inside the canvas to the cell under the pointer (`mousePressed()` / `touchStarted()`). | High |
| FR-2.2 | The system shall ignore clicks or touches outside the board area. | High |
| FR-2.3 | The system shall maintain a keyboard focus cell, starting at the center cell (index 4). | High |
| FR-2.4 | Arrow keys shall move the focus cell up, down, left, or right, stopping at board edges. | High |
| FR-2.5 | Number keys 1–9 shall move focus to the matching cell (1 = top-left, 9 = bottom-right). | Medium |
| FR-2.6 | Enter or Space shall place the current player’s mark in the focus cell. | High |
| FR-2.7 | The focus cell shall be shown with a visible outline at least 3 pixels thick with a contrast ratio of at least 3:1 against adjacent colors. | High |
| FR-2.8 | Pressing N shall start a new round; pressing R shall reset the session score. | Medium |

### 3.3 Turn Management

**Table 7. Turn management requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-3.1 | Player X shall move first in the first round of a session. | High |
| FR-3.2 | After each valid move, the turn shall pass to the other player. | High |
| FR-3.3 | In each new round, the player who did not move first in the previous round shall move first. | Medium |
| FR-3.4 | The system shall display a status message stating whose turn it is, for example “Player X’s turn”. | High |

### 3.4 Move Validation

**Table 8. Move validation requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-4.1 | The system shall place a mark only in an empty cell. | High |
| FR-4.2 | An attempt to play an occupied cell shall not change the board or the turn, and the system shall announce “That cell is taken.” | High |
| FR-4.3 | The system shall reject all moves once the round has ended in a win or draw. | High |

### 3.5 Win and Draw Detection

**Table 9. Win and draw detection requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-5.1 | After every valid move, the system shall check all eight win lines for three identical non-empty marks. | High |
| FR-5.2 | When a win is found, the system shall end the round, display “Player X wins!” or “Player O wins!”, and draw a line through the three winning cells. | High |
| FR-5.3 | When all nine cells are filled and no win exists, the system shall end the round and display “It’s a draw.” | High |
| FR-5.4 | Win detection shall take precedence over draw detection when the ninth move completes a win line. | High |
| FR-5.5 | The win-check function shall be a pure function that takes a board array and returns `"X"`, `"O"`, `"draw"`, or `null`. | Medium |

### 3.6 Scoreboard

**Table 10. Scoreboard requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-6.1 | The system shall track the number of X wins, O wins, and draws for the session. | High |
| FR-6.2 | The scoreboard shall be displayed as HTML text outside the canvas so it is readable by assistive technology. | High |
| FR-6.3 | Scores shall update immediately when a round ends. | High |

### 3.7 New Round and Reset

**Table 11. New round and reset requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-7.1 | The system shall provide a “New Round” HTML button that clears the board and keeps the score. | High |
| FR-7.2 | The system shall provide a “Reset Score” HTML button that clears the board and sets all scores to zero. | High |
| FR-7.3 | Both buttons shall be native `<button>` elements reachable with the Tab key and operable with Enter or Space. | High |

### 3.8 Optional: Computer Opponent

**Table 12. Computer opponent requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-8.1 | The system may offer a mode selector for “Two Players” or “Vs. Computer”. | Low |
| FR-8.2 | In “Vs. Computer” mode the human plays X and the computer plays O. | Low |
| FR-8.3 | The computer shall, in order: win if possible, block an immediate human win, take the center, take a corner, then take any open cell. | Low |
| FR-8.4 | The computer shall move after a delay of 400–800 ms so its move can be perceived and announced. | Low |

### 3.9 Accessibility Output

**Table 13. Accessibility output requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-9.1 | The sketch shall call `describe()` with a summary of the game, for example “Tic-tac-toe board, 3 by 3 grid.” | High |
| FR-9.2 | The page shall contain an ARIA live region (`aria-live="polite"`) that announces each move, for example “X placed in row 1, column 3. O’s turn.” | High |
| FR-9.3 | Round results (win or draw) shall be announced in the live region. | High |
| FR-9.4 | The system shall provide a text description of the full board on request (press B), listing each cell by row and column as X, O, or empty. | Medium |
| FR-9.5 | Instructions for mouse and keyboard play shall appear as visible HTML text on the page. | High |

## 4. External Interface Requirements

### 4.1 User Interface

The page layout, from top to bottom, shall be: a level-1 heading “Tic-Tac-Toe”; the status message (live region); the canvas; the scoreboard; the New Round and Reset Score buttons; and the instructions. The page shall set `<html lang="en">` and a descriptive `<title>`.

**Table 14. Recommended color palette (meets WCAG 1.4.3 and 1.4.11)**

| Element | Foreground | Background | Contrast ratio |
| --- | --- | --- | --- |
| Body text and status | #1A1A1A | #FFFFFF | 17.4:1 |
| Grid lines | #333333 | #FFFFFF | 12.6:1 |
| X mark | #B00020 (dark red) | #FFFFFF | 7.3:1 |
| O mark | #0B4F9C (dark blue) | #FFFFFF | 8.0:1 |
| Focus outline | #C26A00 (dark orange), 3 px | #FFFFFF | 3.9:1 |
| Winning line | #1B7F3A (green), 8 px | #FFFFFF | 5.1:1 |

Implementers may change the palette, but any replacement shall keep text at 4.5:1 or higher and graphical elements at 3:1 or higher against their background.

### 4.2 Hardware Interfaces

The game uses the device’s display, pointing device (mouse, trackpad, or touchscreen), and keyboard through standard browser events. No other hardware is required.

### 4.3 Software Interfaces

**Table 15. Software interfaces**

| Component | Purpose |
| --- | --- |
| p5.js core | Canvas creation, drawing, input events, `describe()`. |
| p5.js DOM functions | `createButton()`, `createP()`, `createDiv()` for HTML controls and text. |
| Web browser | Renders HTML, CSS, and canvas; delivers ARIA live announcements to assistive technology. |

## 5. Non-Functional Requirements

### 5.1 Performance

**Table 16. Performance requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-1.1 | The board shall visibly update within 100 ms of a valid move. | High |
| NFR-1.2 | The sketch shall load and become playable within 3 seconds on a typical broadband connection. | Medium |
| NFR-1.3 | The sketch should redraw only when state changes (for example using `noLoop()` and `redraw()`) to reduce CPU use. | Low |

### 5.2 Accessibility

**Table 17. Accessibility requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-2.1 | The page shall conform to WCAG 2.2 Level AA and Section 508. | High |
| NFR-2.2 | All functions shall be operable by keyboard alone with no keyboard trap (WCAG 2.1.1, 2.1.2). | High |
| NFR-2.3 | Focus order shall follow the visual layout (WCAG 2.4.3). | High |
| NFR-2.4 | The game shall contain no flashing content above three flashes per second (WCAG 2.3.1). | High |
| NFR-2.5 | Any animation shall be disabled when the user has set `prefers-reduced-motion: reduce`. | Medium |
| NFR-2.6 | The game shall have no time limits on moves (WCAG 2.2.1). | High |
| NFR-2.7 | Content shall remain usable at 200% browser zoom without loss of function (WCAG 1.4.4). | High |

### 5.3 Usability

**Table 18. Usability requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-3.1 | A first-time player shall be able to complete a round without outside help. | High |
| NFR-3.2 | Each cell shall be at least 44 × 44 CSS pixels to meet touch-target guidance (WCAG 2.5.8 requires 24 × 24 minimum). | High |

### 5.4 Maintainability

**Table 19. Maintainability requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-4.1 | Code shall use descriptive names and include a header comment with author, date, and purpose. | High |
| NFR-4.2 | Game logic functions (`isValidMove`, `checkWinner`, `makeMove`, `resetBoard`) shall not call p5.js drawing functions. | Medium |
| NFR-4.3 | Magic numbers such as colors and sizes shall be defined as named constants at the top of `sketch.js`. | Medium |

### 5.5 Portability

**Table 20. Portability requirements**

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-5.1 | The game shall run unmodified in the p5.js Web Editor and from any static web host. | High |
| NFR-5.2 | The game shall function in the browsers listed in Section 2.4. | High |

## 6. Data Model and Game States

### 6.1 Data Model

**Table 21. Game state variables**

| Variable | Type | Description |
| --- | --- | --- |
| `board` | Array of 9 strings | Each element is `"X"`, `"O"`, or `""`. Index = row × 3 + column. |
| `currentPlayer` | String | `"X"` or `"O"`. |
| `gameState` | String | `"playing"`, `"won"`, or `"draw"`. |
| `winner` | String or null | Mark of the winner, or `null`. |
| `winLine` | Array of 3 integers or null | Indices of the winning cells, used for highlighting. |
| `focusIndex` | Integer 0–8 | Cell that has keyboard focus. |
| `scores` | Object | `{ X: 0, O: 0, draws: 0 }` |
| `firstPlayer` | String | Who moved first this round; used for FR-3.3. |

Cell index layout:

**Table 22. Board cell indices**

| Row | Column 1 | Column 2 | Column 3 |
| --- | --- | --- | --- |
| **Row 1** | 0 | 1 | 2 |
| **Row 2** | 3 | 4 | 5 |
| **Row 3** | 6 | 7 | 8 |

Win lines:

```javascript
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
  [0, 4, 8], [2, 4, 6]              // diagonals
];
```

### 6.2 State Transitions

**Table 23. State transition table**

| Current state | Event | Condition | Next state |
| --- | --- | --- | --- |
| playing | Valid move | Move completes a win line | won |
| playing | Valid move | Board full, no win | draw |
| playing | Valid move | Otherwise | playing (turn switches) |
| playing | Invalid move | Cell occupied | playing (no change) |
| won or draw | Any move | — | unchanged (move rejected) |
| any | New Round | — | playing, board cleared |
| any | Reset Score | — | playing, board and scores cleared |

## 7. Acceptance Tests

**Table 24. Acceptance tests**

| Test ID | Steps | Expected result |
| --- | --- | --- |
| AT-01 | Load the page. | Empty 3 × 3 board appears; status reads “Player X’s turn”; scores are 0–0–0. |
| AT-02 | Click the top-left cell. | X appears in cell 0; status reads “Player O’s turn”. |
| AT-03 | Click cell 0 again. | Board unchanged; still O’s turn; “That cell is taken” announced. |
| AT-04 | Play X: 0, 1, 2 with O: 3, 4. | “Player X wins!”; line drawn through top row; X score = 1. |
| AT-05 | After AT-04, click an empty cell. | No mark placed. |
| AT-06 | Play X: 0, 4, 8 with O: 1, 2. | X wins on the main diagonal. |
| AT-07 | Play X: 0, 1, 5, 6, 8 with O: 2, 3, 4, 7. | “It’s a draw.”; draws = 1. |
| AT-08 | Fill the board so the 9th move wins. | Result is a win, not a draw. |
| AT-09 | Using keyboard only: Tab to the canvas, use arrows and Enter to play a round, Tab to New Round and press Enter. | Full round playable; focus outline always visible; new round starts. |
| AT-10 | Press New Round after a win. | Board cleared; scores kept; O moves first. |
| AT-11 | Press Reset Score. | Board cleared; all scores 0. |
| AT-12 | Play with NVDA, JAWS, or VoiceOver running. | Each move and result is announced; board summary available with B. |
| AT-13 | Resize the window narrower and wider; zoom to 200%. | Board resizes; all controls visible and usable. |
| AT-14 | Run an automated checker (axe DevTools or WAVE). | No WCAG A or AA errors reported. |
| AT-15 | Call `checkWinner()` from the console with test boards. | Returns correct `"X"`, `"O"`, `"draw"`, or `null` for each. |

## 8. Requirements Traceability Matrix

**Table 25. Traceability matrix**

| Requirement(s) | Verified by |
| --- | --- |
| FR-1.1 – FR-1.4 | AT-01, AT-02 |
| FR-1.5 | AT-13 |
| FR-2.1, FR-2.2 | AT-02 |
| FR-2.3 – FR-2.8 | AT-09 |
| FR-3.1, FR-3.2, FR-3.4 | AT-01, AT-02 |
| FR-3.3 | AT-10 |
| FR-4.1, FR-4.2 | AT-03 |
| FR-4.3 | AT-05 |
| FR-5.1, FR-5.2 | AT-04, AT-06 |
| FR-5.3 | AT-07 |
| FR-5.4 | AT-08 |
| FR-5.5 | AT-15 |
| FR-6.1 – FR-6.3 | AT-04, AT-07 |
| FR-7.1 – FR-7.3 | AT-09, AT-10, AT-11 |
| FR-8.1 – FR-8.4 | Instructor-defined test if implemented |
| FR-9.1 – FR-9.5 | AT-12, AT-14 |
| NFR-1.x | AT-02 (observation) |
| NFR-2.x | AT-09, AT-12, AT-13, AT-14 |
| NFR-3.x | AT-01, AT-13 |
| NFR-4.x | Code review |
| NFR-5.x | AT-01 in each listed browser |

## Appendix A. Suggested Function Outline

This outline is guidance, not a requirement. It shows one way to separate game logic from drawing.

```javascript
// ----- Logic (no drawing) -----
function resetBoard()          { /* clear board, set state */ }
function isValidMove(i)        { /* empty cell and playing */ }
function makeMove(i)           { /* place mark, check result */ }
function checkWinner(b)        { /* return "X" | "O" | "draw" | null */ }

// ----- Input -----
function mousePressed()        { /* pixel -> cell -> makeMove */ }
function keyPressed()          { /* arrows, 1-9, Enter, N, R, B */ }

// ----- Output -----
function draw()                { /* grid, marks, focus, win line */ }
function announce(msg)         { /* update aria-live element */ }
function updateScoreboard()    { /* update HTML score text */ }
```
