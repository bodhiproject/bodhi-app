import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreateVote extends Component {

  state = {
    address: '',
    voterAddress: '',
    oracleAddress: '',
    optionIdx: null,
    amount: null,
    blockNum: null,
  }

  render() {
    return (
      <div>
        <div className='flex flex-column mt3'>
          <input
            className='mb2'
            value={this.state.address}
            onChange={(e) => this.setState({ address: e.target.value })}
            type='text'
            placeholder='address'
          />
          <input
            className='mb2'
            value={this.state.voterAddress}
            onChange={(e) => this.setState({ voterAddress: e.target.value })}
            type='text'
            placeholder='voter address'
          />
          <input
            className='mb2'
            value={this.state.oracleAddress}
            onChange={(e) => this.setState({ oracleAddress: e.target.value })}
            type='text'
            placeholder='oracle address'
          />
          <input
            className='mb2'
            value={this.state.optionIdx}
            onChange={(e) => this.setState({ optionIdx: e.target.value })}
            type='number'
            placeholder='option index'
          />
          <input
            className='mb2'
            value={this.state.amount}
            onChange={(e) => this.setState({ amount: e.target.value })}
            type='number'
            placeholder='vote amount'
          />
          <input
            className='mb2'
            value={this.state.blockNum}
            onChange={(e) => this.setState({ blockNum: e.target.value })}
            type='number'
            placeholder='block number'
          />
        </div>
        <button
          onClick={() => this._createVote()}
        >
          Submit
        </button>
      </div>
    )
  }

  _createVote = async () => {
    const {address, voterAddress, oracleAddress, optionIdx, amount, blockNum} = this.state
    await this.props.createVoteMutation({
      variables: {
        address,
        voterAddress,
        oracleAddress,
        optionIdx,
        amount,
        blockNum
      }
    })
    this.props.history.push(`/`)
  }

}

const CREATE_VOTE_MUTATION = gql`
mutation CreateVoteMutation($address: String!, $voterAddress: String!, $oracleAddress: String!,
  $optionIdx: Int!, $amount: Int!, $blockNum: Int!)
                            {
  createVote(
    address: $address,
    voterAddress: $voterAddress,
    oracleAddress: $oracleAddress,
    optionIdx: $optionIdx,
    amount: $amount,
    blockNum: $blockNum
  ) {
    oracleAddress
    optionIdx
    amount
  }
}
`
export default graphql(CREATE_VOTE_MUTATION, { name: 'createVoteMutation' })(CreateVote)
