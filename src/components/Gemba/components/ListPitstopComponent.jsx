import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input } from 'antd'
import dayjs from '../../../common/dayjs'
import { useNavigate } from 'react-router-dom'

const propTypes = {
  areaByWalkPlanContents: PropTypes.array,
  selectedDate: PropTypes.string,
  selectedWalkPlanContent: PropTypes.object
}

const ListPitstopComponent = ({
  areaByWalkPlanContents = [], // Default to an empty array
  selectedDate,
  selectedWalkPlanContent
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col mt-3 mb-3 items-end">
      {areaByWalkPlanContents.map((area) => (
        <div key={area.ID} className="flex mb-2 items-center w-full">
          <Input className="w-full mr-3" disabled value={area.AreaName} />
          <Button
            type="primary"
            onClick={() => {
              navigate(`/gemba/route-pitstop/follow/${selectedWalkPlanContent.ID}`)
            }}
            disabled={!area.AreaName}>
            {selectedDate !== dayjs().format('DD/MM/YYYY') ? 'Xem chi tiết' : 'Bắt đầu'}
          </Button>
        </div>
      ))}
    </div>
  )
}

ListPitstopComponent.propTypes = propTypes

export default ListPitstopComponent
