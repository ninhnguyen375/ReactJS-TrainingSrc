import { faBars, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Divider, Image } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { MODULE_EHSREPORTDETAIL } from '../../store/ehsreportdetail'
import dayjs from '../../common/dayjs'

function ReportHeader() {
  const { report, reportSubject } = useSelector((state) => state[MODULE_EHSREPORTDETAIL])
  return (
    <div className="sticky top-0 z-10  d-flex flex-col bg-white shadow-sm">
      <div className="d-flex justify-between p-4">
        <div className="d-flex gap-2 items-center">
          <div className="w-12 h-12">
            <Image className="w-full" preview={false} src="../../../avatar.png" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-xl">{reportSubject.ReportSubjectName}</h1>
            <span className="text-sm text-gray-400">
              ID : {report.ID} - Ngày tạo : {dayjs(report.DateCreated).format('DD/MM/YYYY')}
            </span>
          </div>
        </div>
        <div className="d-flex items-center gap-2 ">
          <Button type="primary" icon={<FontAwesomeIcon icon={faCheck} />}>
            Lưu báo cáo
          </Button>
          <Button icon={<FontAwesomeIcon icon={faBars} />}></Button>
        </div>
      </div>
      <Divider className="m-0" />
    </div>
  )
}

export default ReportHeader
