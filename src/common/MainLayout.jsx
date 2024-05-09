import { Button, Layout } from 'antd'
const { Sider } = Layout
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { PropTypes } from 'prop-types'
import COLOR from './color'
import config from './config'

const MainLayout = ({ children }) => {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [onBreakpoint, setOnBreakpoint] = useState()
  const [collapsed, setCollapsed] = useState(true)
  //store

  const handleClickLogout = () => {
    logout()
  }

  let menuItems = [
    {
      title: 'Home',
      subTitle: 'Home page',
      key: 'home',
      url: '/',
      image: '/menu-profile-contractor.png'
    }
  ]

  return (
    <Layout>
      <Sider
        theme="light"
        breakpoint="sm"
        collapsedWidth="0"
        collapsed={collapsed}
        onBreakpoint={(broken) => {
          setCollapsed(broken)

          setOnBreakpoint(broken)
        }}
        onCollapse={(collapsed) => {
          setCollapsed(collapsed)
        }}
        width="280px">
        {/* Logo */}
        <div
          className="logo "
          onClick={() => {
            navigate('/')
            if (onBreakpoint) {
              setCollapsed(!collapsed)
            }
          }}>
          <img className="logo-EHS m-2" src="/logo-EHS.png" alt="" />
        </div>
        {/* Slider */}
        <div className="sidebar">
          <div className="sidebar-menu text-primary">
            {menuItems.map((item) => (
              <div
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  navigate(item.url)
                  if (onBreakpoint) {
                    setCollapsed(!collapsed)
                  }
                }}
                key={item.key}
                className={
                  'sidebar-menu-item' +
                  (location.pathname.indexOf(item.key) > -1 ||
                  (location.pathname === '/' && item.key === 'home')
                    ? ' active'
                    : '')
                }>
                <img src={item.image} alt="" />
                <div className="name-menu d-flex flex-column">
                  <span style={{ fontSize: '13px' }}>{item.title}</span>
                  <span style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.subTitle}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="sidebar-account"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#d5f1f7'
            }}>
            <img src="/avatar.png" style={{ width: '60px' }}></img>
            <Link to="/profile">
              <div className="mt-2 fw-bold">{profile.contractor?.ContractorName}</div>
            </Link>

            <div className="mt-1 d-flex justify-content-between">
              <Button
                style={{ backgroundColor: COLOR.orange }}
                size="small"
                icon={<i className="fa-solid fa-key"></i>}
                onClick={() => navigate('/change-password')}
                type="primary">
                Đổi mật khẩu
              </Button>
              <Button
                icon={<i className="fa-solid fa-arrow-right-from-bracket"></i>}
                className="ms-2"
                size="small"
                onClick={handleClickLogout}>
                Đăng xuất
              </Button>
            </div>

            <div
              style={{
                fontSize: '0.7em'
              }}
              className="text-center mt-1">
              Last version: {config.LAST_VERSION}{' '}
              {config.IN_TEST && <b className="text-danger">TEST</b>}
            </div>
          </div>
        </div>
      </Sider>
      {/* Content */}
      <Layout
        style={{
          minWidth: 360,
          height: '100vh',
          overflow: 'auto',
          minHeight: 360,
          background: 'white'
        }}>
        {children}
      </Layout>
    </Layout>
  )
}

MainLayout.propTypes = {
  children: PropTypes.element
}

export default MainLayout
