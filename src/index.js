import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className={`square
                        ${highlightMatch(props.winningMatch, props.idx)}
                      `}
            onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

function highlightMatch(match, idx) {
  const horizontalMatchList = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8]
  ]
  const verticalMatchList = [
    [0, 3, 6], [1, 4, 7], [2, 5, 8]
  ]
  const forwardDiagonalMatch = [0, 4, 8]
  const backwardDiagonalMatch = [2, 4, 6]

  let css
  if(match && match.includes(idx)) {
    if(forwardDiagonalMatch.every((v,i) =>
                                    v === match[i])) {
      css = 'forward-diagonal-line'
    } else if (backwardDiagonalMatch.every((v,i) =>
                                            v === match[i])) {
      css = 'backward-diagonal-line'
    } else if (horizontalMatchList.some((arr) =>
                                          arr.every((v,i) =>
                                          v === match[i]))) {
      css = 'horizontal-line'
    } else if (verticalMatchList.some((arr) =>
                                        arr.every((v,i) =>
                                        v === match[i]))) {
      css = 'vertical-line'
    } else {
      css = ''
    }
  }
  return css
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        idx={i}
        winningMatch={this.props.winningMatch}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  renderRow(i) {
    const row = []

    for(let j = 0; j < 3; j++) {
      row.push(this.renderSquare(j+i*3))
    }
    return (
      <div className="board-row">{row}</div>
    )
  }

  render() {
    const board = []

    for(let i = 0; i < 3; i++) {
      board.push(this.renderRow(i))
    }

    return (
      <div>
        {board}
      </div>
    )
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      movesAscOrder: true,
      winningMatch: null,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        moveIndex: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winningMatch: null,
    })
  }

  toggleMoveOrder() {
    this.setState({
      movesAscOrder: !this.state.movesAscOrder,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves= history.map((step,move)=> {
      const player = move % 2 ? 'X' : 'O'
      const boardCoordinates = [
        [1,1], [1,2], [1,3],
        [2,1], [2,2], [2,3],
        [3,1], [3,2], [3,3],
      ]
      const moveCoordinates = boardCoordinates[step.moveIndex]
      const desc = move ?
        'Go to move #' + move + '(' + player + ',' + moveCoordinates + ')' :
        'Go to game start'

      let className = ''
      if (move === this.state.stepNumber) {
        className += ' history-selected'
      }
      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    })

    if(!this.state.movesAscOrder) {
      moves.reverse()
    }

    let status
    if (winner) {
      if(winner === -1) {
        status = "Draw"
      } else {
        status = 'Winner: ' + winner[0]
        if(!this.state.winningMatch) {
          this.setState({winningMatch: winner[1]})
        }
      }
    } else {
      status ='Next player: ' +  (this.state.xIsNext ? 'X' : 'O')
    }

    let toggle
    if (this.state.movesAscOrder) {
      toggle = 'Sort moves in DESC ↓ order'
    } else {
      toggle = 'Sort moves in ASC ↑ order'
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningMatch={this.state.winningMatch}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleMoveOrder()}>
            {toggle}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]]
    }
  }

  let nonEmpty = squares.length
  squares.forEach( x => {
    if(x == null) {
      nonEmpty--
    }
  })

  // return special value to indicate draw
  if(nonEmpty === squares.length) {
    return -1
  }

  return null
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
