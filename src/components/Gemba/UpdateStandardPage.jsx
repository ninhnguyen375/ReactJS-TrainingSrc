import React, { useState } from 'react'
import { Select } from 'antd'
import {
  CloseOutlined,
  DownOutlined,
  RightOutlined,
  CheckCircleTwoTone,
  EditTwoTone
} from '@ant-design/icons'

const optionsFactory = [
  { label: 'Nhà máy Bắc Ninh', value: 'NMBN' },
  { label: 'Nhà máy Cần Thơ', value: 'NMCT' },
  { label: 'Nhà máy Đồng Nai', value: 'NMĐN' }
]

const optionsRoute = [
  { label: 'Phòng nước & Tiền xử lý', value: 'PN&TXL', factory: 'NMBN' },
  { label: 'Khu phụ trợ', value: 'KPT', factory: 'NMBN' },
  { label: 'Kho thành phẩm', value: 'KTP', factory: 'NMBN' },
  { label: 'Phòng Vi sinh', value: 'PVS', factory: 'NMCT' },
  { label: 'Phòng Hóa lý 1', value: 'PHL1', factory: 'NMCT' }
]

const optionsPitStop = [
  { label: 'Xử lý nước', value: 'XLN', route: 'PN&TXL' },
  { label: 'Kho thành phẩm', value: 'KTP', route: 'KTP' },
  { label: 'Phòng Vi sinh', value: 'PVS', route: 'PVS' },
  { label: 'Phòng Hóa lý 1', value: 'PHL1', route: 'PHL1' }
]

const listCheck = [
  {
    ID: 1,
    criteria:
      '(Q) Nền, tường, trần, cống thoát nước đạt tiêu chuẩn theo GMP (không mốc, nứt/bể, dột,….)',
    isCheck: true,
    type: 'Area',
    pitStop: 'XLN'
  },
  {
    ID: 2,
    criteria:
      '(S) Các van, công tắc điều khiển và kiểm soát nguồn năng lượng đang hoạt động bình thường',
    isCheck: true,
    type: 'Area',
    pitStop: 'PVS'
  },
  {
    ID: 3,
    criteria:
      '(Q) Thiết bị được sử dụng sửa chữa tạm (nếu có) phải đúng chủng loại và nằm trong DS vật liệu được phê duyệt',
    isCheck: true,
    type: 'Equipment',
    pitStop: 'XLN'
  },
  {
    ID: 4,
    criteria: '(Q) Các bề mặt tiếp xúc trực tiếp với sản phẩm không có dấu hiệu gỉ sét, nứt/bể',
    isCheck: false,
    type: 'Equipment',
    pitStop: 'XLN'
  },
  {
    ID: 5,
    criteria:
      '(Q) Nhân viên tuân thủ việc kiểm tra, ghi nhận kết quả các điểm PtCs, các thông số CCP/oPRP',
    isCheck: true,
    type: 'Job',
    pitStop: 'XLN'
  },
  {
    ID: 6,
    criteria:
      '(S,Q,D) Hồ sơ, báo cáo kiểm tra được ghi nhận đầy đủ và đúng tần suất theo hướng dẫn SOP/WI',
    isCheck: true,
    type: 'Job',
    pitStop: 'PVS'
  }
]

