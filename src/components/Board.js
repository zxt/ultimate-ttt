import React from 'react'

import Square from './Square'

class Board extends React.Component {

  renderSquare(i) {
    let v = ''
    if(this.props.squares[i]) {
      v = this.props.squares[i]
    }
    return (
      <Square
        key={this.props.boardIdx +',' + i}
        idx={i}
        value={v}
        winningMatch={this.props.winningMatch}
        onClick={() => this.props.onClick(this.props.boardIdx, i)}
      />
    )
  }

  renderRow(i) {
    const row = []

    for(let j = 0; j < 3; j++) {
      row.push(this.renderSquare(j+i*3))
    }
    return (
      <div key={'r'+i} className="board-row">{row}</div>
    )
  }

  render() {
    const board = []

    for(let i = 0; i < 3; i++) {
      board.push(this.renderRow(i))
    }

    return (
      <div className="board">
        {board}
      </div>
    )
  }
}

export default Board
