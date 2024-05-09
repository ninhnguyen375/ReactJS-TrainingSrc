import { useNavigate } from 'react-router-dom'
import { handleError } from '../../common/helpers'
import { useUI } from '../../common/UIProvider'
import { Button, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import AsyncButton from '../../common/components/AsyncButton'
import axios from 'axios'

function ForgotPassword() {
  const ui = useUI()
  const navigate = useNavigate()
  const [form] = useForm()

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }
    const values = form.getFieldsValue()

    ui.setLoading(true)

    try {
      await axios.post(
        'https://prod-10.japaneast.logic.azure.com:443/workflows/64343a651fc8488689d7d91969aae198/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YvCsZirhwjOIqMAqtjlNDaQgwlSnj48rRItasN6A2mE',
        {
          UserName: values.UserName,
          Email: values.Email
        }
      )

      ui.notiSuccess(
        'Yêu cầu quên mật khẩu thành công. Hệ thống sẽ phản hồi lại email ' +
          values.Email +
          ' trong ít phút.'
      )

      navigate('/login')
    } catch (error) {
      ui.notiError('Lỗi hệ thống, vui lòng thử lại trong giây lát!')
      handleError(error)
    }

    ui.setLoading(false)
  }

  return (
    <div>
      <div className="forgot-password-page">
        <div className="forgot-password-page-container">
          <div className="fw-bold ">QUÊN MẬT KHẨU</div>
          <Form form={form} className="mt-4" layout="vertical">
            <Form.Item
              label="Tài khoản đăng nhập"
              name="UserName"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Tài khoản đăng nhập!'
                }
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Email đã nhận thông tin từ SPVB"
              extra="Hệ thống sẽ kiểm tra email hợp lệ và gửi mật khẩu mới về email này"
              name="Email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Email đã nhận thông tin từ SPVB!'
                },
                {
                  type: 'email',
                  message: 'Không đúng định dạng Email!'
                }
              ]}>
              <Input />
            </Form.Item>

            <div className="text-end pt-3">
              <Button
                onClick={() => {
                  navigate(-1)
                }}>
                Quay lại
              </Button>
              <AsyncButton
                icon={<i className="fa-regular fa-paper-plane"></i>}
                onClick={handleSubmit}
                className="ms-2"
                type="primary">
                Gửi
              </AsyncButton>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
