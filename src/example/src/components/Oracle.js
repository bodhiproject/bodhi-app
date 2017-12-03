import React, { Component } from 'react'

class Oracle extends Component {

  render() {
    return (
      <div>
        <div> {this.props.oracle.address}: {this.props.oracle.name}</div>
        <ul>
          {this.props.oracle.optionIdxs.map((idx) =>
            <li>{this.props.oracle.options[idx]}:{this.props.oracle.amounts[idx]}</li>
          )}
        </ul>
      </div>
    )
  }
}


export default Oracle