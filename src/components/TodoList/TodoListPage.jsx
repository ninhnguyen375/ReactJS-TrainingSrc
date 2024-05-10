import React, { useEffect, useState } from 'react'
import TodoItem from './TodoItem'
import { getItemsService } from '../../common/services'
import lists from '../../common/lists'
import TodoItemForm from './TodoItemForm'
import { Button, Modal } from 'antd'

const TodoListPage = () => {
  const [todoItemList, setTodoItemList] = useState([])
  const [selectedItem, setSelectedItem] = useState({
    item: null,
    mode: 'New'
  })
  const [isShowTodoForm, setIsShowTodoForm] = useState(false)

  const getTodoList = async (filterStatus = 'All') => {
    let filter = ''

    if (filterStatus !== 'All') {
      filter = `Status eq '${filterStatus}'`
    }

    let data = await getItemsService(lists.TodoList, {
      filter: filter
    })
    data = data.value

    setTodoItemList(data)
  }

  useEffect(() => {
    getTodoList('All')
  }, [])

  return (
    <div>
      <button onClick={() => getTodoList('Pending')}>get todo list Pending</button>
      <button onClick={() => getTodoList('Done')}>get todo list Done</button>
      <button onClick={() => getTodoList('All')}>get todo list All</button>

      <Button
        onClick={() => {
          setIsShowTodoForm(true)
          setSelectedItem({
            item: null,
            mode: 'New'
          })
        }}>
        Add
      </Button>

      {todoItemList.map((item) => {
        return (
          <div
            key={item.ID}
            onClick={() => {
              setIsShowTodoForm(true)
              setSelectedItem({
                item: item,
                mode: 'Edit'
              })
            }}>
            <TodoItem todoItem={item} />
          </div>
        )
      })}

      {isShowTodoForm ? (
        <Modal
          footer={[]}
          destroyOnClose
          title="Form Todo"
          onCancel={() => {
            setIsShowTodoForm(false)
            setSelectedItem({})
          }}
          open={isShowTodoForm}>
          <TodoItemForm
            mode={selectedItem.mode}
            item={selectedItem.item}
            onSubmit={() => {
              setIsShowTodoForm(false)
              setSelectedItem({})

              getTodoList()
            }}
          />
        </Modal>
      ) : (
        ''
      )}
    </div>
  )
}

export default TodoListPage
