import { useState, useEffect } from "react";
import "./style.css";

export default function App() {
  const [level, setLevel] = useState("Easy");
  const [chosenPlayer, setChosenPlayer] = useState("X");
  const [currentTurn, setCurrentTurn] = useState("X");
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function choosePlayer(selectedPlayer) {
    if (board.every((cell) => cell === "") && selectedPlayer !== chosenPlayer) {
      setChosenPlayer(selectedPlayer);
      setCurrentTurn(selectedPlayer);
    }
  }

  function handleCellClick(index) {
    if (isGameOver) return;
    if (board[index] !== "" || currentTurn !== chosenPlayer || isGameOver)
      return;

    const newBoard = [...board];
    newBoard[index] = chosenPlayer;
    setBoard(newBoard);

    setCurrentTurn(chosenPlayer === "X" ? "O" : "X");

    setTimeout(() => {
      computerMove(newBoard);
    }, 500);
  }

  function computerMove(currentBoard) {
    if (isGameOver) return;

    const aiPlayer = chosenPlayer === "X" ? "O" : "X";
    const humanPlayer = chosenPlayer;
    let aiMove = null;

    if (level === "Easy") {
      aiMove = makeRandomMove(currentBoard);
    } else if (level === "Medium") {
      aiMove =
        blockOpponentMove(currentBoard, humanPlayer) ??
        takeCenter(currentBoard) ??
        makeRandomMove(currentBoard);
    } else if (level === "Hard") {
      aiMove =
        CheckWinningMove(currentBoard, aiPlayer) ??
        blockOpponentMove(currentBoard, humanPlayer) ??
        takeCenter(currentBoard) ??
        takeCornerOrEdge(currentBoard) ??
        makeRandomMove(currentBoard);
    }

    if (aiMove === null) return;

    const newBoard = [...currentBoard];
    newBoard[aiMove] = aiPlayer;
    setBoard(newBoard);

    setCurrentTurn(humanPlayer);
  }

  function resetGame() {
    setBoard(Array(9).fill(""));
    setCurrentTurn("X");
    setIsGameOver(false);
    setWinner(null);
  }

  function checkWinner(currentBoard) {
    for (let [a, b, c] of winConditions) {
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }

    if (currentBoard.every((cell) => cell !== "")) {
      return "Draw";
    }

    return null;
  }

  useEffect(() => {
    const result = checkWinner(board);
    if (result && !isGameOver) {
      setWinner(result);
      setIsGameOver(true);
    }
  }, [board]);

  function blockOpponentMove(board, opponent) {
    for (let [a, b, c] of winConditions) {
      if (board[a] === opponent && board[b] === opponent && board[c] === "")
        return c;

      if (board[a] === opponent && board[c] === opponent && board[b] === "")
        return b;

      if (board[b] === opponent && board[c] === opponent && board[a] === "")
        return a;
    }
    return null;
  }

  function takeCenter(board) {
    return board[4] === "" ? 4 : null;
  }

  function makeRandomMove(board) {
    const empty = board
      .map((cell, i) => (cell === "" ? i : null))
      .filter((i) => i !== null);
    if (empty.length === 0) return null;
    return empty[Math.floor(Math.random() * empty.length)];
  }

  function CheckWinningMove(board, aiPlayer) {
    for (let [a, b, c] of winConditions) {
      if (board[a] === aiPlayer && board[b] === aiPlayer && board[c] == "")
        return c;
      if (board[a] === aiPlayer && board[c] === aiPlayer && board[b] === "")
        return b;
      if (board[b] === aiPlayer && board[c] === aiPlayer && board[a] === "")
        return a;
    }
    return null;
  }

  function takeCornerOrEdge(board) {
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
      if (board[corner] === "") {
        return corner;
      }
    }

    const edges = [1, 3, 5, 7];
    for (let edge of edges) {
      if (board[edge] === "") {
        return edge;
      }
    }
    return null;
  }

  return (
    <div className="app-container">
      <div className="level">
        <button
          onClick={() => {
            setLevel("Easy");
            resetGame();
          }}
        >
          Easy
        </button>
        <button
          onClick={() => {
            setLevel("Medium");
            resetGame();
          }}
        >
          Medium
        </button>
        <button
          onClick={() => {
            setLevel("Hard");
            resetGame();
          }}
        >
          Hard
        </button>
      </div>

      <header id="header">
        <div
          className={`player ${currentTurn === "X" ? "player-active" : ""}`}
          onClick={() => choosePlayer("X")}
        >
          X
        </div>
        <h3 id="titleHeader">Choose</h3>
        <div
          className={`player ${currentTurn === "O" ? "player-active" : ""}`}
          onClick={() => choosePlayer("O")}
        >
          O
        </div>
      </header>

      <p>Current Level: {level}</p>

      <div id="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${
              cell === "X" ? "cell-x" : cell === "O" ? "cell-o" : ""
            }`}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      {winner && (
        <p className="winner-message">
          {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
        </p>
      )}

      <button className="restart-btn" onClick={resetGame}>
        Restart
      </button>
    </div>
  );
}
