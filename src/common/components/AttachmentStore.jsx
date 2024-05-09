import { Button, Popconfirm, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { useUI } from '../UIProvider'
import { handleError } from '../helpers'
import {
  addListItemService,
  deleteFileService,
  getAttachmentsService,
  getFileService,
  uploadFileService
} from '../services'
import config from '../config'
import PropTypes from '../PropTypes'
import fileDownload from 'js-file-download'
import SPImage from './SPImage'
import lists from '../lists'

const formMode = {
  view: 'view',
  edit: 'edit'
}

const propTypes = {
  storeID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setStoreID: PropTypes.func,
  setAttachments: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  preloadImage: PropTypes.bool,
  listSharepointName: PropTypes.string,
  mode: PropTypes.string,
  setFileName: PropTypes.func,
  maxCount: PropTypes.number,
  multiple: PropTypes.bool,
  bypassClickToStart: PropTypes.bool
}

const AttachmentStore = ({
  storeID,
  setStoreID,
  setAttachments,
  preloadImage = true,
  listSharepointName,
  mode = 'edit',
  maxCount = 5,
  setFileName = () => {},
  bypassClickToStart = true,
  multiple = true,
  ...props
}) => {
  // state
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingDownloadFile, setLoadingDownloadFile] = useState([])
  const [loadingUploadFile, setLoadingUploadFile] = useState(false)
  const [isShowClickToStart, setIsShowClickToStart] = useState(!!storeID || mode === formMode.view)
  const [loadingStartUpload, setLoadingStartUpload] = useState(false)
  // hook
  const ui = useUI()

  useEffect(() => {
    handleGetAttFromStore()
    setIsShowClickToStart(!!storeID || mode === formMode.view)
  }, [storeID])

  const handleUpload = async ({ onSuccess, onProgress, file }) => {
    setLoadingUploadFile(true)

    try {
      const uploaded = await uploadFileService(
        lists.AttachmentStore,
        storeID,
        file.name,
        file,
        ({ total, loaded }) => {
          onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file)
        }
      )

      const newFile = {
        uid: fileList.length,
        name: uploaded.FileName,
        status: 'done',
        ...uploaded
      }

      onSuccess(newFile, file)

      handleGetAttFromStore()
    } catch (error) {
      const message = handleError(error)
      if (message === 'Tên file đã tồn tại') {
        ui.notiError(message)
      }
    }

    setLoadingUploadFile(false)
  }

  const handleGetAttFromStore = async () => {
    if (!storeID) {
      return
    }

    setLoading(true)

    try {
      const atts = await getAttachmentsService(lists.AttachmentStore, storeID)

      const newFileList = atts.value.map((att) => ({
        uid: att.FileName,
        name: att.FileName,
        status: 'done',
        url: '#',
        ...att
      }))

      setFileList([...newFileList])

      if (newFileList.length > 0) {
        setFileName(newFileList[0].name)
      }

      !!setAttachments && setAttachments(newFileList)
    } catch (error) {
      handleError(error, 'handleGetAttFromStore')
    }

    setLoading(false)
  }

  const handleDownloadFile = async (file) => {
    setLoadingDownloadFile({ [file.uid]: true })

    try {
      const content = await getFileService(config.PTW_CSM_SITE, file.ServerRelativeUrl)

      fileDownload(content, file.name)
    } catch (error) {
      handleError(error)
    }

    setLoadingDownloadFile({ [file.uid]: false })
  }

  const handleRemoveFile = async (file) => {
    try {
      await deleteFileService(config.PTW_CSM_SITE, file.ServerRelativeUrl)

      handleGetAttFromStore()
    } catch (error) {
      handleError(error)
    }
  }

  const itemRender = (node, file) => {
    const ext = file.name.split('.').pop().toLocaleLowerCase()
    const itemHeight = preloadImage ? 50 : 20

    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          borderRadius: '4px',
          border: '1px solid #d9d9d9',
          marginTop: '5px',
          height: itemHeight + 10,
          padding: 5
        }}>
        <div>
          {['jpg', 'jpeg', 'png', 'gif'].includes(ext) && preloadImage ? (
            <>
              <SPImage
                height={itemHeight}
                site={config.PTW_CSM_SITE}
                serverRelativeUrl={file.ServerRelativeUrl}
              />
              <span className="ms-2">{file.name}</span>
            </>
          ) : (
            <>
              <Button
                size="small"
                type="text"
                title={file.name}
                onClick={() => handleDownloadFile(file)}
                loading={loadingDownloadFile[file.uid]}
                icon={<i className="fa-solid fa-download"></i>}>
                {file.name.slice(0, 25)}
                {file.name.length > 25 ? '...' : ''}
              </Button>
            </>
          )}
        </div>

        <Popconfirm
          okType="danger"
          title="Remove this file?"
          disabled={mode === 'view'}
          onConfirm={() => handleRemoveFile(file)}>
          <Button
            disabled={mode === 'view'}
            size="small"
            danger
            type="text"
            icon={<i className="ms-1 fa-solid fa-trash"></i>}></Button>
        </Popconfirm>
      </div>
    )
  }

  const initStoreID = async () => {
    setLoadingStartUpload(true)

    try {
      if (!storeID) {
        const createdItem = await addListItemService(lists.AttachmentStore, {
          ListSharepointName: listSharepointName
        })

        !!setStoreID && setStoreID(createdItem.ID)
      }
      setIsShowClickToStart(true)
    } catch (error) {
      handleError(error)
    }

    setLoadingStartUpload(false)
  }

  useEffect(() => {
    if (bypassClickToStart) {
      initStoreID()
    }
  }, [])

  return (
    <div {...props}>
      {isShowClickToStart && mode ? (
        <Upload
          onDownload={handleDownloadFile}
          customRequest={handleUpload}
          itemRender={itemRender}
          maxCount={maxCount}
          type="drag"
          multiple={multiple}
          disabled={mode === formMode.view || maxCount <= fileList.length}
          onRemove={handleRemoveFile}
          fileList={fileList}>
          {mode === formMode.edit && fileList.length < maxCount ? (
            <Button
              type="text"
              loading={loadingUploadFile || loading}
              icon={<i className="fa-regular fa-folder-open"></i>}>
              Chọn file hoặc kéo thả
            </Button>
          ) : null}
        </Upload>
      ) : (
        <Button
          loading={loadingStartUpload}
          block
          type="primary"
          ghost
          icon={<i className="fa-solid fa-paperclip"></i>}
          onClick={() => initStoreID()}>
          Đính kèm file
        </Button>
      )}
    </div>
  )
}

AttachmentStore.propTypes = propTypes

export default AttachmentStore
