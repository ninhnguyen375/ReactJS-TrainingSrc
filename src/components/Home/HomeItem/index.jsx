import React from 'react'
import { Image } from 'antd'
import PropTypes from 'prop-types'

const propTypes = {
  dataHome: PropTypes.object,
  handleChangeMenu: PropTypes.func
}

const HomeItem = ({ dataHome, handleChangeMenu }) => {
  const handleNavigate = () => {
    handleChangeMenu(dataHome.NavigateTo)
  }
  return (
    <div
      className="flex-grow d-flex flex-col py-2 relative gap-3 rounded-3xl bg-white shadow-md cursor-pointer hover:shadow-lg duration-500"
      onClick={handleNavigate}>
      <div className="d-flex items-center justify-center gap-2">
        <Image width={50} height={50} preview={false} src="/avatar.png" alt="Logo" />
      </div>
      <div className="flex items-center justify-center">
        <span className="font-semibold text-md w-full text-center">{dataHome.Title}</span>
      </div>
    </div>
  )
}

HomeItem.propTypes = propTypes
export default HomeItem
