import React, { Component } from 'react'
import Header from './components/Header'
import OracleList from './components/OracleList'
import Search from './components/Search'
import CreateVote from './components/CreateVote'

import { Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className='center w85'>
      <Header />
      <div className='ph3 pv1 background-gray'>
        <Switch>
          <Route exact path='/' component={OracleList}/>
          <Route exact path='/oralce' component={OracleList}/>
          <Route exact path='/finish' component={OracleList}/>
          <Route exact path='/search' component={Search}/>
          <Route exact path='/vote' component={CreateVote}/>
        </Switch>
      </div>
    </div>
    )
  }
}

export default App