const UpdateStandardPage = () => {
  const [filteredOptionsRoute, setFilteredOptionsRoute] = useState([])
  const [filteredOptionsPitStop, setFilteredOptionsPitStop] = useState([])
  const [selectedFactory, setSelectedFactory] = useState('')
  const [selectedRoute, setSelectedRoute] = useState('')
  const [selectedPitStop, setSelectedPitStop] = useState('')

  //state quản lý trạng thái của 3 icon mở rộng mục A,B,C
  const [expandedSections, setExpandedSections] = useState({
    area: false,
    equipment: false,
    job: false
  })

  //Xử lý khi thay đổi lựa chọn Factory
  const handleFactoryChange = (value) => {
    const filteredRouteOptions = optionsRoute.filter((option) => option.factory === value)
    setFilteredOptionsRoute(filteredRouteOptions)
    setSelectedFactory(value)
    setSelectedRoute('')
    setSelectedPitStop('')
    setFilteredOptionsPitStop([])
  }

  //Xử lý khi thay đổi lựa chọn route
  const handleRouteChange = (value) => {
    const filteredPitStopOptions = optionsPitStop.filter((option) => option.route === value)
    setFilteredOptionsPitStop(filteredPitStopOptions)
    setSelectedRoute(value)
    setSelectedPitStop('')
  }

  //Clear Factory selected khi nhấn icon x
  const handleClearFactory = () => {
    setSelectedFactory('')
    setSelectedRoute('')
    setSelectedPitStop('')
    setFilteredOptionsRoute([])
    setFilteredOptionsPitStop([])
  }

  //Clear Route selected khi nhấn icon x
  const handleClearRoute = () => {
    setSelectedRoute('')
    setSelectedPitStop('')
    setFilteredOptionsPitStop([])
  }

  //Clear pitStop selected khi nhấn icon x
  const handleClearPitStop = () => {
    setSelectedPitStop('')
  }

  // Hàm quản lý trạng thái của 3 icon mở rộng các mục A,B,C
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  //Hàm filter checkList thỏa điều kiện theo selected Pit Stop và type
  const renderChecklist = (type) => {
    const filteredChecks = listCheck.filter(
      (item) => item.type === type && item.pitStop === selectedPitStop
    )
    if (filteredChecks.length === 0) return null
    return filteredChecks.map((item) => (
      <div key={item.ID} className="flex items-center mb-2">
        <p className="mr-2 min-w-[400px] w-[400px] break-words mb-2 sm:mb-0 sm:mr-4 text-base">
          {item.criteria}
        </p>
        {item.isCheck ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" className="text-lg mr-2" />
        ) : (
          <div className="w-4 h-4 mr-2" />
        )}
        <EditTwoTone className="text-lg text-blue-500" />
      </div>
    ))
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center mb-4">
        <div className="w-4 bg-blue-500 h-14 mr-4"></div>
        <h2 className="text-lg text-blue-500">CẬP NHẬT TIÊU CHUẨN GEMBA PITSTOP</h2>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center mb-4">
        <p className="text-lg mr-2 min-w-[150px] w-[150px] break-words mb-2 sm:mb-0 sm:mr-4">
          Nhà máy:
        </p>
        <Select
          value={selectedFactory}
          options={optionsFactory}
          className="w-full sm:w-[300px] border border-black"
          onChange={handleFactoryChange}
          suffixIcon={
            selectedFactory ? (
              <CloseOutlined
                className="select-clear-icon text-black"
                onClick={handleClearFactory}
              />
            ) : (
              <DownOutlined className="text-black" />
            )
          }
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center mb-4">
        <p className="text-lg mr-2 min-w-[150px] w-[150px] break-words mb-2 sm:mb-0 sm:mr-4">
          Route:
        </p>
        <Select
          value={selectedRoute}
          options={filteredOptionsRoute}
          className="w-full sm:w-[300px] border border-black"
          onChange={handleRouteChange}
          suffixIcon={
            selectedRoute ? (
              <CloseOutlined className="select-clear-icon text-black" onClick={handleClearRoute} />
            ) : (
              <DownOutlined className="text-black" />
            )
          }
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center mb-4">
        <p className="text-lg mr-2 min-w-[150px] w-[150px] break-words mb-2 sm:mb-0 sm:mr-4">
          Pitstop:
        </p>
        <Select
          value={selectedPitStop}
          options={filteredOptionsPitStop}
          className="w-full sm:w-[300px] border border-black"
          onChange={(value) => setSelectedPitStop(value)}
          suffixIcon={
            selectedPitStop ? (
              <CloseOutlined
                className="select-clear-icon text-black"
                onClick={handleClearPitStop}
              />
            ) : (
              <DownOutlined className="text-black" />
            )
          }
        />
      </div>
      <div className="mb-4">
        <h2 className="text-lg text-red-500 font-semibold">Danh sách câu hỏi theo Pitstop</h2>
      </div>
      <div className="mb-4">
        <div
          className="flex items-center mb-2 cursor-pointer"
          onClick={() => toggleSection('area')}>
          <h2 className="text-lg mr-2 min-w-[430px] w-[430px] break-words mb-2 sm:mb-0 sm:mr-4 font-bold">
            A. GEMBA Checklist khu vực
          </h2>
          {expandedSections.area ? (
            <DownOutlined className="text-lg text-black" />
          ) : (
            <RightOutlined className="text-lg text-black" />
          )}
        </div>
        {expandedSections.area && renderChecklist('Area')}
        <div
          className="flex items-center mb-2 cursor-pointer"
          onClick={() => toggleSection('equipment')}>
          <h2 className="text-lg mr-2 min-w-[430px] w-[430px] break-words mb-2 sm:mb-0 sm:mr-4 font-bold">
            B. GEMBA Checklist máy móc, thiết bị
          </h2>
          {expandedSections.equipment ? (
            <DownOutlined className="text-lg text-black" />
          ) : (
            <RightOutlined className="text-lg text-black" />
          )}
        </div>
        {expandedSections.equipment && renderChecklist('Equipment')}
        <div className="flex items-center mb-2 cursor-pointer" onClick={() => toggleSection('job')}>
          <h2 className="text-lg mr-2 min-w-[430px] w-[430px] break-words mb-2 sm:mb-0 sm:mr-4 font-bold">
            C. GEMBA Checklist công việc, thao tác
          </h2>
          {expandedSections.job ? (
            <DownOutlined className="text-lg text-black" />
          ) : (
            <RightOutlined className="text-lg text-black" />
          )}
        </div>
        {expandedSections.job && renderChecklist('Job')}
      </div>
    </div>
  )
}

export default UpdateStandardPage
