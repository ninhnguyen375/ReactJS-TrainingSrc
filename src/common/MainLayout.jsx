import { Button, Layout, Menu } from 'antd'
const { Sider } = Layout
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import PropTypes from 'prop-types'
import COLOR from './color'
import config from './config'
import { LOGIN_TYPES } from './constant'
import { useMsal } from '@azure/msal-react'

const MainLayout = ({ children }) => {
  const { profile, logout, loginType } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [onBreakpoint, setOnBreakpoint] = useState(false)
  const [collapsed, setCollapsed] = useState(true)

  const { instance, accounts } = useMsal()

  const imageSize = '25px'

  const logoutRequest = {
    account: instance.getAccountByHomeId(accounts.length > 0 ? accounts[0].homeAccountId : null),
    postLogoutRedirectUri: `${window.location.origin}/login`,
    onRedirectNavigate: () => {
      localStorage.removeItem(config.LOCAL_PROFILE)
      localStorage.removeItem(config.LOCAL_AUTHENTICATED)
      localStorage.removeItem(config.LOCAL_ACCESS_TOKEN)
      localStorage.removeItem(config.LOCAL_REFRESH_TOKEN)
      localStorage.removeItem(config.LOCAL_LOGIN_TYPE)
      return true
    }
  }

  const handleClickLogout = async () => {
    if (loginType === LOGIN_TYPES.OFFICE365) {
      await instance.logoutRedirect(logoutRequest)
    } else {
      await logout()
    }
  }

  const navigateTo = (url) => {
    navigate(url)
    if (onBreakpoint) {
      setCollapsed(!collapsed)
    }
  }

  const items = [
    {
      key: '/',
      label: 'Home',
      icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
      onClick: () => navigateTo('/')
    },
    {
      key: '/account',
      label: 'Quản lý tài khoản',
      icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
      onClick: () => navigateTo('/account')
    },
    {
      key: '/Images_List_Page',
      label: 'Images List',
      icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
      onClick: () => navigateTo('/Images_List_Page')
    },
    {
      key: '/documentstore',
      label: 'Document Store',
      icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
      onClick: () => navigateTo('/documentstore')
    },
    {
      key: '/user',
      label: 'Quản lý người dùng',
      icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
      onClick: () => navigateTo('/user')
    },
    {
      key: '/ehs-report/create/1',
      label: 'Tạo báo cáo',
      icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
      onClick: () => navigateTo('/ehs-report/create/1')
    },
    {
      key: '/ehs',
      label: 'Danh sách báo cáo',
      icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
      onClick: () => navigateTo('/ehs')
    },
    {
      key: 'GEMBA',
      label: 'GEMBA',
      icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
      children: [
        {
          key: '/gemba/route-pitstop',
          label: 'GEMBA xác nhận TCAT (GEMBA Process Confirmation)',
          icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
          children: [
            {
              key: '/gemba/route-pitstop/follow',
              icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
              label: 'Gemba theo Route & Pit stop',
              onClick: () => navigateTo('/gemba/route-pitstop/follow')
            },
            {
              key: '/gemba/route-pitstop/update-standard',
              icon: <img src="/menu-profile-contractor.png" width={imageSize} />,
              label: 'Cập nhật tiêu chuẩn GEMBA Pit stop',
              onClick: () => navigateTo('/gemba/route-pitstop/update-standard')
            }
          ]
        }
      ]
    }
  ]

  // Function to flatten menu items and return array of paths
  const flattenMenu = (items) => {
    let paths = []
    items.forEach((item) => {
      paths.push(item.key)
      if (item.children) {
        paths = paths.concat(flattenMenu(item.children))
      }
    })
    return paths
  }

  const allPaths = flattenMenu(items)

  // Function to find the longest matching prefix in paths
  const findSelectedKey = (paths, pathname) => {
    let selectedKey = '/'
    for (const path of paths) {
      if (pathname.startsWith(path) && path.length > selectedKey.length) {
        selectedKey = path
      }
    }
    return selectedKey
  }

  const selectedKey = findSelectedKey(allPaths, location.pathname) || '/'

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
          className="logo"
          onClick={() => {
            navigate('/')
            if (onBreakpoint) {
              setCollapsed(!collapsed)
            }
          }}>
          <img className="Logo m-2" src="/Logo.png" alt="Logo" />
        </div>
        {/* Sidebar */}
        <div className="sidebar">
          <Menu
            selectedKeys={[selectedKey]}
            mode="inline"
            items={items}
            className="sidebar-menu text-primary"
          />
          <div
            className="sidebar-account"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#d5f1f7'
            }}>
            <img src="/avatar.png" style={{ width: '60px' }} alt="Avatar" />
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
            <div style={{ fontSize: '0.7em' }} className="text-center mt-1">
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
  children: PropTypes.node.isRequired
}

export default MainLayout
