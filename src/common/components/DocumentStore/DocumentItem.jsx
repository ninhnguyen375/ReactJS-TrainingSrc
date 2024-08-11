// src/components/UploadCard.js
import React, { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { bytesToSize, getIconByFileType, removeGuidFromFileName } from '../../helpers'
import moment from 'moment'
import PropTypes from '../../PropTypes'

const propTypes = {
  item: PropTypes.object,
  handleOnClickFile: PropTypes.func,
  handleOnClickRenameFolder: PropTypes.func,
  setSelectedDeleteFile: PropTypes.func
}

function DocumentItem({
  item,
  handleOnClickFile,
  handleOnClickRenameFolder,
  setSelectedDeleteFile
}) {
  return (
    <div
      onClick={() => handleOnClickFile(item)}
      key={item.ID}
      className="cursor-pointer flex items-center justify-between px-2 py-2 mt-2 border-solid border-gray-400 border rounded-sm ">
      <div className="flex items-center w-11/12">
        <div className={` d-flex items-center justify-center  w-1/12 `}>
          {item.DocIcon === null ? (
            <FontAwesomeIcon icon={faFolder} className="text-yellow-200" />
          ) : (
            <FontAwesomeIcon icon={getIconByFileType(item.DocIcon)} className={` text-[#5ac2dc]`} />
          )}
        </div>
        <div className="ml-2 w-11/12">
          <p className="text-sm break-words  ">{removeGuidFromFileName(item.FileLeafRef)}</p>
          <p className="text-xs text-gray-500">
            {item.DocIcon ? `Size: ${bytesToSize(item.FileSizeDisplay)} ` : null} Uploaded:{' '}
            {moment(item.Created).fromNow()}
          </p>
        </div>
      </div>

      <div className="w-1/12 d-flex justify-end gap-3 px-2">
        {item.DocIcon === null && (
          <FontAwesomeIcon
            onClick={(e) => {
              e.stopPropagation() // Stop the click event from bubbling up to the parent div
              handleOnClickRenameFolder(item)
            }}
            icon={faPencil}
            className="text-gray-400 cursor-pointer  hover:text-blue-500 active:text-blue-300"
          />
        )}
        <FontAwesomeIcon
          onClick={(e) => {
            e.stopPropagation() // Stop the click event from bubbling up to the parent div
            setSelectedDeleteFile(item)
          }}
          icon={faTrashAlt}
          className="text-gray-400 cursor-pointer  hover:text-red-500 active:text-red-300"
        />
      </div>
    </div>
  )
}
DocumentItem.propTypes = propTypes
export default memo(DocumentItem)
