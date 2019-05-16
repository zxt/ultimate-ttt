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

  highlightBoard() {
    let css = ''
    if(this.props.boardIdx === this.props.nextBoard.nextB) {
      if(this.props.nextBoard.nextP === 'X') {
        css = 'next-board-x'
      } else {
        css = 'next-board-o'
      }
    }

    return css
  }

  render() {
    const board = []

    for(let i = 0; i < 3; i++) {
      board.push(this.renderRow(i))
    }

    let css = this.highlightBoard()

    return (
      <div className={`board
                       ${css}
                      `}>
        {board}
      </div>
    )
  }
}

export default Board
