import { Button } from 'antd'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const returnUrl = location.state?.returnUrl || '/'

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <img width={'70%'} src="/notfound-404.png" />
        <div>
          <Button
            onClick={() => navigate(returnUrl)}
            className="fw-bold"
            size="large"
            type="primary">
            QUAY LẠI | GO BACK
          </Button>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage
