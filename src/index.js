import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// NOTE
// Square is a subclass: A subclass is a class which inherits both the properties and behaviors of another class,
// while also having the ability to modify the properties of that class without editing the class itself.
function Square(props) {
    return (
      // QUESTION 1
      // Difference of passing props in a class vs function component

      // QUESTION 2
      // Notice how with onClick={() => console.log('click')}, we’re passing 
      // a function as the onClick prop. React will only call this function 
      // after a click. Forgetting () => and writing onClick={console.log('click')} 
      // is a common mistake, and would fire every time the component re-renders.

      // QUESTION 3
      // What is 'this.' exactly? 
      <button className="square" onClick={ props.onClick }>
        {props.value}
      </button>
    );
  }

class Board extends React.Component {
  renderSquare(i) {
    return ( 
      <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const newHistory = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const newSquareState = current.squares.slice();
    if (calculateWinner(newSquareState) || newSquareState[i]) {
      return;
    }
    newSquareState[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: newHistory.concat([{
        squares: newSquareState,
      }]),
      stepNumber: newHistory.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    console.log(status)
    console.log(moves)

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}



// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);



function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}