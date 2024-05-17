import React, { useState } from 'react'
import PropTypes from '../../common/PropTypes'
import { useForm } from 'antd/es/form/Form'
import { Form, Input } from 'antd'
import { useUI } from '../../common/UIProvider'
import { addListItemService, updateListItemService } from '../../common/services'
import lists from '../../common/lists'
import AsyncButton from '../../common/components/AsyncButton'
import AttachmentTodo from './AttachmentTodo'
import SPImage from '../../common/components/SPImage'
import ImageTodo from './ImageTodo'
import { useTodoPage } from './TodoListPage'

const propTypes = {
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  mode: PropTypes.string // New, Edit
}

const TodoItemForm = ({ item, onSubmit, mode = 'New' }) => {
  const [form] = useForm()
  const ui = useUI()

  const [image1, setImage1] = useState(JSON.parse(item?.Image1))

  const { todoItemList } = useTodoPage()
  console.log('todoItemList: from TodoItemForm', todoItemList)

  const handleSave = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      ui.notiError('Vui lòng điền đầy đủ thông tin')
      return
    }

    const values = form.getFieldsValue()

    // update to sharepoint
    try {
      if (mode === 'New') {
        await addListItemService(lists.TodoList, {
          Title: values.todoTitle
        })
      }

      if (mode == 'Edit') {
        await updateListItemService(lists.TodoList, item.ID, {
          Title: values.todoTitle
        })
      }

      ui.notiSuccess('Lưu thành công')

      onSubmit()
    } catch (error) {
      ui.notiError(error.message)
    }
  }

  return (
    <div>
      <Form form={form}>
        <Form.Item
          name={'todoTitle'}
          initialValue={item?.Title}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập Title!'
            }
          ]}>
          <Input />
        </Form.Item>

        {/* {image1?.serverRelativeUrl ? (
          <div>
            <SPImage site={lists.TodoList.site} serverRelativeUrl={image1?.serverRelativeUrl} />
          </div>
        ) : (
          ''
        )} */}

        <ImageTodo
          width={220}
          list={lists.TodoList}
          mode={'View'}
          storeID={item?.ID}
          columnName={'Image1'}
        />

        <div>
          <AttachmentTodo list={lists.TodoList} storeID={item?.ID} preloadImage />
        </div>
      </Form>

      <AsyncButton onClick={handleSave}>Save</AsyncButton>
    </div>
  )
}

TodoItemForm.propTypes = propTypes
export default TodoItemForm
