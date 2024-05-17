import { Button, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { useUI } from '../../common/UIProvider'
import SPImage from '../../common/components/SPImage'
import heic2any from 'heic2any'
import { getNormalizedFile, handleError } from '../../common/helpers'
import {
  getItemService,
  updateListItemService,
  uploadFileToDocLibService
} from '../../common/services'
import PropTypes from '../../common/PropTypes'
import config from '../../common/config'

const propTypes = {
  width: PropTypes.number,
  list: PropTypes.object,
  mode: PropTypes.oneOf(['View', 'Edit']),
  storeID: PropTypes.number,
  setStoreID: PropTypes.func,
  columnName: PropTypes.string
}

const ImageTodo = ({ width, list = { site: '', listName: '' }, mode, storeID, columnName }) => {
  // state
  const [loadingUploadFile, setLoadingUploadFile] = useState(false)
  const [imageInfo, setImageInfo] = useState()

  // hook
  const ui = useUI()

  const handleUpload = async ({ file }) => {
    const ext = file.name.split('.').pop().toLocaleLowerCase()

    if (!['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'].includes(ext)) {
      ui.notiWarning('Please input an image')
      return
    }

    setLoadingUploadFile(true)

    try {
      let rawFile = file.originFileObj

      if (ext === 'heic') {
        rawFile = await heic2any({ blob: new Blob([rawFile], { type: rawFile.type }) })
      }

      let normalFile = await getNormalizedFile(rawFile, 0.7)
      const uploadFile = normalFile.size > rawFile.size ? rawFile : normalFile

      // TODO: upload to sharepoint
      let uploaded = await uploadFileToDocLibService(
        list.site,
        'DocumentStore/NinhTodo',
        uploadFile.name,
        uploadFile
      )

      await updateListItemService(list, storeID, {
        [columnName]: JSON.stringify({
          fileName: uploadFile.name,
          serverUrl: config.TENANT_URL,
          serverRelativeUrl: uploaded.ServerRelativeUrl
        })
      })

      getStoreInfo()
    } catch (error) {
      handleError(error, 'handleUpload')
    }

    setLoadingUploadFile(false)
  }

  const getStoreInfo = async () => {
    try {
      const data = await getItemService(list, storeID)

      const imageInfo = JSON.parse(data[columnName])

      setImageInfo(imageInfo)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    getStoreInfo()
  }, [storeID, columnName])

  return (
    <div style={{ width: width }}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: width, height: width, border: '1px solid #d9d9d9' }}>
        {imageInfo?.serverRelativeUrl ? (
          <SPImage site={list.site} serverRelativeUrl={imageInfo?.serverRelativeUrl} />
        ) : (
          ''
        )}
      </div>
      {mode === 'Edit' ? (
        <div>
          <Upload
            customRequest={() => {
              return
            }}
            onChange={handleUpload}
            fileList={[]}>
            <Button
              block
              type="primary"
              ghost
              loading={loadingUploadFile}
              icon={<i className="fa-solid fa-arrow-up-from-bracket"></i>}
              style={{ whiteSpace: 'normal', height: 'auto', marginTop: 5 }}>
              Upload Image
            </Button>
          </Upload>
        </div>
      ) : null}
    </div>
  )
}

ImageTodo.propTypes = propTypes
export default ImageTodo
