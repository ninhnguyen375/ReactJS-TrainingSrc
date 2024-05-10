import React from 'react'
import PropTypes from '../../common/PropTypes'
import { useForm } from 'antd/es/form/Form'
import { Form, Input } from 'antd'
import { useUI } from '../../common/UIProvider'
import { addListItemService, updateListItemService } from '../../common/services'
import lists from '../../common/lists'
import AsyncButton from '../../common/components/AsyncButton'

const propTypes = {
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  mode: PropTypes.string // New, Edit
}

const TodoItemForm = ({ item, onSubmit, mode = 'New' }) => {
  const [form] = useForm()
  const ui = useUI()

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
      </Form>

      <AsyncButton onClick={handleSave}>Save</AsyncButton>
    </div>
  )
}

TodoItemForm.propTypes = propTypes
export default TodoItemForm
