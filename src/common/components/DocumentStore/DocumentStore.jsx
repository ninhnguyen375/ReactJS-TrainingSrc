// src/components/UploadCard.js
import React, { useEffect, useState } from 'react'
import { Button, Form, Image, Input, Modal } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faSave, faUpload } from '@fortawesome/free-solid-svg-icons'
import Dragger from 'antd/es/upload/Dragger'
import {
  addFolderService,
  deleteFileService,
  deleteFolderService,
  getFileService,
  getItemsService,
  updateListItemService,
  uploadFileToDocLibService
} from '../../services'
import lists from '../../lists'
import PropTypes from '../../PropTypes'
import { handleError, removeGuidFromFileName } from '../../helpers'
import fileDownload from 'js-file-download'
import heic2any from 'heic2any'
import { useUI } from '../../UIProvider'
import PreviewFile from '../PreviewFile'
import DocumentItem from './DocumentItem'
import DocumentURl from './DocumentURl'
import { v4 } from 'uuid'
import { documentFieldSelect, supportDocumentTypeList } from '.'

const propTypes = {
  list: PropTypes.object,
  dataSource: PropTypes.string,
  mode: PropTypes.string,
  folder: PropTypes.string,
  storeID: PropTypes.number,
  accept: PropTypes.string,
  maxCount: PropTypes.number,
  maxFileSize: PropTypes.object
}

