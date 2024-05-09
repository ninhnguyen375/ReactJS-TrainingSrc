import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getFileService } from '../services'
import { Image } from 'antd'

const SPImage = ({ serverRelativeUrl, site, ...imageProps }) => {
  const [objUrl, setObjUrl] = useState('')

  const getImage = async () => {
    try {
      let image = await getFileService(site, serverRelativeUrl)
      image = URL.createObjectURL(image)
      setObjUrl(image)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    getImage()
  }, [])

  return (
    <Image src={objUrl || '/spinner.gif'} style={{ backgroundColor: '#f6f6f6' }} {...imageProps} />
  )
}

SPImage.propTypes = {
  serverRelativeUrl: PropTypes.string.isRequired,
  site: PropTypes.string.isRequired
}

export default SPImage
