import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingCircleArrowRight } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons'
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt'

const propTypes = {
  dataReport: PropTypes.object
}

const ReportItem = ({ dataReport }) => {
  const severityClassName = clsx('absolute right-0 bottom-0 py-1 px-2 text-white rounded-br-lg', {
    // ['bg-green-500']: true,
    ['bg-yellow-500']: dataReport?.ServerityID?.ServerityName === 'Nhẹ',
    ['bg-orange-500']: dataReport?.ServerityID?.ServerityName === 'Trung bình',
    ['bg-red-500']: dataReport?.ServerityID?.ServerityName === 'Nghiêm trọng',
    ['bg-red-800']: dataReport?.ServerityID?.ServerityName === 'Cực kì nghiêm trọng',
    ['bg-gray-500']: !['Nhẹ', 'Trung bình', 'Nghiêm trọng', 'Cực kì nghiêm trọng'].includes(
      dataReport?.ServerityID?.ServerityName
    )
  })

  return (
    <div className="flex-grow d-flex flex-col py-10 px-4 relative gap-3 rounded-lg bg-white shadow-md cursor-pointer hover:shadow-lg  duration-500 hover:translate-y-2 ">
      <span className="absolute left-0 top-0 py-1 px-3 bg-primaryColor text-white rounded-tl-lg">
        {dataReport.Id}
      </span>
      <div className="d-flex items-center gap-2">
        <Image
          width={40}
          height={40}
          preview={false}
          className="rounded-full"
          src="../../../avatar.png"
          alt="Logo"
        />
        <span className=" flex-1 font-semibold text-lg">
          {dataReport?.ReportSubjectID?.ReportSubjectName}
        </span>
      </div>
      <div className="p-1 gap-2 flex flex-col  text-gray-500 text-sm ">
        <div className="d-flex  gap-2 items-center">
          <FontAwesomeIcon icon={faUserAlt} />
          <span className="">
            {dataReport?.EmployeeFullName} - {dataReport?.EmployeeDepartmentName}
          </span>
        </div>
        <div className="d-flex  gap-2 items-center">
          <FontAwesomeIcon icon={faBuildingCircleArrowRight} />
          <span className="">
            {' '}
            {dataReport?.WorkLocationType}- {dataReport?.AreaID?.AreaName}
          </span>
        </div>
        <div className="d-flex  gap-2 items-center">
          <FontAwesomeIcon icon={faCalendarCheck} />
          <span className="">{dataReport?.DateHappening}</span>
        </div>
        {/* <div className="d-flex  gap-2 items-center">
          <FontAwesomeIcon icon={faCalendar} />
          <span className="">{dataReport?.severity}</span>
        </div> */}

        {/* <div className="">{dataReport?.severity}</div> */}
      </div>
      {dataReport?.ServerityID?.ServerityName && (
        <span className={severityClassName}>{dataReport?.ServerityID?.ServerityName}</span>
      )}
      <div className="absolute d-flex flex-col top-2 -right-2 px-3 py-[1px] rounded-sm bg-red-400 text-white ">
        <span>{dataReport?.Status}</span>
        <div className=" absolute w-1 h-1 -bottom-2 right-0  border-[4px] border-solid  border-t-red-400  border-l-red-400 border-r-transparent border-b-transparent brightness-75 scale-y-75 origin-top"></div>
      </div>
    </div>
  )
}

ReportItem.propTypes = propTypes
export default ReportItem
