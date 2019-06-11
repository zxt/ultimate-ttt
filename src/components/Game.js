import React from 'react'

import Board from './Board'

import './../index.css'

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(Array(9).fill(null)),
        lastMoveIndex: -1,
        nextMoveIndex: -1,
        boardIndex: null,
        winMatches: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      movesAscOrder: true,
      winner: null,
    }
  }

  handleClick(boardIdx, squareIdx) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]

    const boards = current.squares.map(arr => arr.slice())
    const matches = current.winMatches.slice()

    // exit early if any of these conditions are met
    if(this.state.winner != null ||   // game already won
        matches[boardIdx]) {       // board already won
      return
    }
    if(current.nextMoveIndex !== -1) {  // next move is not a 'free' move
      if(current.nextMoveIndex !== boardIdx ||    // invalid board for next move
        boards[boardIdx][squareIdx]) {            // square already filled
        return
      }
    }

    boards[boardIdx][squareIdx] = this.state.xIsNext ? 'X' : 'O'

    const w = calculateWinner(boards[boardIdx])
    if(w) {
      matches[boardIdx] = w
    }

    // squareIdx determines the next board
    // but if that board is already won,
    // then next move is a free choice
    let nextIdx = squareIdx
    if(matches[squareIdx] !== null) {
      nextIdx = -1
    }

    const gameWinner = calculateWinner(matches.map(arr =>
                                        arr ? arr.player : null))
    if(gameWinner) {
      this.setState({
        winner: gameWinner
      })
    }

    this.setState({
      history: history.concat([{
        squares: boards,
        lastMoveIndex: squareIdx,
        nextMoveIndex: nextIdx,
        boardIndex: boardIdx,
        winMatches: matches,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    if(step === this.state.stepNumber) {
      return
    }
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winner: null,
    })
  }

  toggleMoveOrder() {
    this.setState({
      movesAscOrder: !this.state.movesAscOrder,
    })
  }

  renderBoard(i, s, m, n) {
    let next = {
      "nextP": this.state.xIsNext ? 'X' : 'O',
      "nextB": n
    }

    return(
        <Board
          key={'b'+i}
          boardIdx={i}
          squares={s}
          winningMatch={m}
          nextBoard={next}
          onClick={(i, j) => this.handleClick(i, j)}
        />
    )
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]

    const moves= history.map((step,move)=> {
      const player = move % 2 ? 'X' : 'O'
      const boardCoordinates = [
        [1,1], [1,2], [1,3],
        [2,1], [2,2], [2,3],
        [3,1], [3,2], [3,3],
      ]
      const moveCoordinates = boardCoordinates[step.lastMoveIndex]
      const desc = move ?
        'Go to move #' + move + ' (' + player + ', ' +
                                      'board#' + (step.boardIndex+1) + ', ' +
                                      moveCoordinates + ' )' :
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

    let winner
    if(this.state.winner) {
      winner = this.state.winner.player
    }
    let status
    if (winner) {
      if(winner === -1) {
        status = "Draw"
      } else {
        status = 'Winner: ' + winner
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

    const boards = []
    for(let i = 0; i < 9; i++) {
      let match = current.winMatches[i] ? current.winMatches[i].match : null
      boards.push(this.renderBoard(i,
                                    current.squares[i],
                                    match,
                                    current.nextMoveIndex))
    }

    return (
      <div className="game">
        <div className="game-board">
          {boards}
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

/*
 * Returns the winner as a 2 element object
 *
 * 'player' is the player that won ('X' or 'O')
 * 'match' is the matching line (a 3 element array of indices)
 */
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
      //return [squares[a], lines[i]]
      return {'player': squares[a], 'match': lines[i]}
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

export default Game
