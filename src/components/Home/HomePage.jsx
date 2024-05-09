import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const buttons = [
    {
      title: 'Home',
      subtitle: 'Home page',
      url: '/',
      imgSrc: '/menu-profile-contractor.png'
    }
  ]

  return (
    <div className="home container">
      <div className="home-buttons row">
        {buttons.map((item) => (
          <div key={item.url} className={` col-md-${item.span || 6}`}>
            <div
              style={{ height: item.imgHeight ? 'auto' : '' }}
              onClick={() => {
                if (item.urlType === 'external') {
                  window.open(item.url, '_blank')
                } else {
                  navigate(item.url)
                }
              }}
              className="home-buttons--item">
              <img
                style={{ height: item.imgHeight, width: item.imgWidth }}
                src={item.imgSrc}
                className="home-buttons--item--img"></img>
              <div className="home-buttons--item--title">{item.title}</div>
              <div className="home-buttons--item--subtitle">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage
