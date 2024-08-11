import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'

import { getItemsService } from '../../common/services'
import lists from '../../common/lists'
import SPPagination from '../../common/components/SPPagination'
import { handleError } from '../../common/helpers'
import ReportItem from './ReportItem'
// import clsx from 'clsx'

const EHSListPage = () => {
  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])

  const handGetReports = async () => {
    try {
      let data = await getItemsService(lists.EHS_Reporting, {
        select:
          'ID,EmployeeFullName,EmployeeGPID,EmployeeDepartmentName,WorkLocationType,Status,AreaID/ID,AreaID/AreaName,ServerityID/Title,ServerityID/ServerityName,ServerityID/Id,ServerityID/ServerityName,ReportSubjectID/Id,ReportSubjectID/ReportSubjectName,DateHappening',

        orderBy: 'ID desc',
        expand: 'ServerityID,AreaID,ServerityID,ReportSubjectID',
        top: 7
      })
      setReports(data.value)
      return data
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    setLoading(true)
    handGetReports()
    setLoading(false)
  }, [])

  return (
    <div className="p-8 min-h-[100vh]  bg-gray-100">
      <div className="d-flex flex-col">
        <h1 className="text-3xl font-semibold ">Danh sách báo cáo</h1>
        <span className="text-gray-400">Báo cáo trực tuyến an toàn, sức khoẻ & môi trường</span>
      </div>
      <div className="d-flex flex-col">
        <div className="justify-end d-flex gap-2">
          <Button
            shape="circle"
            type="ghost"
            className="bg-orange-300 text-white hover:opacity-55 border-none    rounded-full">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <Button type="primary" icon={<FontAwesomeIcon icon={faFilter} />}>
            Lọc
          </Button>
        </div>
        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {reports.map((report) => (
                <ReportItem key={report.Id} dataReport={report} />
              ))}
            </div>
            <SPPagination getItems={handGetReports} setItems={setReports} items={reports} />
          </>
        )}
      </div>
    </div>
  )
}

export default EHSListPage
