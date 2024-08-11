import { DatePicker, Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AsyncButton from '../../../common/components/AsyncButton'
import { useForm } from 'antd/es/form/Form'
import {
  addListItemService,
  getItemService,
  getItemsService,
  updateListItemService
} from '../../../common/services'
import lists from '../../../common/lists'
import { useUI } from '../../../common/UIProvider'
import { handleError } from '../../../common/helpers'

const formMode = {
  edit: 'edit',
  new: 'new'
}

const propTypes = {
  selectedWorkLocation: PropTypes.string,
  selectedDate: PropTypes.object,
  selectedLocation: PropTypes.object,
  setSelectedLocation: PropTypes.func,
  user: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  mode: PropTypes.oneOf(['new', 'edit']).isRequired
}

const AddPeopleFollowGembaForm = ({
  selectedWorkLocation,
  selectedLocation,
  selectedDate,
  user,
  onSubmit,
  onCancel,
  mode
}) => {
  const ui = useUI()
  const [form] = useForm()
  const [areas, setArea] = useState([])
  const [machines, setMachines] = useState([])
  const [processes, setProcesses] = useState([])
  const [tasks, setTasks] = useState([])

  const getAreasByLocation = async () => {
    if (selectedLocation === undefined) return

    let data = await getItemsService(lists.Areas, {
      filter: `Status eq 'Activated' and LocationID eq '${selectedLocation.Title}' and WorkLocationID eq '${selectedWorkLocation}'`
    })
    setArea(data.value)
  }

  const getMachinesByArea = async (areaID) => {
    if (areaID === undefined) return

    let data = await getItemsService(lists.Machines, {
      filter: `Status eq 'Activated' and AreaID eq '${areaID}'`
    })
    setMachines(data.value)
  }

  const getProcessesByMachine = async (machineID) => {
    if (machineID === undefined) return

    let data = await getItemsService(lists.Processes, {
      filter: `Status eq 'Activated' and MachineID eq '${machineID}'`
    })
    setProcesses(data.value)
  }

  const getTasksByProcess = async (processID) => {
    if (processID === undefined) return

    let data = await getItemsService(lists.Tasks, {
      filter: `Status eq 'Activated' and ProcessID eq '${processID}'`
    })
    setTasks(data.value)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch (error) {
      return
    }

    const values = form.getFieldsValue()

    try {
      ui.notiSuccess('Successfully')

      if (mode === formMode.new) {
        let userGPID = await getItemService(lists.Users, user.account.ID)
        let date = values.Date.format('DD/MM/YYYY')

        values.PlanStatus = 'Lịch đột xuất'
        values.PlanItemStatus = 'New'
        values.GPID = userGPID.Title
        values.Date = date

        let data = await addListItemService(lists.WalkPlanContent, values)
        let walkPlanID = 'WalkPlan-' + data.ID
        await updateListItemService(lists.WalkPlanContent, data.ID, { Title: walkPlanID })
      }

      return onSubmit(values)
    } catch (error) {
      ui.notiError('Failed')
      handleError(error)
    }
  }

  useEffect(() => {
    getAreasByLocation()
  }, [])

  return (
    <div>
      <Form layout="vertical" form={form}>
        <Form.Item label="Ngày:" name="Date" initialValue={selectedDate}>
          <DatePicker format={'DD/MM/YYYY'} defaultValue={selectedDate} disabled />
        </Form.Item>
        <Form.Item initialValue={selectedWorkLocation} label="Nhà máy:" name="WorkLocationID">
          <Select defaultValue={selectedWorkLocation} disabled></Select>
        </Form.Item>
        <Form.Item label="Khu vực:" name="LocationID" initialValue={selectedLocation?.Title}>
          <Select defaultValue={selectedLocation?.Title} disabled>
            <Select.Option key={selectedLocation?.Title} value={selectedLocation?.Title}>
              {selectedLocation?.LocationName}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Vị trí làm việc:"
          name="AreaID"
          rules={[{ required: true, message: 'Không được bỏ trống' }]}>
          <Select onChange={(item) => getMachinesByArea(item)}>
            {areas.map((item) => (
              <Select.Option key={item.ID} value={item.Title}>
                {item.AreaName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Máy, thiết bị liên quan:" name="MachineID">
          <Select onChange={(item) => getProcessesByMachine(item)}>
            {machines.map((item) => (
              <Select.Option key={item.ID} value={item.Title}>
                {item.MachineName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Quy trình:" name="ProcessID">
          <Select onChange={(item) => getTasksByProcess(item)}>
            {processes.map((item) => (
              <Select.Option key={item.ID} value={item.Title}>
                {item.ProcessName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Công việc:" name="TaskID">
          <Select>
            {tasks.map((item) => (
              <Select.Option key={item.ID} value={item.Title}>
                {item.TaskName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <div className="d-flex justify-content-end mt-4">
        <AsyncButton icon={<i className="fa-regular fa-circle-xmark"></i>} onClick={onCancel}>
          Cancel
        </AsyncButton>
        <AsyncButton
          icon={<i className="fa-solid fa-paper-plane"></i>}
          className="ms-2"
          type="primary"
          onClick={handleSubmit}>
          {mode === formMode.new ? 'Create' : 'Update'}
        </AsyncButton>
      </div>
    </div>
  )
}

AddPeopleFollowGembaForm.propTypes = propTypes

export default AddPeopleFollowGembaForm
