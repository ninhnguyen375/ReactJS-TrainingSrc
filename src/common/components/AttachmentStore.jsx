import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useUI } from '../UIProvider'
import { bytesToSize, getFileExtension, getIconByFileType, handleError } from '../helpers'
import {
  addListItemService,
  deleteFileService,
  getAttachmentsService,
  getFileInfoService,
  getFileService,
  uploadFileService
} from '../services'
import PropTypes from '../PropTypes'
import fileDownload from 'js-file-download'
import lists from '../lists'
import PreviewFile from './PreviewFile'
import Dragger from 'antd/es/upload/Dragger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

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
  maxFileSize: PropTypes.object,
  multiple: PropTypes.bool,
  bypassClickToStart: PropTypes.bool,
  accept: PropTypes.string,
  list: PropTypes.object
}

const AttachmentStore = ({
  list = lists.AttachmentStore,
  storeID,
  setStoreID,
  setAttachments,
  listSharepointName,
  mode = 'edit',
  maxCount = 5,
  maxFileSize = { size: 25, unit: 'MB' },
  setFileName = () => {},
  bypassClickToStart = true,
  accept = '',
  ...props
}) => {
  // state
  const [fileList, setFileList] = useState([])
  const [selectedDeleteFile, setSelectedDeleteFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  // hook
  const ui = useUI()

  useEffect(() => {
    handleGetAttFromStore()
  }, [storeID])

  const handleUpload = async ({ file }) => {
    try {
      await uploadFileService(list, storeID, file.name, file)

      handleGetAttFromStore()
    } catch (error) {
      const message = handleError(error)
      if (message === 'Tên file đã tồn tại') {
        ui.notiError(message)
      }
    }
  }

  const handleGetAttFromStore = async () => {
    if (!storeID) {
      return
    }

    try {
      const atts = await getAttachmentsService(list, storeID)

      const fileInfoPromises = atts.value.map(async (att) => {
        let value = await getFileInfoService(list.site, att.ServerRelativeUrl)
        return {
          uid: att.FileName,
          name: att.FileName,
          status: 'done',
          url: '#',
          fileInfo: value,
          ...att
        }
      })

      const newFileList = await Promise.all(fileInfoPromises)

      setFileList([...newFileList])

      if (newFileList.length > 0) {
        setFileName(newFileList[0].name)
      }

      !!setAttachments && setAttachments(newFileList)
    } catch (error) {
      handleError(error, 'handleGetAttFromStore')
    }
  }

  const beforeUpload = (file) => {
    const acceptedFileTypes = accept ? accept.split(',').map((type) => type.trim()) : null
    const isAcceptedFileType = acceptedFileTypes ? acceptedFileTypes.includes(file.type) : true
    if (!isAcceptedFileType) {
      ui.notiError(`You can only upload ${accept} file types!`)
    }

    const maxSizeInBytes = maxFileSize.size * (maxFileSize.unit === 'MB' ? 1024 * 1024 : 1024)
    const isBelowMaxSize = file.size < maxSizeInBytes
    if (!isBelowMaxSize) {
      ui.notiError(`File must be smaller than ${maxFileSize.size}${maxFileSize.unit}!`)
    }

    return isAcceptedFileType && isBelowMaxSize
  }

  const handleOnClickFile = async (item) => {
    ui.setLoading(true)
    let file = item
    if (!file.fileContent) {
      let fileContent = await getFileService(list.site, item.ServerRelativeUrl)
      let fileInfo = await getFileInfoService(list.site, item.ServerRelativeUrl)
      file.fileContent = fileContent
      file.fileInfo = fileInfo

      const newList = fileList.map((f) => (f.FileName === file.FileName ? file : f))
      setFileList(newList)
    }
    if (
      ['jpg', 'jpeg', 'png', 'gif', 'heic', 'pdf', 'mp4', 'webm', 'ogg', 'docx', 'xlsx'].includes(
        getFileExtension(file?.FileName) // set for DocIcon
      )
    ) {
      setSelectedFile({
        fileName: file.FileName,
        fileContent: file.fileContent,
        fileInfo: file.fileInfo
      })
    } else {
      fileDownload(file.fileContent, file.FileName)
    }
    ui.setLoading(false)
  }

  const handleDeleteFile = async () => {
    await deleteFileService(list.site, selectedDeleteFile.ServerRelativeUrl)
    handleGetAttFromStore()
    setSelectedDeleteFile(null)
  }

  const initStoreID = async () => {
    try {
      if (!storeID) {
        const createdItem = await addListItemService(list, {
          ListSharepointName: listSharepointName
        })
        setStoreID(createdItem.ID)
      }
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    if (bypassClickToStart) {
      initStoreID()
    }
  }, [])

  return (
    <div className="p-4" {...props}>
      {selectedFile !== null && (
        <PreviewFile file={selectedFile} onCancel={() => setSelectedFile(null)} site={list.site} />
      )}

      <h2 className="text-lg font-bold">Upload and attach file</h2>
      <div className="my-3 ">
        <Dragger
          disabled={mode === formMode.view || fileList.length >= maxCount}
          fileList={[]}
          customRequest={handleUpload}
          beforeUpload={beforeUpload}
          accept={accept}>
          {fileList.length < maxCount ? (
            <>
              <div className=" p-1 border-1 border-solid border-gray-400 ">
                <FontAwesomeIcon icon={faUpload} className="text-xl text-[#5ac2dc]" />
              </div>
              <p className="mt-2">
                <span className={`text-[#5ac2dc]`}>Click to Upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                (Max. File size: {maxFileSize.size}
                {maxFileSize.unit}{' '}
                {maxCount === fileList.length ? '' : `| Max. File count: ${maxCount}`})
              </p>
            </>
          ) : (
            <p className="text-xs text-red-500">Max file count reached</p>
          )}
        </Dragger>
      </div>

      <div className="my-2">
        {fileList.map((item, index) => (
          <div
            onClick={() => handleOnClickFile(item)}
            key={index}
            className="cursor-pointer flex items-center justify-between px-2 py-2 mt-2 border-solid border-gray-400 border rounded-sm ">
            <div className="flex items-center w-11/12">
              <div className={` d-flex items-center justify-center  w-1/12 `}>
                <FontAwesomeIcon
                  icon={getIconByFileType(getFileExtension(item?.FileName))} // set for DocIcon
                  className={` text-[#5ac2dc]`}
                />
              </div>
              <div className="ml-2 w-11/12">
                <p className="text-sm break-words  ">{item.FileName}</p>
                <p className="text-xs text-gray-500">
                  Size: {bytesToSize(item.fileInfo.Length)} Uploaded:{' '}
                  {moment(item.fileInfo.TimeCreated).fromNow()}
                </p>
              </div>
            </div>

            <FontAwesomeIcon
              onClick={(e) => {
                e.stopPropagation() // Stop the click event from bubbling up to the parent div
                setSelectedDeleteFile(item)
              }}
              icon={faTrashAlt}
              className="text-gray-400 cursor-pointer  w-1/12 hover:text-red-500 active:text-red-300"
            />
          </div>
        ))}
      </div>
      {selectedDeleteFile !== null && (
        <Modal
          title={<h1>Confirm delete</h1>}
          open={selectedDeleteFile !== null}
          onCancel={() => {
            setSelectedDeleteFile(null)
          }}
          onOk={handleDeleteFile}
          okButtonProps={{
            icon: <i className="ms-1 fa-solid fa-trash text-white w-[22px] cursor-pointer "></i>,
            danger: true
          }}
          cancelButtonProps={{
            icon: <i className="fa-solid fa-xmark w-[25px] cursor-pointer "></i>
          }}
          centered>
          <p className="py-3">Are you sure want to delete this file?</p>
        </Modal>
      )}
    </div>
  )
}

AttachmentStore.propTypes = propTypes

export default AttachmentStore
