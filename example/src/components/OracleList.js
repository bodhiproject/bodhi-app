import React, { Component } from 'react'
import Oracle from './Oracle'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class OracleList extends Component {

  render() {

    if (this.props.allOraclesQuery && this.props.allOraclesQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.allOraclesQuery && this.props.allOraclesQuery.error) {
      return <div>Error</div>
    }

    const oraclesToRender = this.props.allOraclesQuery.allOracles

    return (
      <div>
        {oraclesToRender.map(oracle => (
          <Oracle key={oracle.address} oracle={oracle}/>
        ))}
      </div>
    )
  }

}

const ALL_ORACLES_QUERY = gql`
query AllOraclesQuery {
  allOracles {
    address
    topicAddress
    name
    options
    optionIdxs
    amounts
  }
}
`


export default graphql(ALL_ORACLES_QUERY, { name: 'allOraclesQuery' }) (OracleList)