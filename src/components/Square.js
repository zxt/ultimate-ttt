import React from 'react'

function Square(props) {
  return (
    <button className={`square
                        ${highlightMatch(props.winningMatch, props.idx)}
                        ${colorPlayer(props.value)}
                      `}
            onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

function colorPlayer(value) {
  let css

  if(value === 'X') {
    css = 'player-x'
  } else {
    css = 'player-o'
  }

  return css
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

export default Square
