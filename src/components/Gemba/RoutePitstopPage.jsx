import React from 'react'
import PropTypes from '../../common/PropTypes'
import FollowPistopPage from './FollowPistopPage'
import UpdateStandardPage from './UpdateStandardPage'

const pageMode = {
  follow: 'follow',
  update: 'update'
}

const propTypes = {
  mode: PropTypes.oneOf(['follow', 'update']).isRequired
}

const RoutePitstopPage = ({ mode }) => {
  return mode === pageMode.follow ? <FollowPistopPage /> : <UpdateStandardPage />
}

RoutePitstopPage.propTypes = propTypes

export default RoutePitstopPage
