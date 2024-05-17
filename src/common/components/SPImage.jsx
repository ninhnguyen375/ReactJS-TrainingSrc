import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getFileService } from '../services'
import { Image } from 'antd'
import { handleError } from '../helpers'

const SPImage = ({ serverRelativeUrl, site, ...imageProps }) => {
  const [objUrl, setObjUrl] = useState('')
  const [loadingGetImage, setLoadingGetImage] = useState(true)

  const getImage = async () => {
    setLoadingGetImage(true)
    try {
      let image = await getFileService(site, serverRelativeUrl)
      image = URL.createObjectURL(image)
      setObjUrl(image)
    } catch (error) {
      handleError(error)
    }
    setLoadingGetImage(false)
  }

  useEffect(() => {
    getImage()
  }, [serverRelativeUrl])

  return (
    <Image
      loading={loadingGetImage}
      src={objUrl || '/spinner.gif'}
      style={{ backgroundColor: '#f6f6f6' }}
      {...imageProps}
    />
  )
}

SPImage.propTypes = {
  serverRelativeUrl: PropTypes.string.isRequired,
  site: PropTypes.string.isRequired
}

export default SPImage
