import { useForm } from 'antd/es/form/Form'
import React, { useState } from 'react'
import { useUI } from '../../common/UIProvider'
import { handleError } from '../../common/helpers'
import { Button, Form, Input } from 'antd'
import PropTypes from '../../common/PropTypes'
import { hashPasswordService, updateListItemService } from '../../common/services'
import lists from '../../common/lists'

const propTypes = {
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
}

const ResetPasswordForm = ({ item, onSubmit, onCancel }) => {
  const [form] = useForm()
  const ui = useUI()

  // states
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }

    setLoading(true)

    const values = form.getFieldsValue()
    const isValidPassword = await handleCheckConfirmPassword(values)
    if (isValidPassword) {
      const { passwordHash, salt } = await hashPasswordService(values.Password)
      values.Password = passwordHash
      values.Salt = salt

      await updateListItemService(lists.Accounts, item.ID, {
        Password: values.Password,
        Salt: values.Salt
      })
    }

    try {
      ui.notiSuccess('Successfully')
      return onSubmit(values)
    } catch (error) {
      ui.notiError('Failed')
      handleError(error)
    }

    setLoading(false)
  }

  const handleCheckConfirmPassword = (value) => {
    if (value.Password.length < 6) {
      ui.notiError('Mật khẩu cần có ít nhất 5 ký tự')
      return false
    }

    if (value.Password !== value.ConfirmPassword) {
      ui.notiError('Mật khẩu xác nhận không khớp')
      return false
    }

    return true
  }

  return (
    <div>
      <Form layout="vertical" form={form}>
        <Form.Item
          initialValue=""
          label="Password"
          name="Password"
          rules={[
            { required: true, message: 'Không được bỏ trống' },
            { min: 5, message: 'Mật khẩu cần có ít nhất 5 ký tự' }
          ]}>
          <Input.Password></Input.Password>
        </Form.Item>

        <Form.Item
          initialValue=""
          label="Confirm Password"
          name="ConfirmPassword"
          rules={[
            { required: true, message: 'Không được bỏ trống' },
            { min: 5, message: 'Mật khẩu cần có ít nhất 5 ký tự' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('Password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
              }
            })
          ]}>
          <Input.Password></Input.Password>
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
          Confirm
        </Button>
      </div>
    </div>
  )
}

ResetPasswordForm.propTypes = propTypes

export default ResetPasswordForm
