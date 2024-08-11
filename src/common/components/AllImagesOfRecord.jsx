import React, { useEffect, useState } from 'react'
import { Button, Image, Upload } from 'antd'
import PropTypes from 'prop-types'
import {
  addListItemService,
  deleteFileService,
  deleteListItemService,
  getFileService,
  getItemService,
  getItemsService,
  updateListItemService,
  uploadFileToDocLibService
} from '../services'
import { getNormalizedFile, handleError } from '../helpers'
import lists from '../lists'
import { useUI } from '../UIProvider'
import heic2any from 'heic2any'
import config from '../config'
import ImgCrop from 'antd-img-crop'

const propTypes = {
  width: PropTypes.number,
  listName: PropTypes.string,
  listImagesName: PropTypes.string,
  mode: PropTypes.oneOf(['View', 'Edit']),
  storeID: PropTypes.number,
  setStoreID: PropTypes.func
}

const AllImagesOfRecord = ({ listName, storeID, mode = 'Edit', listImagesName = 'ImageList' }) => {
  const listIMG = lists[listImagesName]

  const [loadingUpload, setLoadingUpload] = useState(false)
  const [imageList, setImageList] = useState([])
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [checkFile, setCheckFile] = useState(false)

  const ui = useUI()

  // Lấy danh sách các hình ảnh từ SharePoint và lưu vào imageList
  const getImageList = async () => {
    try {
      const data = await getItemsService(listIMG, {
        filter: `IDRecord eq ${storeID} and ListNameRecord eq '${listName}'`
      })

      const updatedImageList = await Promise.allSettled(
        data.value.map(async (item) => {
          const imageInfo = JSON.parse(item.Image)
          const image = await getFileService(listIMG.site, imageInfo.serverRelativeUrl)
          const previewImageUrl = URL.createObjectURL(image)

          return {
            ...item,
            previewImageUrl: previewImageUrl
          }
        })
      )

      setImageList(updatedImageList)
    } catch (error) {
      handleError(error, 'getImageList')
    }
  }

  useEffect(() => {
    getImageList()
  }, [storeID, listName])

  // Cập nhật fileList từ imageList
  useEffect(() => {
    const updatedFileList = imageList
      .filter((result) => result.status === 'fulfilled')
      .map((result) => ({
        uid: result.value.ID.toString(),
        ID: result.value.ID,
        name: JSON.parse(result.value.Image).fileName,
        status: 'done',
        url: result.value.previewImageUrl,
        serverRelativeUrl: JSON.parse(result.value.Image).serverRelativeUrl
      }))

    setFileList(updatedFileList)
  }, [imageList])

  // Hàm upload image mới
  const handleAdd = async ({ columnName = 'Image', file }) => {
    const ext = file.name.split('.').pop().toLowerCase()

    setLoadingUpload(true)
    try {
      let rawFile = file
      if (ext === 'heic') {
        rawFile = await heic2any({ blob: new Blob([rawFile], { type: rawFile.type }) })
      }

      // Lấy image từ Image đã cắt
      const image = new window.Image()
      image.src = URL.createObjectURL(rawFile)

      await new Promise((resolve) => {
        image.onload = resolve
      })

      const largerDimension = Math.max(image.width, image.height)
      const normalFile = await getNormalizedFile(rawFile, 0.9, largerDimension)
      const uploadFile = normalFile.size > rawFile.size ? rawFile : normalFile

      const newRecord = await addListItemService(listIMG, {
        IDRecord: storeID,
        ListNameRecord: listName
      })

      const newFileName = `${listName}_${storeID}_${newRecord.ID}_${uploadFile.name}`
      const uploaded = await uploadFileToDocLibService(
        listIMG.site,
        'ImageDocuments',
        newFileName,
        uploadFile
      )

      await updateListItemService(listIMG, newRecord.ID, {
        [columnName]: JSON.stringify({
          fileName: uploadFile.name,
          serverUrl: config.TENANT_URL,
          serverRelativeUrl: uploaded.ServerRelativeUrl
        })
      })

      await getImageList()
    } catch (error) {
      handleError(error, 'handleUpload')
    } finally {
      setLoadingUpload(false)
      setCheckFile(false)
    }
  }

  // Xóa hình ảnh
  const handleDelete = async (file) => {
    const columnDataDelete = 'Image'
    try {
      const data = await getItemService(listIMG, file.ID)
      const imageInfo = JSON.parse(data[columnDataDelete])

      await deleteFileService(listIMG.site, imageInfo.serverRelativeUrl)
      await deleteListItemService(listIMG, file.ID)
      await getImageList()

      if (previewVisible && previewImage === file.url) {
        setPreviewVisible(false)
        setPreviewImage('')
      }
    } catch (error) {
      handleError(error, 'handleDelete')
    }
  }

  // Set hình cho onPreview của Upload
  const onPreview = async (file) => {
    setPreviewImage(file.url)
    setPreviewVisible(true)
  }

  // Khi hình bị xóa, set previewImage của hình đó thành rỗng
  useEffect(() => {
    if (previewVisible && !fileList.some((file) => file.url === previewImage)) {
      setPreviewVisible(false)
      setPreviewImage('')
    }
  }, [fileList])

  // Xử lý trước khi upload để kiểm tra file có phải image không
  const beforeUpload = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'].includes(ext)) {
      ui.notiWarning('Please input an image')
      setCheckFile(false)
      return false
    } else {
      setCheckFile(true)
    }
    return file
  }

  return (
    <div className="flex flex-wrap gap-4">
      <ImgCrop rotationSlider beforeCrop={beforeUpload}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          customRequest={checkFile ? ({ file }) => handleAdd({ columnName: 'Image', file }) : null} // Xử lý cắt và tải hình cắt lên handleAdd
          onPreview={onPreview}
          onRemove={handleDelete}
          showUploadList={{
            showRemoveIcon: mode === 'Edit',
            showPreviewIcon: true
          }}>
          {mode === 'Edit' && (
            <Button
              type="primary"
              ghost
              loading={loadingUpload}
              className="flex flex-col items-center justify-center gap-1.25 whitespace-normal"
              style={{ width: '100%', height: '100%' }}>
              + Upload
            </Button>
          )}
        </Upload>
      </ImgCrop>

      {previewVisible && (
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: (visible) => {
              setPreviewVisible(visible)
            }
          }}>
          <Image
            width={0}
            height={0}
            src={previewImage}
            className="auto-preview"
            onClick={() => setPreviewVisible(true)}
          />
        </Image.PreviewGroup>
      )}
    </div>
  )
}

AllImagesOfRecord.propTypes = propTypes
export default AllImagesOfRecord
