import React, { createContext, useContext, useEffect, useState } from 'react'
import TodoItem from './TodoItem'
import { addListItemService, getItemsService } from '../../common/services'
import lists from '../../common/lists'
import TodoItemForm from './TodoItemForm'
import { Button, Modal } from 'antd'
import SPPagination from '../../common/components/SPPagination'

const TodoPageContext = createContext()

const TodoListPage = () => {
  const [todoItemList, setTodoItemList] = useState([])
  const [selectedItem, setSelectedItem] = useState({
    item: null,
    mode: 'New'
  })
  const [isShowTodoForm, setIsShowTodoForm] = useState(false)

  const getTodoList = async (withLoading) => {
    let data = await getItemsService(lists.TodoList, {
      top: 2
    })

    setTodoItemList(data.value)

    return data
  }

  useEffect(() => {
    getTodoList('All')
  }, [])

  return (
    <TodoPageContext.Provider value={{ getTodoList, todoItemList }}>
      <div>
        <button onClick={() => getTodoList('Pending')}>get todo list Pending</button>
        <button onClick={() => getTodoList('Done')}>get todo list Done</button>
        <button onClick={() => getTodoList('All')}>get todo list All</button>

        <Button
          onClick={async () => {
            const createdItem = await addListItemService(lists.TodoList, {
              Title: ''
            })

            setIsShowTodoForm(true)
            setSelectedItem({
              item: createdItem,
              mode: 'Edit'
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

        <SPPagination getItems={getTodoList} setItems={setTodoItemList} items={todoItemList} />

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
    </TodoPageContext.Provider>
  )
}

export const useTodoPage = () => {
  const { getTodoList, todoItemList } = useContext(TodoPageContext)

  return { getTodoList, todoItemList }
}

export default TodoListPage
