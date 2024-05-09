import React, { useState } from 'react'
import { useUI } from '../../common/UIProvider'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Input } from 'antd'
import { handleError } from '../../common/helpers'
import { useForm } from 'antd/es/form/Form'
import { changePasswordService, updateListItemService } from '../../common/services'
import lists from '../../common/lists'
import { useAuth } from '../../common/AuthProvider'

const ChangePasswordPage = () => {
  const ui = useUI()
  const navigate = useNavigate()
  const [form] = useForm()
  const returnUrl = location.state?.returnUrl || '/'
  const [loading, setLoading] = useState(false)
  const { profile } = useAuth()

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }

    const values = form.getFieldsValue()

    // validating
    if (values.newPasswordConfirm !== values.newPassword) {
      ui.notiWarning('Mật khẩu xác nhận chưa khớp!')

      return
    }

    setLoading(true)

    try {
      await changePasswordService(values.oldPassword, values.newPassword)

      await updateListItemService(lists.Accounts, profile.account.ID, {
        RawPassword: values.newPassword
      })

      ui.notiSuccess('Thay đổi thành công')

      navigate(returnUrl || '/')
    } catch (error) {
      handleError(error)
    }

    setLoading(false)
  }

  return (
    <div>
      <div className="change-password-page">
        <div className="change-password-page-container">
          <div className="fw-bold ">THAY ĐỔI MẬT KHẨU</div>
          <Form form={form} className="mt-4" layout="vertical">
            <Form.Item
              label="Mật khẩu cũ"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Mật khẩu cũ!'
                }
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Mật khẩu mới!'
                }
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="newPasswordConfirm"
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Xác nhận mật khẩu mới!'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const newPassword = getFieldValue('newPassword')

                    if (!value || newPassword === value || newPassword.length > value.length) {
                      return Promise.resolve()
                    }

                    return Promise.reject(new Error('Mật khẩu xác nhận chưa khớp!'))
                  }
                })
              ]}>
              <Input.Password />
            </Form.Item>

            <div className="text-end pt-3">
              <Button
                onClick={() => {
                  navigate(-1)
                }}>
                Quay lại
              </Button>
              <Button
                loading={loading}
                onClick={handleSubmit}
                className="ms-2"
                htmlType="submit"
                type="primary">
                Thay đổi
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage
