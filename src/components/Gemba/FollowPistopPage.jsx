import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Modal, Select } from 'antd'
import {
  faPlus,
  faCalendarAlt,
  faTimes,
  faClipboardList,
  faArrowsRotate
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getItemsService } from '../../common/services'
import lists from '../../common/lists'
import AddPeopleFollowGembaForm from './forms/AddPeopleFollowGembaForm'
import { useAuth } from '../../common/AuthProvider'
import dayjs from '../../common/dayjs'
import { faCalendarXmark } from '@fortawesome/free-regular-svg-icons'
import StartEndComponent from './components/StartEndComponent'
import ListPitstopComponent from './components/ListPitstopComponent'

const { RangePicker } = DatePicker

function FollowPistopPage() {
  const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const [loading, setLoading] = useState(false)
  const { profile } = useAuth()
  const [workLocations, setWorkLocations] = useState([])
  const [locations, setLocations] = useState([])
  const [walkPlanContents, setWalkPlanContents] = useState([])
  const [selectedWalkPlanContent, setSelectedWalkPlanContent] = useState({})
  const [isShowAddPeopleFollowGemba, setIsShowAddPeopleFollowGemba] = useState(false)
  const [selectedWorkLocation, setSelectedWorkLocation] = useState('BNP')
  const [selectedLocation, setSelectedLocation] = useState({})
  const [selectedAreaByWalkPlanContent, setSelectedAreaByWalkPlanContent] = useState({})
  const [areaByWalkPlanContents, setAreaByWalkPlanContents] = useState([])
  const [selectedRange, setSelectedRange] = useState([
    dayjs().startOf('week'),
    dayjs().endOf('week')
  ])
  const [selectedDate, setSelectedDate] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [highlightedCell, setHighlightedCell] = useState(null) // New state for highlighted cell

  const getWorklocations = async () => {
    let data = await getItemsService(lists.WorkLocations, {
      filter: `Status eq 'Activated'`
    })
    setWorkLocations(data.value)
  }

  const getRouteByWorkLocation = async () => {
    if (selectedWorkLocation === '') return

    let data = await getItemsService(lists.Locations, {
      filter: `Status eq 'Activated' and WorkLocationID eq '${selectedWorkLocation}'`
    })
    setLocations(data.value)
  }

  const getAreaByWalkPlanContent = async (walkPlanContent) => {
    if (walkPlanContent === undefined || walkPlanContent === null)
      setSelectedAreaByWalkPlanContent({})

    let data = await getItemsService(lists.Areas, {
      filter: `Status eq 'Activated' and Title eq '${walkPlanContent?.AreaID}'`,
      top: 1
    })

    setSelectedAreaByWalkPlanContent(data.value[0])
  }

  const getAreaByWalkPlanContents = async (walkPlanContents) => {
    setLoading(true)
    setAreaByWalkPlanContents([]) // Reset pitstops
    // Filter walk plan contents based on selected route and current date
    let walkPlanContentsByRouteID = walkPlanContents.filter(
      (item) => item.LocationID === selectedLocation.Title && item.Date === selectedDate
    )

    // Fetch pitstops for each filtered walk plan content
    let areas = await Promise.all(
      walkPlanContentsByRouteID.map(async (walkPlanContent) => {
        let response = await getItemsService(lists.Areas, {
          filter: `Status eq 'Activated' and Title eq '${walkPlanContent.AreaID}'`
        })
        return response.value[0] // Assuming the API returns an array and we need the first item
      })
    )

    // Update state with fetched pitstops
    setAreaByWalkPlanContents(areas)
    setLoading(false)
  }

  const getWalkPlanContentData = async (range) => {
    if (selectedWorkLocation === '') return

    let startDate = range[0].format('DD/MM/YYYY')
    let endDate = range[1].format('DD/MM/YYYY')

    let data = await getItemsService(lists.WalkPlanContent, {
      filter: `WorkLocationID eq '${selectedWorkLocation}' and Date ge '${startDate}' and Date le '${endDate}'`
    })

    setWalkPlanContents(data.value)
  }

  // Manage hover states in an object
  const [hovered, setHovered] = useState({})

  const handleMouseEnter = (rowIndex, colIndex) => {
    setHovered((prev) => ({
      ...prev,
      [`${rowIndex}-${colIndex}`]: true
    }))
  }

  const handleMouseLeave = (rowIndex, colIndex) => {
    setHovered((prev) => ({
      ...prev,
      [`${rowIndex}-${colIndex}`]: false
    }))
  }

  const handleChangeWorkLocation = (item) => {
    setSelectedWorkLocation(item)
  }

  const handleRangeChange = (dates) => {
    setSelectedRange(dates)
    getWalkPlanContentData(dates)
  }

  useEffect(() => {
    getWorklocations()
    getRouteByWorkLocation()
    getWalkPlanContentData(selectedRange)
    getAreaByWalkPlanContent(null)
  }, [selectedWorkLocation, selectedRange])

  // Get start and end of the current week
  const startOfWeek = dayjs().startOf('week') // Monday
  const endOfWeek = dayjs().endOf('week') // Sunday
  const defaultRange = [startOfWeek, endOfWeek]

  return (
    <div className="p-2">
      <div className="flex justify-end mb-3">
        <Button type="primary" className="mr-2">
          <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
          Dời lịch
        </Button>
        <Button type="primary">
          <FontAwesomeIcon icon={faCalendarXmark} className="mr-2" />
          Hủy lịch
        </Button>
      </div>
      <div className="mb-3">
        <label className="m-2 font-bold">Tuần GEMBA:</label>
        <RangePicker
          defaultValue={defaultRange}
          format={'DD/MM/YYYY'}
          onChange={handleRangeChange}
        />
      </div>
      <div className="mb-3">
        <label className="m-2 font-bold">Nhà máy:</label>
        <Select className="w-52 ml-1" onChange={(item) => handleChangeWorkLocation(item)}>
          {workLocations.map((item) => (
            <Select.Option key={item.ID} value={item.Title}>
              {item.WorkLocationName}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="mb-3 text-center font-bold  text-lg grid grid-cols-[1fr,auto] items-center">
        <span className="justify-self-center text-red-500">Bảng phân công GEMBA theo tuần</span>
        <div className="justify-self-end">
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className="mr-3 text-blue-400 cursor-pointer"
            onClick={() => getWalkPlanContentData(selectedRange)}
          />
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-black w-48"></th>
            {labels.map((label, index) => (
              <th key={index} className="border border-black p-2 text-center">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {locations.map((item, rowIndex) => (
            <tr key={item.ID}>
              <td className="border border-black p-2 text-left text-wrap">{item.LocationName}</td>
              {labels.map((label, colIndex) => {
                const currentDate = dayjs(selectedRange[0].clone().add(colIndex, 'days'))

                const walkPlanContent = walkPlanContents.find(
                  (content) =>
                    content.LocationID === item.Title &&
                    content.Date === currentDate.format('DD/MM/YYYY')
                )

                const isPastDate = currentDate.isBefore(dayjs(), 'day')

                return (
                  <td
                    key={colIndex}
                    className={`border border-black p-2 text-center relative ${
                      highlightedCell &&
                      highlightedCell.rowIndex === rowIndex &&
                      highlightedCell.colIndex === colIndex
                        ? 'bg-yellow-200' // Highlight style
                        : ''
                    }`}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseLeave={() => handleMouseLeave(rowIndex, colIndex)}>
                    {walkPlanContent && (
                      <FontAwesomeIcon
                        className="text-green-500 cursor-pointer"
                        icon={faCalendarAlt}
                        onClick={() => {
                          setSelectedLocation(item)
                          setSelectedDate(currentDate.format('DD/MM/YYYY'))
                          getAreaByWalkPlanContents(walkPlanContents)
                          getAreaByWalkPlanContent(walkPlanContent)
                          setSelectedWalkPlanContent(walkPlanContent)
                          setHighlightedCell({ rowIndex, colIndex }) // Update highlighted cell
                        }}
                      />
                    )}
                    {isPastDate && !walkPlanContent ? (
                      <FontAwesomeIcon className="text-red-500" icon={faTimes} />
                    ) : (
                      hovered[`${rowIndex}-${colIndex}`] &&
                      !walkPlanContent && (
                        <FontAwesomeIcon
                          className="cursor-pointer absolute inset-0 m-auto"
                          icon={faPlus}
                          id={`${rowIndex}-${colIndex}`}
                          onClick={() => {
                            setSelectedLocation(item)
                            setSelectedDate(currentDate)
                            setIsShowAddPeopleFollowGemba(true)
                          }}
                        />
                      )
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ListPitstopComponent
        walkPlanContents={walkPlanContents}
        areaByWalkPlanContents={areaByWalkPlanContents}
        selectedDate={
          selectedDate instanceof dayjs ? selectedDate.format('DD/MM/YYYY') : selectedDate
        }
        selectedWalkPlanContent={selectedWalkPlanContent}
      />

      <StartEndComponent />

      <Modal
        destroyOnClose
        title="Chọn quy trình công việc đi GEMBA"
        open={isShowAddPeopleFollowGemba}
        footer={[]}
        onCancel={() => {
          setIsShowAddPeopleFollowGemba(false)
        }}>
        <AddPeopleFollowGembaForm
          onSubmit={() => {
            getWorklocations()
            getRouteByWorkLocation()
            getWalkPlanContentData(selectedRange)
            setIsShowAddPeopleFollowGemba(false)
          }}
          onCancel={() => {
            setIsShowAddPeopleFollowGemba(false)
          }}
          user={profile}
          selectedWorkLocation={selectedWorkLocation}
          selectedLocation={selectedLocation}
          selectedDate={dayjs(selectedDate, 'DD/MM/YYYY')}
          mode="new"
        />
      </Modal>
    </div>
  )
}

export default FollowPistopPage
