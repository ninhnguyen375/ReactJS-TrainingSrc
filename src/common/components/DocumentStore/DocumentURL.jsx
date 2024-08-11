import React, { memo } from 'react'
import { Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faFolder } from '@fortawesome/free-solid-svg-icons'
import { removeGuidFromFileName } from '../../helpers'
import PropTypes from '../../PropTypes'

const propTypes = {
  currentURL: PropTypes.array,
  handleOnClickPreviousFolder: PropTypes.func,
  setIsShowSaveFolder: PropTypes.func,
  setFolderFormMode: PropTypes.func
}

function DocumentURl({
  currentURL,
  handleOnClickPreviousFolder,
  setIsShowSaveFolder,
  setFolderFormMode
}) {
  return (
    <div className="d-flex justify-between  items-center">
      <div className="d-flex flex-wrap gap-2 items-center ">
        {currentURL.map((item, index) =>
          index === currentURL.length - 1 ? (
            <h2 key={index} className="text-lg font-bold">
              {removeGuidFromFileName(item.folderName)}
            </h2>
          ) : (
            <div className="d-flex items-center gap-1 " key={index}>
              <Button size="small" type="text" onClick={() => handleOnClickPreviousFolder(item)}>
                <span className="text-gray-400">{removeGuidFromFileName(item.folderName)}</span>
              </Button>
              <FontAwesomeIcon icon={faChevronRight} className="text-base text-gray-300" />
            </div>
          )
        )}
      </div>
      <Button
        type="primary"
        icon={<FontAwesomeIcon icon={faFolder} />}
        onClick={() => {
          setIsShowSaveFolder(true)
          setFolderFormMode('New')
        }}>
        Add folder
      </Button>
    </div>
  )
}

DocumentURl.propTypes = propTypes
export default memo(DocumentURl)
