// import React from 'react'
// import { useNavigate } from 'react-router-dom'

// const HomePage = () => {
//   const navigate = useNavigate()

//   const buttons = [
//     {
//       title: 'Home',
//       subtitle: 'Home page',
//       url: '/',
//       imgSrc: '/menu-profile-contractor.png'
//     }
//   ]

//   return (
//     <div className="home container">
//       <div className="home-buttons row">
//         {buttons.map((item) => (
//           <div key={item.url} className={` col-md-${item.span || 6}`}>
//             <div
//               style={{ height: item.imgHeight ? 'auto' : '' }}
//               onClick={() => {
//                 if (item.urlType === 'external') {
//                   window.open(item.url, '_blank')
//                 } else {
//                   navigate(item.url)
//                 }
//               }}
//               className="home-buttons--item">
//               <img
//                 style={{ height: item.imgHeight, width: item.imgWidth }}
//                 src={item.imgSrc}
//                 className="home-buttons--item--img"></img>
//               <div className="home-buttons--item--title">{item.title}</div>
//               <div className="home-buttons--item--subtitle">{item.subtitle}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default HomePage
import React, { useState, useEffect } from 'react'
import HomeItem from './HomeItem'
import { getItemsService } from '../../common/services'
import lists from '../../common/lists'
import { handleError } from '../../common/helpers'
import { Image } from 'antd'

const HomePage = () => {
  const [menuRank, setMenuRank] = useState(1)
  const [menuItem, setMenuItem] = useState([])

  const handGetMenuItem = async () => {
    try {
      let data = await getItemsService(lists.Menu, {
        filter: `Rank eq ${menuRank}`
      })
      setMenuItem(data.value)
      console.log('data.value', data.value)
      return data
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    handGetMenuItem()
  }, [menuRank])

  const handleChangeMenu = (rank) => {
    setMenuRank(rank)
  }

  return (
    <div className="home container">
      <div className="d-flex items-center justify-center mt-8" onClick={() => handleChangeMenu(1)}>
        <Image preview={false} src="/Logo.png" alt="Logo" />
      </div>
      <div className="flex items-center justify-center">
        <span className="font-semibold text-lg">Test</span>
      </div>
      <div
        className={
          menuRank === 1
            ? 'mt-3 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-4'
            : 'mt-3 grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4'
        }>
        {menuItem.map((item) => (
          <HomeItem key={item.id} dataHome={item} handleChangeMenu={handleChangeMenu} />
        ))}
      </div>
    </div>
  )
}

export default HomePage
