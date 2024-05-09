import React from 'react'
import { PropTypes } from 'prop-types'

const LoadingPage = ({ open }) => {
  return (
    <div style={{ display: open ? 'block' : 'none' }} className="loading-page">
      <div className="loading-page-spinner">
        <div className="loading-page-spinner2">
          <div></div>
          <div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

LoadingPage.propTypes = {
  open: PropTypes.bool
}

export default LoadingPage
