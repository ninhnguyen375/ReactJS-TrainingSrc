import { useLocation, useNavigate } from 'react-router-dom'
import { handleError } from '../../common/helpers'
import { useUI } from '../../common/UIProvider'
import { getAuth, loginService } from '../../common/services'
import { Button, Divider, Form, Image, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import config from '../../common/config'
import { useDispatch, useSelector } from 'react-redux'
import {
  MODULE_AUTH,
  authActions,
  authWithOffice365,
  requestResetPassword,
  verifyResetPassword
} from '../../store/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faClose, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../../office365AuthConfig'
import { LOGIN_TYPES } from '../../common/constant'

function LoginForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const ui = useUI()
  const [form] = useForm()
  const [forgotPWForm] = useForm()
  const returnUrl = location.state?.returnUrl || '/'
  const authState = useSelector((state) => state[MODULE_AUTH])
  const dispatch = useDispatch()

  const { instance } = useMsal()

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
      localStorage.setItem(config.LOCAL_LOGIN_TYPE, JSON.stringify(LOGIN_TYPES.MANUAL))

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

  const handleSubmitForgotPW = async () => {
    try {
      await forgotPWForm.validateFields()
    } catch (error) {
      return
    }
    const values = forgotPWForm.getFieldsValue()
    const forgotVerifyCode = values.forgotVerifyCode // Correctly extract the code
    if (authState.isResetPWSuccess) {
      // Ensure only the necessary parameters are passed
      dispatch(verifyResetPassword({ email: values.forgotPWEmail, verifyCode: forgotVerifyCode }))
    } else {
      dispatch(requestResetPassword(values.forgotPWEmail))
    }
  }

  const handleResendOTP = async () => {
    const values = forgotPWForm.getFieldsValue()
    dispatch(requestResetPassword(values.forgotPWEmail))
  }

  const handleOffice365Login = async () => {
    const response = await instance.loginPopup({ ...loginRequest })
    if (response) {
      dispatch(authWithOffice365(response.accessToken))
    }
  }

  useEffect(() => {
    if (authState.isResetPWSuccess) {
      ui.notiSuccess('Mã xác nhận đã được gửi, vui lòng kiểm tra email')
    } else if (authState.resetPWMessage !== null) {
      if (!authState.isUserExsist) {
        ui.notiError('Email không tồn tại!')
      } else {
        ui.notiError('Đã có lỗi, vui lòng thử lại!')
      }
      dispatch(authActions.resetRequestForgotPWState())
    }
    return
  }, [authState.isResetPWSuccess, authState.resetPWMessage, authState.isUserExsist])

  useEffect(() => {
    if (authState.isVerifyResetSuccess) {
      ui.notiSuccess('Mật khẩu đã được cập nhật lại, vui lòng kiểm tra email')
      dispatch(authActions.closeForgotPWModal())
    } else if (authState.verifyResetPWMessage !== null) {
      if (!authState.isOTPValid) {
        ui.notiError('Mã xác nhận không hợp lệ!')
      } else {
        ui.notiError('Đã có lỗi, vui lòng thử lại!')
      }
      dispatch(authActions.resetVerifyForgotPWState())
    }
    return
  }, [authState.isVerifyResetSuccess, authState.verifyResetPWMessage])

  useEffect(() => {
    let interval
    if (authState.isResetPWSuccess) {
      dispatch(authActions.setCountDown(3)) // Reset countdown to 60 seconds
      interval = setInterval(() => {
        dispatch(authActions.decreaseCountDown(interval))
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [authState.isResetPWSuccess, authState.canResendOTP])

  useEffect(() => {
    const handleOnOffice365LoginResponse = async () => {
      if (authState.offfice365AuthResp) {
        if (authState.offfice365AuthResp.isSuccess) {
          localStorage.setItem(
            config.LOCAL_ACCESS_TOKEN,
            authState.offfice365AuthResp.response.token.accessToken
          )
          localStorage.setItem(
            config.LOCAL_REFRESH_TOKEN,
            authState.offfice365AuthResp.response.token.refreshToken
          )
          localStorage.setItem(
            config.LOCAL_AUTHENTICATED,
            JSON.stringify(authState.offfice365AuthResp.response)
          )
          localStorage.setItem(config.LOCAL_LOGIN_TYPE, JSON.stringify(LOGIN_TYPES.OFFICE365))
          const newProfile = await getAuth()
          localStorage.setItem(config.LOCAL_PROFILE, JSON.stringify(newProfile))
          if (returnUrl === '/login') {
            navigate('/', { replace: true })
          } else {
            navigate(returnUrl, { replace: true })
          }
        } else {
          if (authState.offfice365AuthResp.response.includes('User does not exist')) {
            ui.notiError('Tài khoản không tồn tại trong hệ thống!!!')
          } else {
            ui.notiError('Lỗi hệ thống, vui lòng thử lại trong giây lát!')
          }
        }
      }
    }
    handleOnOffice365LoginResponse()
  }, [authState.offfice365AuthResp])

  return (
    <div>
      <div className="login-page">
        <div className="login-page-container">
          <div className="container">
            <div className="row">
              <div className="col-5">
                <img className="login-page-container-logo" src="/Logo.png" alt="" />
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
                  className=" m-0"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập Mật khẩu!'
                    }
                  ]}>
                  <Input.Password onPressEnter={handleSubmit} />
                </Form.Item>
                <div className="d-flex justify-content-end mb-3">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      forgotPWForm.resetFields()
                      dispatch(authActions.openForgotPWModal())
                    }}>
                    Quên mật khẩu?
                  </Button>
                </div>
                <div className="d-flex w-100 justify-content-end">
                  <Button
                    className="w-100"
                    icon={<i className="fa-solid fa-arrow-right-to-bracket"></i>}
                    loading={ui.loading}
                    onClick={handleSubmit}
                    type="primary">
                    Đăng nhập
                  </Button>
                </div>
                <Divider plain>
                  <span className="text-muted">Đăng nhập với</span>
                </Divider>
                <div className="w-100">
                  <Button className="w-100" onClick={() => handleOffice365Login()}>
                    <div className="optional-login-item">
                      <Image
                        preview={false}
                        className="optional-login-image"
                        src="./microsoft-logo.png"
                      />{' '}
                      Microsoft
                    </div>
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={<h1>QUÊN MẬT KHẨU</h1>}
        open={authState.isShowForgotPW}
        cancelButtonProps={null}
        onCancel={() => dispatch(authActions.closeForgotPWModal())}
        footer={[]}
        width={385}
        centered>
        <Form form={forgotPWForm} layout="vertical" className="mt-3">
          <Form.Item
            name="forgotPWEmail"
            label="Email đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập email đăng nhập' }]}>
            <Input disabled={authState.isResetPWSuccess} onPressEnter={handleSubmitForgotPW} />
          </Form.Item>
          {authState.isResetPWSuccess && (
            <>
              <Form.Item
                name="forgotVerifyCode"
                label={
                  <div className="d-flex justify-center items-center text-center">
                    <span>Mã xác nhận</span>
                    <Button
                      type="link"
                      loading={authState.isResettingPW}
                      icon={<FontAwesomeIcon icon={faRefresh} />}
                      disabled={!authState.canResendOTP}
                      onClick={handleResendOTP}>
                      <span>
                        {!authState.canResendOTP ? (
                          <>{authState.countdown} giây</>
                        ) : (
                          <>Gửi lại mã xác nhận</>
                        )}
                      </span>
                    </Button>
                  </div>
                }
                rules={[{ required: true, message: 'Vui lòng nhập mã OTP' }]}>
                <Input.OTP />
              </Form.Item>
            </>
          )}
          <div className="d-flex justify-end gap-2">
            <Button
              key="cancel"
              icon={<FontAwesomeIcon icon={faClose} />}
              type="default"
              onClick={() => {
                dispatch(authActions.closeForgotPWModal())
              }}>
              Hủy
            </Button>

            <Button
              key="continue"
              loading={authState.isResettingPW || authState.isVerifyingResetPW}
              icon={<FontAwesomeIcon icon={faArrowRight} />}
              type="primary"
              onClick={() => handleSubmitForgotPW()}>
              Tiếp tục
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default LoginForm