function DocumentStore({
  list = lists.DocumentStore,
  mode = 'Edit',
  folder = '/Projects/EHS-GEMBA/DocumentStore',
  storeID,
  maxFileSize = { size: 25, unit: 'MB' },
  maxCount = Infinity,
  accept = ''
}) {
  const [fileList, setFileList] = useState([])
  const [selectedDeleteFile, setSelectedDeleteFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [currentURL, setCurrentURL] = useState([{ folderName: 'abcde_Root', URL: folder }])
  const [isShowSaveFolder, setIsShowSaveFolder] = useState(false)
  const [isGettingFiles, setIsGettingFiles] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingFolder, setIsSavingFolder] = useState(false)
  const [isDeletingItem, setIsDeletingItem] = useState(false)
  const [folderFormMode, setFolderFormMode] = useState('')

  const ui = useUI()
  const [form] = Form.useForm()

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

  const handleGetFiles = async (folder) => {
    setIsGettingFiles(true)
    const data = await getItemsService(lists.DocumentStore, {
      filter: `RefID eq '${storeID}' and DataSource eq '${list.listName}' and FileDirRef eq '${folder}'`,
      select: documentFieldSelect,
      orderBy: ' FSObjType desc,Created desc '
    })
    setFileList(data.value)
    setIsGettingFiles(false)
  }

  const handleDeleteFile = async () => {
    setIsDeletingItem(true)
    if (selectedDeleteFile.DocIcon) {
      await deleteFileService(list.site, selectedDeleteFile.ServerUrl)
    } else {
      await deleteFolderService(list.site, selectedDeleteFile.ServerUrl)
    }
    setFileList(fileList.filter((i) => i.ID !== selectedDeleteFile.ID))
    setSelectedDeleteFile(null)
    setIsDeletingItem(false)
  }

  const handleUploadFile = async ({ file }) => {
    setIsUploading(true)
    const ext = file.name.split('.').pop().toLocaleLowerCase()

    try {
      let rawFile = file

      if (ext === 'heic') {
        rawFile = await heic2any({ blob: new Blob([rawFile], { type: rawFile.type }) })
      }

      const uniqueFileName = `${v4()}_${rawFile.name}`
      const currentURLString = currentURL[currentURL.length - 1].URL
      //  upload to sharepoint
      let uploaded = await uploadFileToDocLibService(
        list.site,
        currentURLString,
        uniqueFileName,
        rawFile
      )
      const data = await getItemsService(lists.DocumentStore, {
        filter: `FileLeafRef eq '${uploaded.Name}' `,
        select: documentFieldSelect
      })
      await updateListItemService(lists.DocumentStore, data.value[0].ID, {
        RefID: storeID,
        DataSource: list.listName
      })

      setFileList((prev) => [
        { ...data.value[0], RefID: storeID, DataSource: list.listName },
        ...prev
      ])
    } catch (error) {
      handleError(error, 'handleUpload')
    }
    setIsUploading(false)
  }

  const handleOnClickFile = async (item) => {
    //item is folder
    if (item.DocIcon === null) {
      setCurrentURL((prev) => [...prev, { folderName: item.FileLeafRef, URL: item.FileRef }])
      const data = await getItemsService(lists.DocumentStore, {
        filter: `FileDirRef eq '${item.FileRef}'`,
        select: documentFieldSelect
      })
      setFileList(data.value)
    }
    //item is file
    else {
      ui.setLoading(true)

      let file = item
      //file already fetched
      if (!file.fileContent) {
        let fileContent = await getFileService(list.site, item.ServerUrl)
        file.fileContent = fileContent

        setFileList((prev) => prev.map((f) => (f.ID === item.ID ? file : f)))
      }
      if (supportDocumentTypeList.includes(item.DocIcon)) {
        setSelectedFile({
          fileName: removeGuidFromFileName(file.FileLeafRef),
          fileContent: file.fileContent,
          fileInfo: file
        })
      } else {
        fileDownload(file.fileContent, removeGuidFromFileName(file.FileLeafRef))
      }
      ui.setLoading(false)
    }
  }

  const handleOnClickPreviousFolder = (item) => {
    let index = currentURL.findIndex((f) => f.URL === item.URL)
    setCurrentURL(currentURL.slice(0, index + 1))
  }

  const handleSaveFolder = async (value) => {
    if (fileList.find((f) => removeGuidFromFileName(f.FileLeafRef) === value.folderName)) {
      ui.notiError('Folder already exists')
      ui.setLoading(false)
      return
    }
    setIsSavingFolder(true)
    if (folderFormMode === 'New') {
      const folderURL = `${currentURL[currentURL.length - 1].URL}/${v4()}_${value.folderName}`
      await addFolderService(list.site, folderURL)
      const data = await getItemsService(lists.DocumentStore, {
        filter: `FileRef eq '${folderURL}'`,
        select: documentFieldSelect
      })
      await updateListItemService(lists.DocumentStore, data.value[0].ID, {
        RefID: storeID,
        DataSource: list.listName
      })
      setFileList((prev) => [
        ...prev,
        { ...data.value[0], RefID: storeID, DataSource: list.listName }
      ])
    } else {
      await updateListItemService(lists.DocumentStore, selectedFolder.ID, {
        FileLeafRef: `${v4()}_${value.folderName}`
      })
      const uploaded = await getItemsService(lists.DocumentStore, {
        filter: `ID eq ${selectedFolder.ID}`,
        select: documentFieldSelect
      })
      const newFileList = fileList.map((f) => {
        return f.ID === selectedFolder.ID ? uploaded.value[0] : f
      })
      setFileList(newFileList)
    }
    setIsShowSaveFolder(false)
    form.resetFields()

    setIsSavingFolder(false)
  }

  const handleOnClickRenameFolder = (item) => {
    setIsShowSaveFolder(true)
    setFolderFormMode('Edit')
    setSelectedFolder(item)
    form.setFieldsValue({
      folderName: removeGuidFromFileName(item.FileLeafRef)
    })
  }

  useEffect(() => {
    handleGetFiles(currentURL[currentURL.length - 1].URL)
  }, [currentURL])

  return (
    <div>
      {selectedFile !== null && (
        <PreviewFile file={selectedFile} onCancel={() => setSelectedFile(null)} site={list.site} />
      )}

      <div className="my-3 ">
        <Dragger
          disabled={mode === 'View' || fileList.length >= maxCount || isUploading}
          fileList={[]}
          customRequest={handleUploadFile}
          beforeUpload={beforeUpload}
          accept={accept}>
          {fileList.length < maxCount ? (
            isUploading ? (
              <Image src="/spinner_v2.gif" preview={false} width={70} />
            ) : (
              <>
                <div className=" p-1 border-1 border-solid border-gray-400 ">
                  <FontAwesomeIcon icon={faUpload} className="text-xl text-[#5ac2dc]" />
                </div>
                <p className="mt-2">
                  <span className={`text-[#5ac2dc]`}>Click to Upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  (Max. File size: {maxFileSize.size}
                  {maxFileSize.unit} {maxCount === Infinity ? '' : `| Max. File count: ${maxCount}`}
                  )
                </p>
              </>
            )
          ) : (
            <p className="text-xs text-red-500">Max file count reached</p>
          )}
        </Dragger>
      </div>
      <DocumentURl
        currentURL={currentURL}
        handleOnClickPreviousFolder={handleOnClickPreviousFolder}
        setIsShowSaveFolder={setIsShowSaveFolder}
        setFolderFormMode={setFolderFormMode}
      />
      <div className="my-2">
        {isGettingFiles || isUploading ? (
          <div className="d-flex flex-col justify-center items-center">
            <Image width={70} src="/spinner_v2.gif" preview={false} />
            <span>Loading data....</span>
          </div>
        ) : (
          fileList.map((item) => (
            <DocumentItem
              key={item.ID}
              item={item}
              handleOnClickFile={handleOnClickFile}
              handleOnClickRenameFolder={handleOnClickRenameFolder}
              setSelectedDeleteFile={setSelectedDeleteFile}
            />
          ))
        )}
      </div>
      <Modal
        title={<h1>Confirm delete</h1>}
        open={selectedDeleteFile !== null}
        onCancel={() => {
          if (!isDeletingItem) setSelectedDeleteFile(null)
        }}
        onOk={handleDeleteFile}
        okButtonProps={{
          icon: <i className="ms-1 fa-solid fa-trash text-white w-[22px] cursor-pointer "></i>,
          danger: true,
          loading: isDeletingItem
        }}
        cancelButtonProps={{
          icon: <i className="fa-solid fa-xmark w-[25px] cursor-pointer "></i>
        }}
        centered>
        <p className="py-3">Are you sure want to delete this file?</p>
      </Modal>

      <Modal
        title={<h1>Create a folder</h1>}
        open={isShowSaveFolder}
        cancelButtonProps={null}
        onCancel={() => {
          if (!isSavingFolder) setIsShowSaveFolder(false)
        }}
        footer={[]}
        centered>
        <Form
          form={form}
          layout="vertical"
          className="mt-3"
          onFinish={(value) => handleSaveFolder(value)}>
          <Form.Item
            name="folderName"
            label="Name"
            rules={[{ required: true, message: 'Please enter folder name' }]}>
            <Input />
          </Form.Item>
          <Form.Item hidden={true} name="item"></Form.Item>
          <div className="d-flex justify-end gap-2">
            <Button
              key="cancel"
              type="default"
              icon={<FontAwesomeIcon icon={faClose} />}
              onClick={() => {
                if (!isSavingFolder) setIsShowSaveFolder(false)
              }}>
              Cancel
            </Button>

            <Button
              key="add"
              icon={<FontAwesomeIcon icon={faSave} />}
              type="primary"
              htmlType="submit"
              loading={isSavingFolder}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

DocumentStore.propTypes = propTypes
export default DocumentStore
