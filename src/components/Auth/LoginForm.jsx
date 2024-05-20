import { Link, useLocation, useNavigate } from 'react-router-dom'
import { handleError } from '../../common/helpers'
import { useUI } from '../../common/UIProvider'
import { getAuth, loginService } from '../../common/services'
import { Button, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import config from '../../common/config'

function LoginForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const ui = useUI()
  const [form] = useForm()
  const returnUrl = location.state?.returnUrl || '/'

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }
    const values = form.getFieldsValue()

    ui.setLoading(true)

    try {
      const loginRes = await loginService(values.email, values.password)

      localStorage.setItem(config.LOCAL_ACCESS_TOKEN, loginRes.token.accessToken)
      localStorage.setItem(config.LOCAL_REFRESH_TOKEN, loginRes.token.refreshToken)
      localStorage.setItem(config.LOCAL_AUTHENTICATED, JSON.stringify(loginRes))

      const newProfile = await getAuth()

      localStorage.setItem(config.LOCAL_PROFILE, JSON.stringify(newProfile))

      if (returnUrl === '/login') {
        navigate('/', { replace: true })
      } else {
        navigate(returnUrl, { replace: true })
      }
    } catch (error) {
      const message = handleError(error)

      if (message.indexOf('Incorrect') > -1) {
        ui.notiError('Thông tin đăng nhập chưa chính xác!')
      } else {
        ui.notiError('Lỗi hệ thống, vui lòng thử lại trong giây lát!')
      }
    }

    ui.setLoading(false)
  }

  return (
    <div>
      <div className="login-page">
        <div className="login-page-container">
          <div className="container">
            <div className="row">
              <div className="col-5">
                <img className="login-page-container-logo" src="/spvb-logo.png" alt="" />
              </div>
              <div className="col">
                <div className="row fw-bold">ĐĂNG NHẬP NHÀ THẦU </div>
                <div className="row">CONTRACTOR LOGIN</div>
              </div>
            </div>
            <div className="row mt-4">
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Email đăng nhập"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập Email đăng nhập!'
                    }
                    // { type: 'email', message: 'Please input your email!' }
                  ]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập Mật khẩu!'
                    }
                  ]}>
                  <Input.Password />
                </Form.Item>

                <div className="d-flex justify-content-end">
                  {/* <Link to="/forgot-password">
                    <i className="fa-solid fa-key"></i> Quên mật khẩu
                  </Link> */}
                  <Button
                    icon={<i className="fa-solid fa-arrow-right-to-bracket"></i>}
                    loading={ui.loading}
                    onClick={handleSubmit}
                    type="primary">
                    Đăng nhập
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
