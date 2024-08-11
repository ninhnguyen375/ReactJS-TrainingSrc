import React, { useEffect, useState } from 'react'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { Modal } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import fileDownload from 'js-file-download'
import PropTypes from '../../common/PropTypes'
import { getFileExtension, getIconByFileType } from '../helpers'

const propTypes = {
  file: PropTypes.object,
  onCancel: PropTypes.func,
  site: PropTypes.string
}

function PreviewFile({
  file = { fileName: '', fileContent: '', fileInfo: '' },
  onCancel,
  site = ''
}) {
  const [fileURI, setFileURI] = useState(null)
  const [iframeString, setIframeString] = useState(null)
  const [fileContent, setFileContent] = useState(null)

  useEffect(() => {
    const uri = URL.createObjectURL(file.fileContent)
    setFileURI(uri)
    setIframeString(`<iframe
          src='${site}/_layouts/15/Doc.aspx?sourcedoc={${
      file.fileInfo.UniqueId
    }}&amp;action=embedview'
          width="100%"
          height=${window.innerHeight - 200}
          frameborder="0">
          This is an embedded{' '}
          <a target="_blank" href="https://office.com">
            Microsoft Office
          </a>{' '}
          document, powered by{' '}
          <a target="_blank" href="https://office.com/webapps">
            Office
          </a>
          .
        </iframe>`)
    if (file.fileName.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = function (event) {
        setFileContent(event.target.result)
      }
      reader.readAsText(file.fileContent)
    }
  }, [])

  return (
    <div className="w-screen">
      <Modal
        open={true}
        onCancel={() => onCancel()}
        width={window.innerWidth < 768 ? '100vw' : '60vw'}
        closable={false}
        footer={[]}>
        <div className="px-1 xl:px-5 py-3 d-flex justify-between items-center position-fixed top-0 w-screen left-0">
          <FontAwesomeIcon
            className="text-[#c4c7c5] text-[20px] cursor-pointer active:text-white w-2/12"
            icon={faArrowLeft}
            onClick={() => onCancel()}
          />
          <div className="d-flex items-center justify-center gap-3 w-6/12 ">
            <FontAwesomeIcon
              className="text-[#5ac2dc] text-[20px] w-1/12"
              icon={getIconByFileType(getFileExtension(file?.fileName))}
            />
            <h1 className="text-white w-11/12">{file.fileName}</h1>
          </div>
          <FontAwesomeIcon
            className="text-[#c4c7c5] text-[20px] cursor-pointer active:text-white w-4/12 "
            icon={faDownload}
            onClick={() => fileDownload(file.fileContent, file.fileName)}
          />
        </div>
        <div className="w-full d-flex justify-center">
          {fileURI &&
            (() => {
              if (file.fileName.toLowerCase().endsWith('.pdf')) {
                return (
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={fileURI} />
                  </Worker>
                )
              } else if (
                file.fileName.toLowerCase().endsWith('.jpg') ||
                file.fileName.toLowerCase().endsWith('.jpeg') ||
                file.fileName.toLowerCase().endsWith('.png') ||
                file.fileName.toLowerCase().endsWith('.gif') ||
                file.fileName.toLowerCase().endsWith('.heic')
              ) {
                return <img src={fileURI} alt={file.fileName} className="p-2" />
              } else if (
                file.fileName.toLowerCase().endsWith('.xls') ||
                file.fileName.toLowerCase().endsWith('.xlsx') ||
                file.fileName.toLowerCase().endsWith('.doc') ||
                file.fileName.toLowerCase().endsWith('.docx') ||
                file.fileName.toLowerCase().endsWith('.docm') ||
                file.fileName.toLowerCase().endsWith('.pptm') ||
                file.fileName.toLowerCase().endsWith('.pptx')
              ) {
                return (
                  <div
                    className="w-full "
                    dangerouslySetInnerHTML={{ __html: iframeString ? iframeString : '' }}></div>
                )
              } else if (file.fileName.toLowerCase().endsWith('.txt')) {
                return <pre>{fileContent}</pre>
              }
            })()}
        </div>
      </Modal>
    </div>
  )
}

PreviewFile.propTypes = propTypes
export default PreviewFile
