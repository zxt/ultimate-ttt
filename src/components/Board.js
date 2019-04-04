import React from 'react'

import Square from './Square'

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

export default Board
