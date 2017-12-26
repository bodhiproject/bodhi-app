import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Oracle from './Oracle'

class Search extends Component {
  state = {
    oracles: [],
    searchText: ''
  }

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type='text'
            onChange={(e) => this.setState({ searchText: e.target.value })}
          />
          <button
            onClick={() => this._executeSearch()}
          >
            OK
          </button>
        </div>
        {this.state.oracles.map((oracle) => <Oracle key={oracle.address} oracle={oracle}/>)}
      </div>
    )
  }

  _executeSearch = async () => {
    const {searchText} = this.state
    const result = await this.props.client.query({
      query: SEARCH_ORACLES_QUERY,
      variables: {searchText}
    })
    const oracles = result.data.searchOracles
    this.setState({oracles})
  }
}


const SEARCH_ORACLES_QUERY = gql`
query SearchOraclesQuery($searchText: String!) {
  searchOracles(searchPhrase: $searchText) {
    address
    topicAddress
    name
    options
    optionIdxs
    amounts
  }
}
`

export default withApollo(Search)