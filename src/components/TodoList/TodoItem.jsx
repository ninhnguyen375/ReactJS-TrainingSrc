import React from 'react'
import PropTypes from '../../common/PropTypes'

const propTypes = {
  todoItem: PropTypes.object.isRequired
}

const TodoItem = ({ todoItem }) => {
  return (
    <div>
      abc
      <b>
        {todoItem.ID} - {todoItem.Title} - {todoItem.Status}
      </b>
    </div>
  )
}

TodoItem.propTypes = propTypes

export default TodoItem
