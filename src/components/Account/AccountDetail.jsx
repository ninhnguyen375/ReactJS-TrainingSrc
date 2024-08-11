import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { handleError } from '../../common/helpers'
import { registerService, updateListItemService } from '../../common/services'
import { useUI } from '../../common/UIProvider'
import lists from '../../common/lists'

const formMode = {
  edit: 'edit',
  new: 'new'
}

const propTypes = {
  item: PropTypes.object,
  users: PropTypes.array,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  mode: PropTypes.oneOf(['new', 'edit']).isRequired
}

const AccountDetail = ({ item, users, onSubmit, onCancel, mode }) => {
  const [form] = useForm()
  const ui = useUI()

  // states
  const [loading, setLoading] = useState(false)
  // console.log(users)

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }

    setLoading(true)

    const values = form.getFieldsValue()

    try {
      if (mode === formMode.new) {
        await registerService(
          values.UserName,
          values.Password,
          values.ConfirmPassword,
          values.Role,
          values.RefID
        )
      }

      if (mode === formMode.edit) {
        if (values.Role === 'admin') {
          values.IsActive = true
        }
        await updateListItemService(lists.Accounts, item.ID, values)
      }

      ui.notiSuccess('Successfully')
      return onSubmit(values)
    } catch (error) {
      ui.notiError('Failed')
      handleError(error)
    }

    setLoading(false)
  }

  return (
    <div>
      <Form layout="vertical" form={form}>
        <Form.Item
          initialValue={item?.UserName}
          label="Tài khoản"
          name="UserName"
          rules={[{ required: true, message: 'Không được bỏ trống' }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item
          initialValue={item?.Password}
          label="Mật khẩu"
          name="Password"
          rules={[{ required: true, message: 'Không được bỏ trống' }]}>
          <Input.Password disabled={mode === formMode.edit ? true : false}></Input.Password>
        </Form.Item>

        {mode === formMode.new ? (
          <Form.Item
            initialValue=""
            label="Confirm Password"
            name="ConfirmPassword"
            rules={[{ required: true, message: 'Không được bỏ trống' }]}>
            <Input.Password disabled={mode === formMode.edit ? true : false}></Input.Password>
          </Form.Item>
        ) : (
          ''
        )}

        <Form.Item
          initialValue={item?.Role}
          label="Quyền"
          name="Role"
          rules={[{ required: true, message: 'Không được bỏ trống' }]}>
          <Select
            style={{
              width: '100%'
            }}
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Contractor', value: 'contractor' }
            ]}></Select>
        </Form.Item>

        <Form.Item
          label="Người dùng"
          name="RefID"
          rules={[{ required: true, message: 'Không được bỏ trống' }]}>
          <Select
            style={{
              width: '100%'
            }}>
            {users.map((user) => (
              <Select.Option key={user.ID} value={user.Title}>
                {user.Title} - {user.FullName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <div className="d-flex justify-content-end mt-4">
        <Button icon={<i className="fa-regular fa-circle-xmark"></i>} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          icon={<i className="fa-solid fa-paper-plane"></i>}
          className="ms-2"
          type="primary"
          loading={loading}
          onClick={handleSubmit}>
          {mode === formMode.new ? 'Create' : 'Update'}
        </Button>
      </div>
    </div>
  )
}

AccountDetail.propTypes = propTypes

export default AccountDetail
