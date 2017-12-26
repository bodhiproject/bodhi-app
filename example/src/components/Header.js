import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {

  render() {
    return (
      <div className='flex pa1 justify-between nowrap orange'>
        <div className='flex flex-fixed black'>
          <div className='fw7 mr1'>Viewer</div>
          <Link to='/' className='ml1 no-underline black'>Ongoing</Link>
          <div className='ml1'>|</div>
          <Link to='/oracle' className='ml1 no-underline black'>Vote</Link>
          <div className='ml1'>|</div>
          <Link to='/finish' className='ml1 no-underline black'>Finished</Link>
          <div className='ml1'>|</div>
          <Link to='/search' className='ml1 no-underline black'>Search</Link>
          <div className='ml1'>|</div>
          <Link to='/vote' className='ml1 no-underline black'>To Vote</Link>
        </div>
      </div>
    )
  }

}

export default withRouter(Header)